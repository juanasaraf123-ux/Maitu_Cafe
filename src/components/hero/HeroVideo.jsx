import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../../animations/gsap.js'
import { brand, whatsappLink } from '../../content/brand.js'
import { chapters, heroText, heroVideo } from '../../content/hero.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import './hero.css'

/**
 * Inicio: video a pantalla completa que se reproduce solo y en bucle; no
 * depende del scroll. Encima, el nombre Maitú y el titular. Abajo a la
 * izquierda, un letrero que dice qué etapa se está viendo (sincronizado con
 * el tiempo del video) y una barra de 8 segmentos.
 *
 * Props:
 *  - introDone: terminó la apertura → arranca el video y entra el texto.
 *  - onReady: el video tiene su primer cuadro (para la apertura).
 *  - reducedMotion: no se reproduce solo; queda el botón de reproducir.
 */
export default function HeroVideo({ introDone, onReady, reducedMotion }) {
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const fillRefs = useRef([])
  const wantsPlay = useRef(!reducedMotion)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const src = isMobile ? heroVideo.mobile : heroVideo.desktop

  // Aviso de "listo" para la apertura (con primer cuadro o si ya estaba cargado).
  useEffect(() => {
    const v = videoRef.current
    if (v.readyState >= 2) return onReady?.()
    const ready = () => onReady?.()
    v.addEventListener('loadeddata', ready, { once: true })
    v.addEventListener('error', ready, { once: true })
    return () => {
      v.removeEventListener('loadeddata', ready)
      v.removeEventListener('error', ready)
    }
  }, [src, onReady])

  // Arranca cuando termina la apertura.
  useEffect(() => {
    if (!introDone || !wantsPlay.current) return
    const v = videoRef.current
    v.currentTime = 0
    v.play().catch(() => setPlaying(false))
  }, [introDone, src])

  // Sincroniza el letrero y la barra con el tiempo del video.
  useEffect(() => {
    const v = videoRef.current
    let raf = 0
    let current = -1
    const paint = () => {
      const t = v.currentTime
      const duration = v.duration || chapters[chapters.length - 1].start + 2
      let idx = 0
      for (let i = 0; i < chapters.length; i++) if (t >= chapters[i].start) idx = i
      const start = chapters[idx].start
      const end = chapters[idx + 1]?.start ?? duration
      const p = Math.min(1, Math.max(0, (t - start) / (end - start)))
      fillRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleX(${i < idx ? 1 : i === idx ? p : 0})`
      })
      if (idx !== current) {
        current = idx
        setActive(idx)
      }
    }
    const loop = () => { paint(); raf = requestAnimationFrame(loop) }
    const onPlay = () => { setPlaying(true); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop) }
    const onPause = () => { setPlaying(false); cancelAnimationFrame(raf); paint() }
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('seeked', paint)
    return () => {
      cancelAnimationFrame(raf)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('seeked', paint)
    }
  }, [src])

  // Pausa el video cuando no se ve (ahorra batería y datos).
  useEffect(() => {
    const v = videoRef.current
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) v.pause()
      else if (wantsPlay.current && introDone) v.play().catch(() => {})
    }, { threshold: 0.15 })
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [introDone])

  // Entrada del texto principal al terminar la apertura.
  useGSAP(
    () => {
      if (!introDone) return
      gsap.fromTo('.hero__brand', { autoAlpha: 0, y: 30, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.4, ease: 'expo.out' })
      gsap.fromTo('.hero__headline .js-line', { yPercent: 115 }, { yPercent: 0, duration: 1.2, stagger: 0.1, delay: 0.25, ease: 'expo.out' })
      gsap.fromTo('.js-fade', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, delay: 0.6 })
    },
    { scope: rootRef, dependencies: [introDone] },
  )

  // Cambio de letrero: la palabra nueva sube desde una máscara.
  useGSAP(
    () => {
      gsap.fromTo('.stage__title .js-stage', { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' })
      gsap.fromTo('.stage__caption', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.1 })
    },
    { scope: rootRef, dependencies: [active] },
  )

  const togglePlay = () => {
    const v = videoRef.current
    if (v.paused) {
      wantsPlay.current = true
      v.play().catch(() => {})
    } else {
      wantsPlay.current = false
      v.pause()
    }
  }

  const stage = chapters[active]

  return (
    <section id="inicio" ref={rootRef} className={`hero ${introDone ? 'is-in' : ''}`} aria-label="Inicio">
      <video
        ref={videoRef}
        key={src}
        className="hero__video"
        src={src}
        poster={heroVideo.poster}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__center">
        <p className="hero__eyebrow js-fade">{heroText.eyebrow}</p>
        <h1 className="hero__brand">
          <img src={brand.logos.white} alt={brand.name} width="528" height="408" />
        </h1>
        <p className="hero__headline">
          {heroText.headline.map((l, i) => (
            <span key={l} className={`mask ${i === 1 ? 'is-accent' : ''}`}>
              <span className="js-line">{l}</span>
            </span>
          ))}
        </p>
        <div className="hero__actions js-fade">
          <a className="btn btn--light" href="#historia">Conoce nuestra historia</a>
          <a className="btn btn--brand" href={whatsappLink()} target="_blank" rel="noreferrer">
            Pedir por WhatsApp <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="hero__stage js-fade">
        <p className="stage__count">
          <b>{stage.number}</b> / {chapters[chapters.length - 1].number} · El recorrido
        </p>
        <p className="stage__title mask" key={stage.id}>
          <span className="js-stage">{stage.title}.</span>
        </p>
        <p className="stage__caption">{stage.caption}</p>
        <ol className="stage__bars" aria-label="Etapas del recorrido">
          {chapters.map((c, i) => (
            <li key={c.id} title={c.title}>
              <span className="sr-only">{c.number} {c.title}</span>
              <i ref={(el) => (fillRefs.current[i] = el)} />
            </li>
          ))}
        </ol>
      </div>

      <div className="hero__controls js-fade">
        <button type="button" className="hero__play" onClick={togglePlay} aria-label={playing ? 'Pausar video' : 'Reproducir video'}>
          <span aria-hidden="true">{playing ? '❚❚' : '►'}</span>
          <span className="hero__play-label">{playing ? 'Pausar' : 'Reproducir'}</span>
        </button>
        {heroVideo.isPlaceholder && <span className="hero__notice">Video provisional</span>}
      </div>
    </section>
  )
}
