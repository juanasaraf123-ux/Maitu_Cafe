import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { brand, whatsappLink } from '../../content/brand.js'
import { navLinks } from '../../content/navigation.js'
import { useCart } from '../../store/CartContext.jsx'
import './Navbar.css'

/**
 * Menú fijo. Sobre el video del inicio es transparente (logo blanco); al bajar
 * o en las demás páginas pasa a fondo crema con el logo a color.
 * Incluye el carrito con el número de productos.
 */
export default function Navbar({ visible, overHero }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { count, setOpen: openCart } = useCart()
  const { pathname } = useLocation()
  const solid = !overHero || scrolled

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > window.innerHeight * 0.8))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`nav ${solid ? 'is-solid' : ''} ${visible ? 'is-visible' : ''} ${open ? 'is-open' : ''}`}>
      <Link className="nav__logo" to="/" onClick={close} aria-label={`${brand.name}, ir al inicio`}>
        <img src={brand.logos.white} alt="" width="132" height="102" />
      </Link>

      <nav className="nav__links" id="menu-principal" aria-label="Principal">
        <ul>
          {navLinks.map((l) => (
            <li key={l.href}>
              {l.href.startsWith('/#')
                ? <a href={l.href} onClick={close}>{l.label}</a>
                : <Link to={l.href} onClick={close} aria-current={pathname === l.href ? 'page' : undefined}>{l.label}</Link>}
            </li>
          ))}
        </ul>
        <a className="btn btn--light-outline nav__wa" href={whatsappLink()} target="_blank" rel="noreferrer" onClick={close}>WhatsApp</a>
      </nav>

      <div className="nav__actions">
        <Link className="btn btn--caramel nav__shop" to="/tienda">Comprar café</Link>
        <button type="button" className="nav__cart" onClick={() => openCart(true)} aria-label={`Abrir carrito, ${count} productos`}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Zm4 0V6a3 3 0 0 1 6 0v1" /></svg>
          {count > 0 && <span className="nav__badge">{count}</span>}
        </button>
        <button type="button" className="nav__toggle" aria-expanded={open} aria-controls="menu-principal" onClick={() => setOpen((v) => !v)}>
          <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
