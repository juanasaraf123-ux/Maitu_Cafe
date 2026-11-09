import { createElement, useRef } from 'react'
import { gsap, useGSAP } from '../../animations/gsap.js'

/**
 * Título que aparece palabra por palabra al entrar en pantalla.
 * Las palabras entre *asteriscos* van en cursiva con degradado.
 */
export default function SplitHeading({ as = 'h2', text, className = '' }) {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(ref.current.querySelectorAll('.split-word > span'), {
        yPercent: 120,
        rotate: 6,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: ref })

  const words = text.split(' ')
  return createElement(as, { ref, className, 'aria-label': text.replace(/\*/g, '') },
    words.map((w, i) => {
      const accent = w.startsWith('*') || w.endsWith('*')
      return (
        <span key={i} className="split-word" aria-hidden="true">
          <span className={accent ? 'text-gradient split-accent' : ''}>{w.replace(/\*/g, '')}</span>{i < words.length - 1 ? ' ' : ''}
        </span>
      )
    }))
}
