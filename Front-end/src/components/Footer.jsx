import Logo from './Logo'
import { ArrowUp } from './Icons'

const links = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#progresso', label: 'Evolução' },
  { href: '#duvidas', label: 'Dúvidas' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo light />
            <p>
              Uma plataforma de treinamento de digitação para transformar velocidade e precisão em
              confiança no dia a dia.
            </p>
          </div>

          <div className="footer__col">
            <h4>Navegar</h4>
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Projeto</h4>
            <ul>
              <li>Fatec Praia Grande</li>
              <li>Baixada Santista · SP</li>
              <li>Projeto acadêmico</li>
              <li>Em desenvolvimento · 2026</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 DigitaCourse. Todos os direitos reservados.</span>
          <a className="footer__top-link" href="#top">
            Voltar ao topo
            <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}
