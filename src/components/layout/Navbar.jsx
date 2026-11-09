import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../../animations/gsap.js'
import { brand, whatsappLink } from '../../content/brand.js'
import { navLinks } from '../../content/navigation.js'
import './Navbar.css'

/**
 * Menú fijo. Sobre el recorrido es transparente (logo blanco); al terminar
 * el recorrido pasa a fondo crema con el logo a color.
 * En móvil se abre un panel a pantalla completa.
 */
export default function Navbar({ visible }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Se calcula después del recorrido fijo (refreshPriority -1) para que
    // tenga en cuenta el espacio que ocupa el pin.
    const st = ScrollTrigger.create({
      trigger: '#historia',
      start: 'top top+=80',
      refreshPriority: -1,
      onEnter: () => setSolid(true),
      onLeaveBack: () => setSolid(false),
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${solid ? 'is-solid' : ''} ${visible ? 'is-visible' : ''} ${open ? 'is-open' : ''}`}>
      <a className="nav__logo" href="#inicio" onClick={close} aria-label={`${brand.name}, ir al inicio`}>
        <img src={solid && !open ? brand.logos.color : brand.logos.white} alt="" width="132" height="102" />
      </a>

      <nav className="nav__links" id="menu-principal" aria-label="Principal">
        <ul>
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={close}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a className="btn btn--brand nav__cta" href={whatsappLink()} target="_blank" rel="noreferrer" onClick={close}>
          Pedir por WhatsApp
        </a>
      </nav>

      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="menu-principal"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </header>
  )
}
