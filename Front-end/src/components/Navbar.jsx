import { useEffect, useState } from 'react'
import Logo from './Logo'
import { ArrowUpRight, Close, Menu } from './Icons'

const links = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#progresso', label: 'Evolução' },
  { href: '#duvidas', label: 'Dúvidas' },
]

export default function Navbar({ onComingSoon }) {
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

  const handleComingSoon = () => {
    setOpen(false)
    onComingSoon()
  }

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
          <button className="btn btn--ghost btn--sm" type="button" onClick={handleComingSoon}>
            Entrar
          </button>
          <button className="btn btn--primary btn--sm" type="button" onClick={handleComingSoon}>
            Começar agora
            <span className="btn__icon" aria-hidden="true">
              <ArrowUpRight size={16} />
            </span>
          </button>
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
            <button className="btn btn--ghost" type="button" onClick={handleComingSoon}>
              Entrar
            </button>
            <button className="btn btn--primary" type="button" onClick={handleComingSoon}>
              Começar agora
              <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
