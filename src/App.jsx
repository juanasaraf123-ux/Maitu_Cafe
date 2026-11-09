import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from './animations/gsap.js'
import { destroySmoothScroll, initSmoothScroll, scrollToTarget } from './animations/smoothScroll.js'
import { useReducedMotion } from './hooks/useReducedMotion.js'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import HeroIntro from './components/hero/HeroIntro.jsx'
import HeroVideo from './components/hero/HeroVideo.jsx'
import StorySection from './components/sections/StorySection.jsx'
import PrepSection from './components/sections/PrepSection.jsx'

export default function App() {
  const reducedMotion = useReducedMotion()
  const [firstFrame, setFirstFrame] = useState(false)
  const [introDone, setIntroDone] = useState(reducedMotion)

  // Scroll suave (solo si el usuario no pidió reducir el movimiento).
  useEffect(() => {
    initSmoothScroll({ reducedMotion })
    return () => destroySmoothScroll()
  }, [reducedMotion])

  // Los enlaces internos (#historia, #contacto…) usan el mismo scroll suave.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a || a.getAttribute('href').length < 2) return
      const target = document.querySelector(a.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      scrollToTarget(target)
      history.replaceState(null, '', a.getAttribute('href'))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Recalcula posiciones cuando cargan las fuentes (cambian alturas).
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  const onIntroDone = useCallback(() => setIntroDone(true), [])
  const onFirstFrame = useCallback(() => setFirstFrame(true), [])

  return (
    <>
      <a className="skip-link" href="#historia">Saltar al contenido</a>
      {!reducedMotion && !introDone && <HeroIntro ready={firstFrame} onDone={onIntroDone} />}
      <Navbar visible={introDone} />
      <main>
        <HeroVideo introDone={introDone} onReady={onFirstFrame} reducedMotion={reducedMotion} />
        <StorySection />
        <PrepSection />
      </main>
      <Footer />
    </>
  )
}
