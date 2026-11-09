/**
 * Scroll suave con Lenis, sincronizado con el reloj de GSAP para que
 * ScrollTrigger y el scroll avancen en el mismo cuadro (sin temblores).
 * No se activa con "movimiento reducido".
 */
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap.js'

let lenis = null

export function initSmoothScroll({ reducedMotion }) {
  if (reducedMotion || lenis) return lenis
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  lenis.__raf = raf
  return lenis
}

export function destroySmoothScroll() {
  if (!lenis) return
  gsap.ticker.remove(lenis.__raf)
  lenis.destroy()
  lenis = null
}

/**
 * Desplaza a un destino (selector, elemento o número de píxeles).
 * Usa Lenis si está activo; si no, el scroll nativo.
 */
export function scrollToTarget(target, { offset = 0, immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, duration: immediate ? 0 : 1.6 })
    return
  }
  let y = target
  if (typeof target === 'string') target = document.querySelector(target)
  if (target instanceof Element) y = target.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top: y + offset, behavior: immediate ? 'auto' : 'smooth' })
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
