import { forwardRef } from 'react'

/** Texto de un capítulo del recorrido. Las clases js-* las anima el timeline. */
const Line = ({ children, className = '' }) => (
  <span className={`mask ${className}`}>
    <span className="js-line">{children}</span>
  </span>
)

const ChapterText = forwardRef(function ChapterText({ chapter, index, intro, liveRefs, onStart, whatsappHref }, ref) {
  const eyebrow = (
    <p className="chapter__eyebrow js-fade">
      <span>{chapter.number}</span> {chapter.title}
    </p>
  )

  // Capítulo 01: titular principal del sitio.
  if (intro) {
    return (
      <article ref={ref} className="chapter chapter--intro" data-index={index}>
        {eyebrow}
        <h1 className="chapter__display">
          {intro.headline.map((l, i) => (
            <Line key={l} className={i === 1 ? 'is-accent' : ''}>{l}</Line>
          ))}
        </h1>
        <p className="chapter__sub js-fade">{intro.sub}</p>
        <div className="chapter__actions js-fade">
          <button type="button" className="btn btn--light" onClick={onStart}>
            {intro.cta} <span aria-hidden="true">↓</span>
          </button>
        </div>
      </article>
    )
  }

  // Capítulo final: la taza.
  if (chapter.final) {
    return (
      <article ref={ref} className="chapter chapter--final" data-index={index}>
        {eyebrow}
        <h2 className="chapter__display">
          <Line>Del origen</Line>
          <Line className="is-accent">a tu taza.</Line>
        </h2>
        <div className="chapter__actions js-fade">
          <a className="btn btn--light" href="#historia">Conoce nuestra historia</a>
          <a className="btn btn--brand" href={whatsappHref} target="_blank" rel="noreferrer">
            Pedir por WhatsApp <span aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    )
  }

  return (
    <article ref={ref} className="chapter" data-index={index}>
      {eyebrow}
      <h2 className="chapter__title">
        <Line>{chapter.copy}</Line>
      </h2>

      {chapter.data && (
        <dl className="chapter__data js-fade">
          {chapter.data.map((d) => (
            <div key={d.label}>
              <dt>{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {chapter.live && (
        <dl className="chapter__data chapter__data--live js-fade" aria-label="Receta de filtrado del empaque">
          <div>
            <dt>Agua</dt>
            <dd ref={(el) => (liveRefs.current.water = el)}>0 ml</dd>
          </div>
          <div>
            <dt>Extracción</dt>
            <dd ref={(el) => (liveRefs.current.time = el)}>0:00</dd>
          </div>
        </dl>
      )}
    </article>
  )
})

export default ChapterText
