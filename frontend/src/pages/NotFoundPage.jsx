import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { ArrowLeft, ArrowUpRight, Home, Keyboard } from '../components/Icons'
import { useApp } from '../context/AppContext'
import usePageMeta from '../hooks/usePageMeta'

export default function NotFoundPage() {
  const { isAuthenticated } = useApp()

  usePageMeta(
    'Página não encontrada — DigitaCourse',
    'O endereço acessado não existe no DigitaCourse.',
  )

  return (
    <main className="not-found">
      <div className="not-found__top">
        <Logo to="/" />
        <Link className="not-found__back" to="/">
          <ArrowLeft size={15} />
          Voltar ao início
        </Link>
      </div>

      <section className="not-found__card" data-reveal>
        <div className="not-found__keys" aria-hidden="true">
          <span>4</span>
          <span className="is-home">0</span>
          <span>4</span>
        </div>
        <span className="app-eyebrow">Erro 404</span>
        <h1>Essa tecla não existe.</h1>
        <p>
          O endereço que você tentou abrir saiu da home row. Volte para uma página conhecida e
          continue a prática de onde parou.
        </p>
        <div className="not-found__actions">
          <Link className="btn btn--primary" to={isAuthenticated ? '/app' : '/'}>
            <Home size={16} />
            {isAuthenticated ? 'Ir para o painel' : 'Voltar para a página inicial'}
          </Link>
          <Link className="btn btn--outline" to={isAuthenticated ? '/app/trilhas' : '/entrar'}>
            {isAuthenticated ? 'Ver trilhas' : 'Entrar na conta'}
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="not-found__hint">
          <Keyboard size={16} />
          Dica: use o menu para navegar sem sair do seu ritmo.
        </div>
      </section>

      <p className="not-found__foot">DigitaCourse · projeto acadêmico Fatec Praia Grande</p>
    </main>
  )
}
