import { useRef } from 'react'
import { brand, instagramLink } from '../../content/brand.js'
import { gsap, useGSAP } from '../../animations/gsap.js'
import { useReveal } from '../../hooks/useReveal.js'
import SplitHeading from '../fx/SplitHeading.jsx'
import './sections.css'

/**
 * Nuestra historia — fondo café con brillo y patrón del empaque. Titular que
 * entra palabra por palabra, foto real en arco con parallax y el sello "M"
 * de la marca girando.
 */
export default function StorySection() {
  const ref = useRef(null)
  useReveal(ref)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.story__photo img', { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.story__photo', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.story__photo', { clipPath: 'inset(100% 0 0 0 round 300px 300px 28px 28px)' }, { clipPath: 'inset(0% 0 0 0 round 300px 300px 28px 28px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.story__photo', start: 'top 80%', once: true } })
      gsap.to('.story__seal', { rotate: 360, duration: 24, repeat: -1, ease: 'none' })
    })
    return () => mm.revert()
  }, { scope: ref })

  return (
    <section id="historia" ref={ref} className="section section--dark story">
      <span className="pattern pattern--caramel" aria-hidden="true" />
      <span className="glow" style={{ left: '-20vmax', top: '-10vmax' }} aria-hidden="true" />
      <div className="container story__grid">
        <div className="story__text">
          <p className="kicker" data-reveal>Nuestra historia</p>
          <SplitHeading className="display-title" text="Un puente entre el *pasado* y el *presente*" />
          <p className="lead" data-reveal>{brand.description}</p>
          <div className="glass story__quote" data-reveal>
            <p>{brand.story[0]}</p>
            <p>{brand.story[2]}</p>
            <p className="story__sign">— {brand.founder}</p>
          </div>
          <a className="btn btn--glow" href={instagramLink} target="_blank" rel="noreferrer" data-reveal>
            Síguenos en Instagram <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="story__media">
          <figure className="story__photo">
            <img
              src="/media/historia/nicolas-catando.webp"
              srcSet="/media/historia/nicolas-catando-560.webp 560w, /media/historia/nicolas-catando.webp 921w"
              sizes="(max-width: 899px) 90vw, 40vw"
              alt="Nicolas Bernal catando café durante una sesión de catación"
              width="921"
              height="1280"
              loading="lazy"
            />
          </figure>
          <img className="story__seal" src={brand.logos.seal} alt="" width="140" height="140" loading="lazy" />
          <p className="story__caption">{brand.founder} · fundador</p>
        </div>
      </div>

      <div className="container">
        <ul className="values">
          {brand.values.map((v, i) => (
            <li key={v.title} className="glass value" data-reveal data-reveal-delay={i * 0.1}>
              <span className="value__num text-outline">0{i + 1}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
