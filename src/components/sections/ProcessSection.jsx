import { useRef } from 'react'
import { chapters } from '../../content/hero.js'
import { gsap, ScrollTrigger, useGSAP } from '../../animations/gsap.js'
import SplitHeading from '../fx/SplitHeading.jsx'
import './sections.css'

/** Colores de cada etapa: de la mata verde a la taza crema. */
const STEP_COLORS = [
  ['#2f4a2c', '#14231a'], ['#8f2a20', '#3a120d'], ['#5b4630', '#231a12'], ['#b8853e', '#4a3016'],
  ['#5a3523', '#1f120b'], ['#3a251a', '#120b07'], ['#1f4b7f', '#0f2a48'], ['#d9a86c', '#8a5a33'],
]

/**
 * El proceso — recorrido horizontal: al hacer scroll, las 8 etapas pasan de
 * lado (en computador la sección se fija; en celular se desliza con el dedo).
 */
export default function ProcessSection() {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const track = ref.current.querySelector('.hscroll__track')
      const distance = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
      })
      gsap.to('.hscroll__bar i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } })
      // Cada tarjeta gira suavemente al pasar por el centro.
      gsap.utils.toArray('.step').forEach((card) => {
        gsap.fromTo(card.querySelector('.step__num'), { xPercent: 30 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
      })
      return () => ScrollTrigger.refresh()
    })
    return () => mm.revert()
  }, { scope: ref })

  return (
    <section id="proceso" ref={ref} className="section--dark hscroll">
      <div className="hscroll__track">
        <div className="hscroll__intro">
          <p className="kicker">De la finca a tu taza</p>
          <SplitHeading className="display-title" text="Ocho pasos *hasta tu taza*" />
          <p className="lead">Desliza y recorre el camino del café. Según el café, el beneficio cambia: cada lote tiene su propio proceso.</p>
          <p className="hscroll__hint" aria-hidden="true">Desliza →</p>
        </div>
        {chapters.map((c, i) => (
          <article key={c.id} className="step" style={{ '--c1': STEP_COLORS[i][0], '--c2': STEP_COLORS[i][1] }}>
            <span className="pattern" aria-hidden="true" />
            <span className="step__num" aria-hidden="true">{c.number}</span>
            <div className="step__body">
              <p className="step__label">Paso {c.number}</p>
              <h3 className="step__title">{c.title}</h3>
              <p className="step__caption">{c.caption}</p>
            </div>
          </article>
        ))}
        <div className="hscroll__end">
          <p className="display-title">Del origen <span className="text-gradient">a tu taza.</span></p>
          <a className="btn btn--glow" href="#cafes">Probar Maitú <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div className="hscroll__bar" aria-hidden="true"><i /></div>
    </section>
  )
}
