import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../animations/gsap.js'
import { buildHeroTimeline } from '../../animations/heroTimeline.js'
import { FrameSequence } from '../../animations/frameSequence.js'
import { scrollToTarget } from '../../animations/smoothScroll.js'
import { chapters, heroFrames, heroIntro } from '../../content/hero.js'
import { whatsappLink } from '../../content/brand.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import ChapterIndex from './ChapterIndex.jsx'
import ChapterText from './ChapterText.jsx'
import './hero.css'

/**
 * El recorrido cinematográfico del inicio: la pantalla se fija y el scroll
 * avanza un "video" (secuencia de cuadros) desde la mata hasta la taza.
 *
 * Props:
 *  - introDone: la apertura (logo) terminó → se revela el titular.
 *  - onFirstFrame: avisa cuando el primer cuadro está listo (para la apertura).
 */
export default function HeroFilm({ introDone, onFirstFrame }) {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const progressRef = useRef(null)
  const chapterRefs = useRef([])
  const liveRefs = useRef({})
  const sequenceRef = useRef(null)
  const timelineRef = useRef(null)
  const [active, setActive] = useState(0)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const set = isMobile ? heroFrames.mobile : heroFrames.desktop

  // Carga de la secuencia de cuadros (se rehace si cambia escritorio ↔ móvil).
  useEffect(() => {
    const seq = new FrameSequence(canvasRef.current, set)
    sequenceRef.current = seq
    seq.load().then(() => {
      seq.render(timelineRef.current?.scrollTrigger?.progress ?? 0)
      onFirstFrame?.()
    })
    return () => seq.destroy()
  }, [set.path, set.count]) // eslint-disable-line react-hooks/exhaustive-deps

  // Línea de tiempo enlazada al scroll.
  useGSAP(
    () => {
      timelineRef.current = buildHeroTimeline({
        section: sectionRef.current,
        canvas: canvasRef.current,
        chapterEls: chapterRefs.current,
        progressBar: progressRef.current,
        liveEls: liveRefs.current,
        chapters,
        sequence: { render: (p) => sequenceRef.current?.render(p) },
        isMobile,
        onActiveChange: setActive,
      })
      return () => {
        timelineRef.current = null
      }
    },
    { scope: sectionRef, dependencies: [isMobile], revertOnUpdate: true },
  )

  // Entrada del titular cuando termina la apertura.
  useGSAP(
    () => {
      if (!introDone) return
      const first = chapterRefs.current[0]
      gsap.fromTo(first.querySelectorAll('.js-line'), { yPercent: 115 }, { yPercent: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out' })
      gsap.fromTo(first.querySelectorAll('.js-fade'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, delay: 0.5 })
      gsap.fromTo('.film__ui', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, delay: 0.8 })
      ScrollTrigger.refresh()
    },
    { scope: sectionRef, dependencies: [introDone] },
  )

  const goToChapter = (i) => {
    const st = timelineRef.current?.scrollTrigger
    if (!st) return
    scrollToTarget(st.labelToScroll(`ch-${i}`))
  }

  return (
    <section id="inicio" ref={sectionRef} className="film" aria-label="El recorrido del café, del origen a tu taza">
      <canvas ref={canvasRef} className="film__canvas" aria-hidden="true" />
      <div className="film__veil" aria-hidden="true" />

      <div className="film__chapters">
        {chapters.map((chapter, i) => (
          <ChapterText
            key={chapter.id}
            ref={(el) => (chapterRefs.current[i] = el)}
            chapter={chapter}
            index={i}
            intro={i === 0 ? heroIntro : null}
            liveRefs={liveRefs}
            onStart={() => goToChapter(1)}
            whatsappHref={whatsappLink()}
          />
        ))}
      </div>

      <div className="film__ui">
        <ChapterIndex chapters={chapters} active={active} onSelect={goToChapter} />
        <div className="film__progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
        {heroFrames.isPlaceholder && (
          <p className="film__notice">Animación provisional · el video real del recorrido reemplazará estos cuadros</p>
        )}
      </div>
    </section>
  )
}
