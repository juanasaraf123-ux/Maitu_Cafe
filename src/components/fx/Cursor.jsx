import { useEffect, useRef } from 'react'
import { gsap } from '../../animations/gsap.js'

/**
 * Cursor personalizado (solo con mouse): punto + anillo que crece sobre enlaces
 * y botones. También activa el efecto "magnético" en los botones.
 */
export default function Cursor() {
  const ref = useRef(null)
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    const el = ref.current
    const dot = el.querySelector('.cursor__dot')
    const ring = el.querySelector('.cursor__ring')
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.08 })
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.08 })
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })
    let magnet = null

    const onMove = (e) => {
      xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY)
      const target = e.target.closest?.('a, button, [role="button"], input, select, textarea, .bag3d__canvas')
      el.classList.toggle('is-hover', !!target && !target.closest('.bag3d__canvas'))
      // Botones magnéticos: se acercan un poco al puntero.
      const btn = e.target.closest?.('.btn, .circle-link, .hero__watch-icon')
      if (btn !== magnet) {
        if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
        magnet = btn
      }
      if (btn) {
        const r = btn.getBoundingClientRect()
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3' })
      }
    }
    const onLeave = () => el.classList.remove('is-hover')
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    el.style.display = 'block'
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className="cursor" style={{ display: 'none' }} aria-hidden="true">
      <span className="cursor__ring" />
      <span className="cursor__dot" />
    </div>
  )
}
