import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { getInitials } from '../../lib/format'
import Logo from '../Logo'
import {
  BookOpen,
  Close,
  Compass,
  Chart,
  Home,
  LogOut,
  Settings,
  Trophy,
  Users,
  Zap,
} from '../Icons'

const navigation = [
  { to: '/app', label: 'Visão geral', icon: Home, end: true },
  { to: '/app/trilhas', label: 'Trilhas', icon: BookOpen },
  { to: '/app/desafios', label: 'Desafios', icon: Compass },
  { to: '/app/progresso', label: 'Progresso', icon: Chart },
  { to: '/app/conquistas', label: 'Conquistas', icon: Trophy },
  { to: '/app/ranking', label: 'Ranking', icon: Users },
]

export default function Sidebar({ open, onClose }) {
  const { user, stats, logout } = useApp()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    onClose?.()
    logout()
    showToast('Sessão encerrada', 'Até a próxima prática.')
    navigate('/')
  }

  return (
    <aside
      className={`app-sidebar${open ? ' is-open' : ''}`}
      aria-label="Navegação da área do aluno"
    >
      <div className="app-sidebar__head">
        <Logo light to="/app" />
        <button
          className="app-sidebar__close"
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <Close size={20} />
        </button>
      </div>

      <div className="app-sidebar__level">
        <div className="app-sidebar__level-top">
          <span className="app-level-chip">
            <Zap size={13} />
            Nível {stats.level}
          </span>
          <span className="app-sidebar__xp">
            {stats.levelXp}/{stats.levelXpTarget} XP
          </span>
        </div>
        <div className="app-progress" aria-hidden="true">
          <span style={{ width: `${(stats.levelXp / stats.levelXpTarget) * 100}%` }} />
        </div>
      </div>

      <nav className="app-nav" aria-label="Seções do painel">
        <span className="app-nav__label">Aprender</span>
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `app-nav__link${isActive ? ' is-active' : ''}`}
              onClick={onClose}
            >
              <Icon size={19} />
              <span>{item.label}</span>
              <span className="app-nav__dot" aria-hidden="true" />
            </NavLink>
          )
        })}

        <span className="app-nav__label app-nav__label--spaced">Conta</span>
        <NavLink
          to="/app/perfil"
          className={({ isActive }) => `app-nav__link${isActive ? ' is-active' : ''}`}
          onClick={onClose}
        >
          <Settings size={19} />
          <span>Perfil e ajustes</span>
          <span className="app-nav__dot" aria-hidden="true" />
        </NavLink>
        <Link to="/" className="app-nav__link app-nav__link--muted" onClick={onClose}>
          <ArrowSiteIcon />
          <span>Voltar ao site</span>
        </Link>
      </nav>

      <div className="app-sidebar__footer">
        <Link className="app-user" to="/app/perfil" onClick={onClose}>
          <span className="app-avatar app-avatar--sm">{getInitials(user?.name)}</span>
          <span className="app-user__text">
            <strong>{user?.name}</strong>
            <small>Aluno · DigitaCourse</small>
          </span>
        </Link>
        <button
          className="app-logout"
          type="button"
          onClick={handleLogout}
          aria-label="Sair da conta"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  )
}

function ArrowSiteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  )
}
