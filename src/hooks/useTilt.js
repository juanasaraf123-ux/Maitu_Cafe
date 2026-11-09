import { useCallback } from 'react'

/**
 * Inclinación 3D de una tarjeta según la posición del puntero, con un brillo
 * que lo sigue (variables CSS --mx, --my, --rx, --ry).
 */
export function useTilt(max = 10) {
  const onPointerMove = useCallback((e) => {
    if (e.pointerType !== 'mouse') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
    el.style.setProperty('--rx', `${(0.5 - py) * max}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * max}deg`)
  }, [max])
  const onPointerLeave = useCallback((e) => {
    const el = e.currentTarget
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }, [])
  return { onPointerMove, onPointerLeave }
}
