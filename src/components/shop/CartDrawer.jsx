import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../store/CartContext.jsx'
import { formatCOP, formatWeight } from '../../lib/format.js'
import './shop.css'

/** Panel lateral del carrito: cantidades, quitar, subtotal y paso al pago. */
export default function CartDrawer() {
  const { items, subtotal, setQty, remove, open, setOpen } = useCart()
  const navigate = useNavigate()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open, setOpen])

  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button className="drawer__backdrop" tabIndex={-1} aria-label="Cerrar carrito" onClick={() => setOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Carrito de compras">
        <header className="drawer__head">
          <h2>Tu carrito</h2>
          <button ref={closeRef} className="icon-btn" onClick={() => setOpen(false)} aria-label="Cerrar carrito">✕</button>
        </header>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <p>Tu carrito está vacío.</p>
            <Link className="btn btn--caramel" to="/tienda" onClick={() => setOpen(false)}>Ver los cafés</Link>
          </div>
        ) : (
          <>
            <ul className="cart-lines">
              {items.map((l) => (
                <li key={l.variantId} className="cart-line">
                  {l.image && <img src={l.image} alt="" width="64" height="92" />}
                  <div className="cart-line__info">
                    <p className="cart-line__name">{l.name}</p>
                    <p className="cart-line__meta">{l.presentation} · {formatWeight(l.weightG)}</p>
                    <div className="qty" role="group" aria-label={`Cantidad de ${l.name}`}>
                      <button onClick={() => setQty(l.variantId, l.qty - 1)} disabled={l.qty <= 1} aria-label="Quitar una">−</button>
                      <span aria-live="polite">{l.qty}</span>
                      <button onClick={() => setQty(l.variantId, l.qty + 1)} disabled={l.qty >= l.stock} aria-label="Agregar una">+</button>
                    </div>
                  </div>
                  <div className="cart-line__right">
                    <p>{formatCOP(l.price * l.qty)}</p>
                    <button className="link-btn" onClick={() => remove(l.variantId)}>Quitar</button>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="drawer__foot">
              <p className="drawer__total"><span>Subtotal</span><b>{formatCOP(subtotal)}</b></p>
              <p className="drawer__hint">El envío se calcula en el siguiente paso.</p>
              <button className="btn btn--caramel btn--block" onClick={() => { setOpen(false); navigate('/checkout') }}>
                Finalizar compra <span aria-hidden="true">→</span>
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
