import { useRef } from 'react'
import { recipes } from '../../content/recipes.js'
import { gsap, useGSAP } from '../../animations/gsap.js'
import { useTilt } from '../../hooks/useTilt.js'
import SplitHeading from '../fx/SplitHeading.jsx'
import './sections.css'

const ICONS = { goteo: '/media/iconos/goteo.svg', prensa: '/media/iconos/prensa.svg', aeropress: '/media/iconos/aeropress.svg' }

function RecipeCard({ r, i }) {
  const tilt = useTilt(8)
  return (
    <li className="recipe tilt" {...tilt} style={{ '--delay': `${i * 0.12}s` }}>
      <span className="tilt__shine" aria-hidden="true" />
      <img className="recipe__icon" src={ICONS[r.id]} alt="" width="64" height="64" />
      <p className="recipe__note">{r.note}</p>
      <h3 className="recipe__method">{r.method}</h3>
      <dl className="recipe__data">
        <div><dt>Café</dt><dd><span className="count" data-to={r.coffeeGrams}>{r.coffeeGrams}</span> g</dd></div>
        <div><dt>Agua</dt><dd><span className="count" data-to={r.waterMl}>{r.waterMl}</span> ml</dd></div>
        <div><dt>Tiempo</dt><dd>{r.time}</dd></div>
      </dl>
      <p className="recipe__grind">{r.grind}</p>
    </li>
  )
}

/** Preparación — las tres recetas del empaque, con números que cuentan al aparecer. */
export default function PrepSection() {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.recipe', { y: 80, rotate: (i) => [-4, 2, 5][i] || 0, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.recipes', start: 'top 80%', once: true } })
      ref.current.querySelectorAll('.count').forEach((el) => {
        const to = Number(el.dataset.to)
        const o = { v: 0 }
        gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v) }, scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      })
    })
    return () => mm.revert()
  }, { scope: ref })

  return (
    <section id="preparacion" ref={ref} className="section section--cream prep">
      <span className="pattern pattern--soft" aria-hidden="true" />
      <div className="container">
        <div className="prep__head">
          <p className="kicker kicker--dark">Preparación</p>
          <SplitHeading className="display-title" text="Tres formas de *disfrutarlo* en casa" />
          <p className="lead">Las mismas recetas que encuentras en el costado de nuestro empaque.</p>
        </div>
        <ol className="recipes">
          {recipes.map((r, i) => <RecipeCard key={r.id} r={r} i={i} />)}
        </ol>
      </div>
    </section>
  )
}
