import { gsap, useGSAP } from '../animations/gsap.js'

/**
 * Aparición discreta al hacer scroll para los elementos con [data-reveal]
 * dentro del contenedor. Sin efecto con "reducir movimiento".
 */
export function useReveal(scopeRef) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 40,
            duration: 1.1,
            ease: 'expo.out',
            delay: Number(el.dataset.revealDelay || 0),
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: scopeRef },
  )
}
