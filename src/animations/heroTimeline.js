/**
 * Línea de tiempo maestra del recorrido "Del origen a tu taza".
 *
 * Un único timeline de GSAP enlazado al scroll (ScrollTrigger con pin + scrub)
 * controla, en sincronía:
 *   - el cuadro de la secuencia (FrameSequence)
 *   - la entrada y salida del texto de cada capítulo
 *   - los datos en vivo del filtrado (agua y tiempo de la receta del empaque)
 *   - la barra de progreso
 *
 * Escala de tiempo: 1 unidad = 1 capítulo. El capítulo i ocupa [i, i+1).
 * Cada capítulo tiene una etiqueta `ch-i` para poder saltar desde el índice.
 */
import { gsap } from './gsap.js'

const formatTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function buildHeroTimeline({
  section,
  canvas,
  chapterEls,
  progressBar,
  liveEls,
  chapters,
  sequence,
  isMobile,
  onActiveChange,
}) {
  const n = chapters.length
  const frame = { p: 0 }
  let active = 0

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      // Distancia de scroll: ~1 pantalla por capítulo en escritorio, menos en móvil.
      end: () => `+=${Math.round(window.innerHeight * n * (isMobile ? 0.75 : 1))}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
    onUpdate() {
      const next = Math.min(n - 1, Math.max(0, Math.floor(tl.time() + 0.3)))
      if (next !== active) {
        active = next
        onActiveChange?.(next)
      }
    },
  })

  // 1. Video (secuencia de cuadros): avanza durante todo el recorrido y
  //    se detiene un poco antes del final para que la taza "respire".
  tl.to(frame, { p: 1, duration: n - 0.4, onUpdate: () => sequence?.render(frame.p) }, 0)

  // 2. Acercamiento de cámara muy sutil sobre todo el recorrido (parallax).
  tl.fromTo(canvas, { scale: 1.06 }, { scale: 1, duration: n }, 0)

  // 3. Barra de progreso.
  tl.fromTo(progressBar, { scaleX: 0 }, { scaleX: 1, duration: n }, 0)

  // 4. Textos por capítulo.
  chapterEls.forEach((el, i) => {
    if (!el) return
    const lines = el.querySelectorAll('.js-line')
    const fades = el.querySelectorAll('.js-fade')
    tl.addLabel(`ch-${i}`, i === 0 ? 0 : i + 0.05)

    if (i > 0) {
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, i - 0.15)
      tl.fromTo(lines, { yPercent: 115 }, { yPercent: 0, stagger: 0.06, duration: 0.3, ease: 'power3.out' }, i - 0.15)
      tl.fromTo(fades, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.25, ease: 'power2.out' }, i - 0.05)
    }
    if (i < n - 1) {
      tl.to(el, { autoAlpha: 0, y: -40, duration: 0.22, ease: 'power2.in' }, i + 0.68)
      tl.set(el, { y: 0 }, i + 0.95)
    }
  })

  // 5. Datos en vivo del filtrado (receta impresa en el empaque).
  const liveIndex = chapters.findIndex((c) => c.live)
  if (liveIndex > -1 && liveEls?.water && liveEls?.time) {
    const { waterMl, seconds } = chapters[liveIndex].live
    const live = { t: 0 }
    const paint = () => {
      liveEls.water.textContent = `${Math.round(live.t * waterMl)} ml`
      liveEls.time.textContent = formatTime(live.t * seconds)
    }
    paint()
    tl.to(live, { t: 1, duration: 0.75, onUpdate: paint }, liveIndex - 0.05)
  }

  return tl
}
