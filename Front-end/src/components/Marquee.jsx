const words = ['Velocidade', 'Precisão', 'Consistência', 'Conquistas', 'Foco', 'Fluência']

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((group) => (
          <div className="marquee__group" key={group}>
            {words.map((word) => (
              <span className="marquee__item" key={word}>
                {word}
                <span className="marquee__star">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
