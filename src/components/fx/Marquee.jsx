import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../animations/gsap.js'

/**
 * Cinta de texto gigante que se desplaza sin fin. Se acelera y cambia de
 * dirección según la velocidad y el sentido del scroll.
 */
export default function Marquee({ items, alt = false, speed = 40 }) {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const track = ref.current.querySelector('.marquee__track')
      const tween = gsap.to(track, { xPercent: -50, ease: 'none', duration: speed, repeat: -1 })
      let direction = alt ? -1 : 1
      tween.timeScale(direction)
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate(self) {
          const v = self.getVelocity() / 300
          if (self.direction !== 0) direction = self.direction * (alt ? -1 : 1)
          gsap.to(tween, { timeScale: direction * Math.max(1, Math.min(Math.abs(v), 6)), duration: 0.3, overwrite: true })
          gsap.to(tween, { timeScale: direction, duration: 1.2, delay: 0.3, overwrite: false })
        },
      })
      return () => { tween.kill(); st.kill() }
    })
    return () => mm.revert()
  }, { scope: ref })

  const row = items.map((t, i) => (
    <span key={i} className="marquee__item">
      <span dangerouslySetInnerHTML={{ __html: t }} />
      <span className="star" aria-hidden="true">✦</span>
    </span>
  ))
  return (
    <div ref={ref} className={`marquee ${alt ? 'marquee--alt' : ''}`} aria-hidden="true">
      <div className="marquee__track">{row}{row}{row}{row}</div>
    </div>
  )
}
