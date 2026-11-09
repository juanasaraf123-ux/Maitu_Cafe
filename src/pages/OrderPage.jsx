import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { formatCOP, formatWeight } from '../lib/format.js'
import { useCart } from '../store/CartContext.jsx'
import { whatsappLink } from '../content/brand.js'
import OrderTimeline from '../components/shop/OrderTimeline.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import '../components/shop/shop.css'

/**
 * Seguimiento del pedido.
 *  - /pedido                → buscar por código + correo
 *  - /pedido/:code?t=TOKEN  → enlace directo (al volver de Wompi llega también ?id=TRANSACCIÓN)
 */
export default function OrderPage() {
  usePageTitle('Seguimiento de pedido')
  const { code } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { clear } = useCart()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [lookup, setLookup] = useState({ code: code || '', email: '' })
  const token = params.get('t')
  const txId = params.get('id')
  const isNew = params.get('nuevo') === '1'

  const load = useCallback(async (q) => {
    try {
      const o = await api.order(q.code, q.params)
      setOrder(o)
      setError('')
      return o
    } catch (e) {
      setError(e.message)
      return null
    }
  }, [])

  // Carga con el enlace directo; mientras el pago esté pendiente, vuelve a consultar.
  useEffect(() => {
    if (!code || !token) return
    let timer
    let tries = 0
    const tick = async () => {
      const o = await load({ code, params: { t: token, ...(txId ? { id: txId } : {}) } })
      if (o && o.status === 'pendiente_pago' && txId && tries++ < 20) timer = setTimeout(tick, 4000)
    }
    tick()
    return () => clearTimeout(timer)
  }, [code, token, txId, load])

  // El carrito se vacía cuando el pedido queda creado y confirmado.
  useEffect(() => {
    if (order && (isNew || !['pendiente_pago', 'pago_rechazado', 'cancelado'].includes(order.status))) clear()
  }, [order, isNew, clear])

  const search = async (e) => {
    e.preventDefault()
    const o = await load({ code: lookup.code.trim().toUpperCase(), params: { email: lookup.email.trim() } })
    if (o) navigate(`/pedido/${o.code}?t=${o.accessToken}`, { replace: true })
  }

  if (!order) {
    return (
      <main className="page container order-lookup">
        <p className="script">Seguimiento</p>
        <h1 className="page__title">¿Dónde está mi café?</h1>
        <p className="lead">Escribe el código de tu pedido (empieza por MT-) y el correo con el que compraste.</p>
        <form className="card lookup-form" onSubmit={search}>
          <label className="field"><span>Código del pedido</span><input required placeholder="MT-XXXXXX" value={lookup.code} onChange={(e) => setLookup((l) => ({ ...l, code: e.target.value }))} /></label>
          <label className="field"><span>Correo</span><input required type="email" value={lookup.email} onChange={(e) => setLookup((l) => ({ ...l, email: e.target.value }))} /></label>
          {error && <p className="alert alert--error" role="alert">{error}</p>}
          <button className="btn btn--caramel">Ver mi pedido</button>
        </form>
      </main>
    )
  }

  const waMsg = `Hola Maitú, mi pedido es ${order.code}.`
  return (
    <main className="page container order">
      <p className="script">Pedido {order.code}</p>
      <h1 className="page__title">{order.statusLabel}</h1>

      {order.status === 'pendiente_pago' && (
        <div className="alert">
          {txId ? 'Estamos confirmando tu pago con el banco. Esta página se actualiza sola.'
            : order.checkoutUrl ? 'Tu pedido está reservado. Falta el pago.'
              : 'Recibimos tu pedido y reservamos tu café. Te escribiremos por WhatsApp para coordinar el pago.'}
          {order.checkoutUrl && !txId && <> <a className="btn btn--pay btn--sm" href={order.checkoutUrl}>Pagar {formatCOP(order.total)}</a></>}
        </div>
      )}
      {order.status === 'pago_rechazado' && (
        <div className="alert alert--error">El pago no fue aprobado. Tu carrito sigue guardado: <Link to="/checkout">intenta de nuevo</Link> o <a href={whatsappLink(waMsg)} target="_blank" rel="noreferrer">escríbenos</a>.</div>
      )}
      {order.status === 'cancelado' && <div className="alert alert--error">Este pedido fue cancelado. Si tienes dudas, <a href={whatsappLink(waMsg)} target="_blank" rel="noreferrer">escríbenos</a>.</div>}

      <div className="order__grid">
        <section className="card">
          <h2>Seguimiento</h2>
          <OrderTimeline order={order} />
        </section>
        <section className="card">
          <h2>Resumen</h2>
          <ul className="sum-lines">
            {order.items.map((i, k) => (
              <li key={k}><span>{i.qty} × {i.product_name}<small>{i.presentationLabel} · {formatWeight(i.weight_g)}</small></span><b>{formatCOP(i.unit_price_cop * i.qty)}</b></li>
            ))}
          </ul>
          <dl className="sum-totals">
            <div><dt>Subtotal</dt><dd>{formatCOP(order.subtotal)}</dd></div>
            <div><dt>Envío</dt><dd>{order.shipping ? formatCOP(order.shipping) : 'Gratis'}</dd></div>
            <div className="sum-totals__total"><dt>Total</dt><dd>{formatCOP(order.total)}</dd></div>
          </dl>
          {order.paymentMethod && <p className="muted">Pagado con {order.paymentMethod}</p>}
          <h3>Entrega</h3>
          <p className="muted">{order.customer.name}<br />{order.customer.address}<br />{order.customer.city}, {order.customer.department}<br />{order.customer.phone}</p>
          <p className="muted small">Guarda este enlace para consultar tu pedido. También puedes buscarlo en <Link to="/pedido">Seguir mi pedido</Link> con el código y tu correo.</p>
          <a className="btn btn--light-outline" href={whatsappLink(waMsg)} target="_blank" rel="noreferrer">Preguntar por WhatsApp</a>
        </section>
      </div>
    </main>
  )
}
