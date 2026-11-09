import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { formatCOP, formatWeight } from '../lib/format.js'
import { useCart } from '../store/CartContext.jsx'
import { useStoreConfig } from '../store/StoreConfig.jsx'
import { DEPARTMENTS } from '../content/departments.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { whatsappLink } from '../content/brand.js'
import '../components/shop/shop.css'

const EMPTY = { name: '', document: '', email: '', phone: '', department: 'Tolima', city: '', address: '', notes: '' }

/**
 * Pago: datos del comprador y de entrega + resumen. Al confirmar se crea el
 * pedido (el stock queda reservado) y se pasa a Wompi para pagar con PSE,
 * tarjeta, Nequi, etc. Si los pagos en línea aún no están activos, el pedido
 * queda registrado y se coordina el pago por WhatsApp (sin simular cobros).
 */
export default function CheckoutPage() {
  usePageTitle('Finalizar compra')
  const { items, subtotal } = useCart()
  const cfg = useStoreConfig()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [accept, setAccept] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const shipping = cfg.freeShippingFromCop && subtotal >= cfg.freeShippingFromCop ? 0 : cfg.shippingCop || 0
  const total = subtotal + shipping
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  if (items.length === 0) {
    return (
      <main className="page container checkout-empty">
        <h1 className="page__title">Tu carrito está vacío</h1>
        <Link className="btn btn--caramel" to="/tienda">Ver los cafés</Link>
      </main>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const res = await api.createOrder({ items: items.map((l) => ({ variantId: l.variantId, qty: l.qty })), customer: form })
      if (res.checkoutUrl) {
        window.location.assign(res.checkoutUrl) // Wompi: PSE, tarjeta, Nequi…
      } else {
        navigate(`/pedido/${res.code}?t=${res.accessToken}&nuevo=1`)
      }
    } catch (err) {
      setError(err.message)
      setSending(false)
    }
  }

  return (
    <main className="page checkout">
      <div className="container">
        <nav className="crumbs" aria-label="Ruta"><Link to="/tienda">Tienda</Link> / <span>Finalizar compra</span></nav>
        <h1 className="page__title">Finalizar compra</h1>

        <form className="checkout__grid" onSubmit={submit}>
          <div className="checkout__form">
            <fieldset className="card">
              <legend>Tus datos</legend>
              <div className="form-grid">
                <label className="field"><span>Nombre completo</span><input required autoComplete="name" value={form.name} onChange={set('name')} /></label>
                <label className="field"><span>Cédula</span><input required inputMode="numeric" value={form.document} onChange={set('document')} /></label>
                <label className="field"><span>Correo</span><input required type="email" autoComplete="email" value={form.email} onChange={set('email')} /></label>
                <label className="field"><span>Celular</span><input required type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} /></label>
              </div>
            </fieldset>

            <fieldset className="card">
              <legend>Entrega</legend>
              <div className="form-grid">
                <label className="field"><span>Departamento</span>
                  <select required value={form.department} onChange={set('department')}>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </label>
                <label className="field"><span>Ciudad o municipio</span><input required autoComplete="address-level2" value={form.city} onChange={set('city')} /></label>
                <label className="field field--full"><span>Dirección</span><input required autoComplete="street-address" placeholder="Calle, número, barrio, apartamento" value={form.address} onChange={set('address')} /></label>
                <label className="field field--full"><span>Indicaciones (opcional)</span><textarea rows="2" value={form.notes} onChange={set('notes')} /></label>
              </div>
            </fieldset>

            <fieldset className="card">
              <legend>Pago</legend>
              {cfg.paymentsEnabled ? (
                <>
                  <p className="muted">Al confirmar te llevamos a <b>Wompi</b> (Bancolombia) para pagar de forma segura. Maitú no ve ni guarda los datos de tu tarjeta o cuenta.</p>
                  <ul className="paymethods" aria-label="Medios de pago">
                    <li>PSE</li><li>Tarjeta crédito / débito</li><li>Nequi</li><li>Botón Bancolombia</li>
                  </ul>
                  {cfg.paymentEnv === 'sandbox' && <p className="alert">Modo de pruebas de Wompi: no se hacen cobros reales.</p>}
                </>
              ) : (
                <p className="alert">
                  Los pagos en línea se están activando. Por ahora tu pedido queda registrado y reservado, y te escribimos por WhatsApp para coordinar el pago.
                  <a href={whatsappLink('Hola Maitú, tengo una pregunta sobre el pago de mi pedido.')} target="_blank" rel="noreferrer"> Escríbenos</a>.
                </p>
              )}
              <label className="check">
                <input type="checkbox" required checked={accept} onChange={(e) => setAccept(e.target.checked)} />
                <span>Acepto el tratamiento de mis datos para gestionar y entregar este pedido.</span>
              </label>
            </fieldset>
          </div>

          <aside className="checkout__summary card">
            <h2>Tu pedido</h2>
            <ul className="sum-lines">
              {items.map((l) => (
                <li key={l.variantId}>
                  <span>{l.qty} × {l.name}<small>{l.presentation} · {formatWeight(l.weightG)}</small></span>
                  <b>{formatCOP(l.price * l.qty)}</b>
                </li>
              ))}
            </ul>
            <dl className="sum-totals">
              <div><dt>Subtotal</dt><dd>{formatCOP(subtotal)}</dd></div>
              <div><dt>Envío</dt><dd>{shipping ? formatCOP(shipping) : 'Gratis'}</dd></div>
              <div className="sum-totals__total"><dt>Total</dt><dd>{formatCOP(total)}</dd></div>
            </dl>
            {error && <p className="alert alert--error" role="alert">{error}</p>}
            <button className="btn btn--pay btn--block" disabled={sending}>
              {sending ? 'Procesando…' : cfg.paymentsEnabled ? `Pagar ${formatCOP(total)}` : 'Confirmar pedido'}
            </button>
            <Link className="link-btn" to="/tienda">← Seguir comprando</Link>
          </aside>
        </form>
      </div>
    </main>
  )
}
