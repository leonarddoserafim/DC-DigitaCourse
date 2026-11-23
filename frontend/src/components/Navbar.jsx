import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Logo from './Logo'
import { ArrowUpRight, Close, Menu } from './Icons'

const links = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#progresso', label: 'Evolução' },
  { href: '#duvidas', label: 'Dúvidas' },
]

export default function Navbar() {
  const { isAuthenticated } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const actions = isAuthenticated
    ? [
        { to: '/app/perfil', label: 'Meu perfil', primary: false },
        { to: '/app', label: 'Ir para o painel', primary: true },
      ]
    : [
        { to: '/entrar', label: 'Entrar', primary: false },
        { to: '/cadastro', label: 'Começar agora', primary: true },
      ]

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container nav">
        <Logo />

        <nav className="nav__links" aria-label="Navegação principal">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          {actions.map((action) => (
            <Link
              key={action.to}
              className={`btn btn--sm ${action.primary ? 'btn--primary' : 'btn--ghost'}`}
              to={action.to}
            >
              {action.label}
              {action.primary && (
                <span className="btn__icon" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              )}
            </Link>
          ))}
        </div>

        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu" id="mobile-menu">
          <nav className="mobile-menu__links" aria-label="Navegação móvel">
            {links.map((link, index) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mobile-menu__actions">
            {actions.map((action) => (
              <Link
                key={action.to}
                className={`btn ${action.primary ? 'btn--primary' : 'btn--ghost'}`}
                to={action.to}
                onClick={() => setOpen(false)}
              >
                {action.label}
                {action.primary && <ArrowUpRight size={17} />}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
