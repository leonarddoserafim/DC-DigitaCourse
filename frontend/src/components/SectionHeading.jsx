export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'dark',
}) {
  return (
    <div
      className={`section-heading section-heading--${align} section-heading--${tone}`}
      data-reveal
    >
      <span className="section-eyebrow">
        <span />
        {eyebrow}
      </span>
      <h2 id={id}>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
