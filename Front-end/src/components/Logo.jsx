import { Link } from 'react-router-dom'

export default function Logo({ light = false, to = null }) {
  const content = (
    <>
      <span className="logo__mark" aria-hidden="true">
        <span className="logo__letter">d</span>
        <span className="logo__caret" />
      </span>
      <span className="logo__word">
        Digita<span>Course</span>
      </span>
    </>
  )

  if (to) {
    return (
      <Link
        className={`logo${light ? ' logo--light' : ''}`}
        to={to}
        aria-label="DigitaCourse — ir para o início"
      >
        {content}
      </Link>
    )
  }

  return (
    <a
      className={`logo${light ? ' logo--light' : ''}`}
      href="#top"
      aria-label="DigitaCourse — voltar ao início"
    >
      {content}
    </a>
  )
}
