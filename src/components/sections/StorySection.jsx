import { useRef } from 'react'
import { brand } from '../../content/brand.js'
import { useReveal } from '../../hooks/useReveal.js'
import './sections.css'

/**
 * Nuestra historia — texto del Manual de Marca (historia de Nicolas Bernal)
 * y la única fotografía real de la marca disponible por ahora.
 * Las fincas y productores del Tolima se agregan cuando se tengan los datos.
 */
export default function StorySection() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section id="historia" ref={ref} className="section section--light story">
      <div className="container story__grid">
        <figure className="story__photo" data-reveal>
          <img
            src="/media/historia/nicolas-catando-560.webp"
            srcSet="/media/historia/nicolas-catando-560.webp 560w, /media/historia/nicolas-catando.webp 921w"
            sizes="(max-width: 767px) 90vw, 40vw"
            alt="Nicolas Bernal catando café durante una sesión de catación"
            width="921"
            height="1280"
            loading="lazy"
          />
          <figcaption>{brand.founder}, fundador de {brand.shortName}</figcaption>
        </figure>

        <div className="story__text">
          <p className="eyebrow" data-reveal>Nuestra historia</p>
          <h2 className="section__title" data-reveal>
            Un puente entre <em>el pasado y el presente</em>
          </h2>
          <p className="lead" data-reveal>{brand.description}</p>
          {brand.story.map((p, i) => (
            <p key={i} data-reveal>{p}</p>
          ))}
          <p className="story__sign" data-reveal>— {brand.founder}</p>
        </div>
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
