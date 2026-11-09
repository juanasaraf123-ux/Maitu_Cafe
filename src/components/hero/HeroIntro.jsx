import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../../animations/gsap.js'
import { lockScroll } from '../../animations/smoothScroll.js'
import { brand } from '../../content/brand.js'

const SEEN_KEY = 'maitu-intro-seen'

/**
 * Apertura: pantalla café limpia → el logo se revela de izquierda a derecha →
 * la cortina sube y deja ver el recorrido. Dura ~2.8 s la primera vez y ~1 s
 * en visitas siguientes (sessionStorage). Cualquier clic, tecla o scroll la salta.
 *
 * Espera a que el primer cuadro del recorrido esté cargado (`ready`) para no
 * descubrir una pantalla vacía.
 */
export default function HeroIntro({ ready, onDone }) {
  const rootRef = useRef(null)
  const tlRef = useRef(null)

  useGSAP(
    () => {
      const seen = sessionStorage.getItem(SEEN_KEY) === '1'
      const speed = seen ? 2.6 : 1
      lockScroll(true)

      const finish = () => {
        sessionStorage.setItem(SEEN_KEY, '1')
        lockScroll(false)
        onDone()
      }

      const tl = gsap.timeline({ paused: true, onComplete: finish })
      tl.fromTo('.intro__logo', { clipPath: 'inset(0 100% 0 0)', scale: 0.96 }, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 1.3, ease: 'power3.inOut' })
        .fromTo('.intro__line', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, '-=0.5')
        .to('.intro__logo', { autoAlpha: 0, y: -24, duration: 0.5, ease: 'power2.in' }, '+=0.35')
        .to('.intro__line', { autoAlpha: 0, duration: 0.3 }, '<')
        .to(rootRef.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.1')
      tl.timeScale(speed)

      tlRef.current = tl
      // Si el primer cuadro tarda, arranca igual a los 3 s.
      const waitTimer = gsap.delayedCall(3, () => tl.play())

      const skip = () => tl.progress(1)
      const opts = { once: true, passive: true }
      window.addEventListener('wheel', skip, opts)
      window.addEventListener('touchstart', skip, opts)
      window.addEventListener('keydown', skip, opts)
      rootRef.current.addEventListener('click', skip, opts)

      return () => {
        waitTimer.kill()
        window.removeEventListener('wheel', skip)
        window.removeEventListener('touchstart', skip)
        window.removeEventListener('keydown', skip)
        lockScroll(false)
      }
    },
    { scope: rootRef },
  )

  // Arranca en cuanto el primer cuadro del recorrido está listo.
  useEffect(() => {
    if (ready) tlRef.current?.play()
  }, [ready])

  return (
    <div ref={rootRef} className="intro" role="presentation">
      <img className="intro__logo" src={brand.logos.white} alt={brand.name} width="528" height="408" />
      <span className="intro__line" aria-hidden="true" />
      <span className="intro__skip">Toca para continuar</span>
    </div>
  )
}
