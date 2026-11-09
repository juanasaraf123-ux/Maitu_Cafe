import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import './bag3d.css'

/**
 * Bolsa 3D lista para usar en cualquier sección.
 *  - Three.js se descarga solo cuando la bolsa está por aparecer en pantalla.
 *  - Deja de dibujar cuando sale de la pantalla (ahorra batería).
 *  - Sin WebGL, o mientras carga, muestra la foto del empaque.
 *  - Con "reducir movimiento" no gira ni flota sola.
 */
const Scene = lazy(() => import('./BagCanvas.jsx'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

export default function Bag3D({ className = '', interactive = true, glow, label = 'Bolsa de Maitú Café en 3D' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [webgl] = useState(() => typeof window !== 'undefined' && hasWebGL())

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting)
      if (e.isIntersecting) setNear(true)
    }, { rootMargin: '200px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  const fallback = <img className="bag3d__fallback" src="/media/productos/maitu-340g-frente.webp" alt="" width="720" height="1039" />

  return (
    <div ref={ref} className={`bag3d ${className}`} role="img" aria-label={label}>
      {webgl && near ? (
        <Suspense fallback={fallback}>
          <Scene active={visible} autoRotate={!reduced} float={!reduced} interactive={interactive} glow={glow} />
        </Suspense>
      ) : fallback}
      {webgl && interactive && <span className="bag3d__hint" aria-hidden="true">↻ Arrastra para girar</span>}
    </div>
  )
}
