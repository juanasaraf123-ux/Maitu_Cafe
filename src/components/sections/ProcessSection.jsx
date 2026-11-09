import { useRef } from 'react'
import { chapters, heroVideo } from '../../content/hero.js'
import { useReveal } from '../../hooks/useReveal.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import './sections.css'

/**
 * El proceso — imagen izquierda, texto derecha (como "Roasting" en la
 * referencia). La imagen es el mismo video del inicio, en bucle y sin sonido.
 */
export default function ProcessSection() {
  const ref = useRef(null)
  const reducedMotion = useReducedMotion()
  useReveal(ref)

  return (
    <section id="proceso" ref={ref} className="section section--light-alt">
      <span className="watermark watermark--right" aria-hidden="true">Proceso</span>
      <div className="container row row--reverse">
        <div className="row__text">
          <p className="script" data-reveal>De la finca a tu taza</p>
          <h2 className="section__title" data-reveal>El proceso</h2>
          <p className="lead" data-reveal>
            Ocho pasos separan la cereza en la mata de la taza en tu mesa. Según el café, el beneficio
            cambia: cada lote tiene su propio camino.
          </p>
          <ol className="steps" data-reveal>
            {chapters.map((c) => (
              <li key={c.id}>
                <span>{c.number}</span> {c.title}
              </li>
            ))}
          </ol>
          <div className="row__actions" data-reveal>
            <a className="btn btn--caramel" href="#preparacion">
              Cómo prepararlo <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="row__media" data-reveal>
          <video src={heroVideo.desktop} poster={heroVideo.poster} muted loop playsInline autoPlay={!reducedMotion} preload="none" aria-hidden="true" />
          {heroVideo.isPlaceholder && <span className="media__tag">Video provisional</span>}
        </div>
      </div>
    </section>
  )
}
