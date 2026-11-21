const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')
const TOKEN_KEY = 'digitacourse:token:v1'

// Etapa 02 guardava contas e sessão simuladas no navegador. A Etapa 03 usa a API,
// então os dados antigos são removidos para não deixar informações obsoletas.
try {
  window.localStorage.removeItem('digitacourse:accounts:v1')
  window.localStorage.removeItem('digitacourse:session:v1')
} catch {
  // Storage may be unavailable; the app still works in memory.
}

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function readStoredToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

let token = readStoredToken()

export function getToken() {
  return token
}

export function storeToken(value) {
  token = value
  try {
    window.localStorage.setItem(TOKEN_KEY, value)
  } catch {
    // The session still works in memory when storage is unavailable.
  }
}

export function clearToken() {
  token = null
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Ignore storage failures.
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(
      'Não foi possível conectar à API. Verifique se o back-end está em execução.',
    )
  }

  const raw = await response.text()
  let payload = null
  if (raw) {
    try {
      payload = JSON.parse(raw)
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) clearToken()
    throw new ApiError(
      payload?.message ?? `Não foi possível concluir a solicitação (${response.status}).`,
      response.status,
    )
  }

  return payload
}

export const api = {
  getCatalog: () => request('/catalog', { auth: false }),
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: credentials, auth: false }),
  demoLogin: () => request('/auth/demo', { method: 'POST', auth: false }),
  signup: (data) => request('/auth/signup', { method: 'POST', body: data, auth: false }),
  restoreDemo: () => request('/auth/demo/restore', { method: 'POST', auth: false }),
  me: () => request('/me'),
  updateProfile: (data) => request('/me', { method: 'PATCH', body: data }),
  resetProgress: () => request('/me/reset-progress', { method: 'POST' }),
  recordAttempt: (lessonId, data) =>
    request(`/lessons/${encodeURIComponent(lessonId)}/attempts`, {
      method: 'POST',
      body: data,
    }),
  markNotificationRead: (notificationId) =>
    request(`/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: 'PATCH',
    }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PATCH' }),
}
