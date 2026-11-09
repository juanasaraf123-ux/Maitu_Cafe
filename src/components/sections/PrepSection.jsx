import { useRef } from 'react'
import { recipes } from '../../content/recipes.js'
import { useReveal } from '../../hooks/useReveal.js'
import './sections.css'

/** Preparación — las tres recetas impresas en el empaque de Maitú. */
export default function PrepSection() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section id="preparacion" ref={ref} className="section section--light-alt">
      <span className="watermark watermark--right" aria-hidden="true">Filtrado</span>
      <div className="container">
        <div className="prep__head">
          <p className="script" data-reveal>Preparación</p>
          <h2 className="section__title" data-reveal>Tres formas de disfrutarlo en casa</h2>
          <p className="lead" data-reveal>Las mismas recetas que encuentras en el costado de nuestro empaque.</p>
        </div>
        <ol className="recipes">
          {recipes.map((r, i) => (
            <li key={r.id} className="recipe" data-reveal data-reveal-delay={i * 0.1}>
              <p className="recipe__note">{r.note}</p>
              <h3 className="recipe__method">{r.method}</h3>
              <dl className="recipe__data">
                <div><dt>Café</dt><dd>{r.coffeeGrams} g</dd></div>
                <div><dt>Agua</dt><dd>{r.waterMl} ml</dd></div>
                <div><dt>Tiempo</dt><dd>{r.time}</dd></div>
              </dl>
              <p className="recipe__grind">{r.grind}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
