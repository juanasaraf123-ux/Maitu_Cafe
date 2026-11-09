import { useRef } from 'react'
import { brand, instagramLink } from '../../content/brand.js'
import { useReveal } from '../../hooks/useReveal.js'
import './sections.css'

/**
 * Nuestra historia — texto izquierda, foto derecha (como "Origins" en la
 * referencia). Texto del Manual de Marca y la foto real de Nicolas.
 */
export default function StorySection() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section id="historia" ref={ref} className="section section--light">
      <span className="watermark" aria-hidden="true">Maitú</span>
      <div className="container row">
        <div className="row__text">
          <p className="script" data-reveal>Nuestra historia</p>
          <h2 className="section__title" data-reveal>El origen de Maitú</h2>
          <p className="lead" data-reveal>{brand.description}</p>
          <p data-reveal>{brand.story[0]}</p>
          <p data-reveal>{brand.story[2]}</p>
          <p className="story__sign" data-reveal>— {brand.founder}</p>
          <div className="row__actions" data-reveal>
            <a className="btn btn--caramel" href={instagramLink} target="_blank" rel="noreferrer">
              Síguenos en Instagram <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <figure className="row__media row__media--photo" data-reveal>
          <img
            src="/media/historia/nicolas-catando.webp"
            srcSet="/media/historia/nicolas-catando-560.webp 560w, /media/historia/nicolas-catando.webp 921w"
            sizes="(max-width: 899px) 92vw, 50vw"
            alt="Nicolas Bernal catando café durante una sesión de catación"
            width="921"
            height="1280"
            loading="lazy"
          />
          <figcaption>{brand.founder}, fundador de {brand.shortName}</figcaption>
        </figure>
      </div>

      <div className="container">
        <ul className="values">
          {brand.values.map((v, i) => (
            <li key={v.title} data-reveal data-reveal-delay={i * 0.08}>
              <span className="values__num">0{i + 1}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
