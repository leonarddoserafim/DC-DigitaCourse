export default function Logo({ light = false }) {
  return (
    <a className={`logo${light ? ' logo--light' : ''}`} href="#top" aria-label="DigitaCourse — voltar ao início">
      <span className="logo__mark" aria-hidden="true">
        <span className="logo__letter">d</span>
        <span className="logo__caret" />
      </span>
      <span className="logo__word">
        Digita<span>Course</span>
      </span>
    </a>
  )
}
