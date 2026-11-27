import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const TOKEN_KEY = 'digitacourse:token:v1'

function mockResponse({ status = 200, body = '' } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => body,
  }
}

async function loadApi() {
  return import('./api')
}

describe('cliente HTTP da API', () => {
  let fetchMock

  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('persiste e limpa o token da sessão', async () => {
    const { clearToken, getToken, storeToken } = await loadApi()

    storeToken('token-123')
    expect(getToken()).toBe('token-123')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('token-123')

    clearToken()
    expect(getToken()).toBeNull()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('recupera o token salvo ao carregar o módulo', async () => {
    localStorage.setItem(TOKEN_KEY, 'token-salvo')

    const { getToken } = await loadApi()

    expect(getToken()).toBe('token-salvo')
  })

  it('busca o catálogo público sem autenticação', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({ body: JSON.stringify([{ id: 'fundamentos', title: 'Fundamentos' }]) }),
    )
    const { api } = await loadApi()

    const catalog = await api.getCatalog()

    expect(catalog).toEqual([{ id: 'fundamentos', title: 'Fundamentos' }])
    expect(fetchMock).toHaveBeenCalledWith('/api/catalog', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: undefined,
    })
  })

  it('envia credenciais de login como JSON', async () => {
    fetchMock.mockResolvedValue(mockResponse({ body: JSON.stringify({ token: 'abc' }) }))
    const { api } = await loadApi()
    const credentials = { email: 'marina@digitacourse.com', password: 'demo1234' }

    await api.login(credentials)

    expect(fetchMock).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
  })

  it('inclui o Bearer token nas requisições autenticadas', async () => {
    fetchMock.mockResolvedValue(mockResponse({ body: JSON.stringify({ name: 'Marina' }) }))
    const { api, storeToken } = await loadApi()
    storeToken('token-123')

    await api.me()

    expect(fetchMock).toHaveBeenCalledWith('/api/me', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer token-123',
      },
      body: undefined,
    })
  })

  it('envia atualização de perfil com PATCH', async () => {
    fetchMock.mockResolvedValue(mockResponse({ body: JSON.stringify({ user: {} }) }))
    const { api, storeToken } = await loadApi()
    storeToken('token-123')
    const data = { name: 'Marina Costa', dailyGoalMinutes: 15 }

    await api.updateProfile(data)

    expect(fetchMock).toHaveBeenCalledWith('/api/me', {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-123',
      },
      body: JSON.stringify(data),
    })
  })

  it('codifica o identificador da lição na URL de tentativa', async () => {
    fetchMock.mockResolvedValue(mockResponse({ body: '{}' }))
    const { api, storeToken } = await loadApi()
    storeToken('token-123')

    await api.recordAttempt('fund 01', { wpm: 60, accuracy: 98 })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/lessons/fund%2001/attempts',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('limpa a sessão e propaga a mensagem em uma resposta 401', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        status: 401,
        body: JSON.stringify({ message: 'Sessão expirada. Entre novamente.' }),
      }),
    )
    const { api, getToken, storeToken } = await loadApi()
    storeToken('token-123')

    await expect(api.me()).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      message: 'Sessão expirada. Entre novamente.',
    })
    expect(getToken()).toBeNull()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('não limpa o token quando o 401 vem de um login inválido', async () => {
    fetchMock.mockResolvedValue(
      mockResponse({
        status: 401,
        body: JSON.stringify({ message: 'E-mail ou senha incorretos.' }),
      }),
    )
    const { api, getToken, storeToken } = await loadApi()
    storeToken('token-existente')

    await expect(api.login({ email: 'a@b.com', password: 'errada' })).rejects.toMatchObject({
      status: 401,
      message: 'E-mail ou senha incorretos.',
    })
    expect(getToken()).toBe('token-existente')
  })

  it('usa uma mensagem padrão quando o erro não traz JSON', async () => {
    fetchMock.mockResolvedValue(mockResponse({ status: 500, body: 'erro interno' }))
    const { api } = await loadApi()

    await expect(api.getCatalog()).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
      message: 'Não foi possível concluir a solicitação (500).',
    })
  })

  it('retorna null para respostas sem corpo', async () => {
    fetchMock.mockResolvedValue(mockResponse({ status: 204 }))
    const { api, storeToken } = await loadApi()
    storeToken('token-123')

    await expect(api.resetProgress()).resolves.toBeNull()
  })

  it('traduz falhas de rede em uma mensagem amigável', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    const { api } = await loadApi()

    await expect(api.getCatalog()).rejects.toThrow(
      'Não foi possível conectar à API. Verifique se o back-end está em execução.',
    )
  })
})
