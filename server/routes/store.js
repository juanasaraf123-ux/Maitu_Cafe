/** API pública de la tienda: catálogo, pedidos, seguimiento y eventos de Wompi. */
import { Router } from 'express'
import { config, paymentsEnabled } from '../config.js'
import { db, shippingSettings } from '../db.js'
import { createOrder, findOrder, HttpError, PRESENTATIONS, publicOrder } from '../orders.js'
import { applyTransaction, checkoutUrl, fetchTransaction, verifyEvent } from '../wompi.js'

export const store = Router()

function productWithVariants(p) {
  const variants = db.prepare(`SELECT id, presentation, weight_g, price_cop, stock FROM variants
                               WHERE product_id = ? AND active = 1 AND price_cop IS NOT NULL
                               ORDER BY weight_g, presentation`).all(p.id)
  return {
    slug: p.slug, name: p.name, summary: p.summary, description: p.description, origin: p.origin,
    variety: p.variety, process: p.process, notes: p.notes, image: p.image,
    variants: variants.map((v) => ({ id: v.id, presentation: v.presentation, presentationLabel: PRESENTATIONS[v.presentation], weightG: v.weight_g, price: v.price_cop, stock: v.stock })),
  }
}

store.get('/config', (_req, res) => {
  res.json({ paymentsEnabled, paymentEnv: config.wompi.env, demo: config.demo, ...shippingSettings() })
})

store.get('/products', (_req, res) => {
  const rows = db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY sort, id').all()
  res.json(rows.map(productWithVariants))
})

store.get('/products/:slug', (req, res) => {
  const p = db.prepare('SELECT * FROM products WHERE slug = ? AND active = 1').get(req.params.slug)
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(productWithVariants(p))
})

store.post('/orders', (req, res) => {
  const { code, accessToken } = createOrder(req.body || {})
  const order = findOrder(code)
  res.status(201).json({
    code,
    accessToken,
    total: order.total_cop,
    checkoutUrl: paymentsEnabled ? checkoutUrl(order) : null,
  })
})

/** Ver un pedido: requiere el token del enlace o el correo de la compra. */
store.get('/orders/:code', async (req, res) => {
  const order = findOrder(req.params.code)
  const { t, email, id } = req.query
  const allowed = order && ((t && t === order.access_token) || (email && String(email).trim().toLowerCase() === order.email))
  if (!allowed) throw new HttpError(404, 'No encontramos un pedido con esos datos')

  // Al volver de Wompi (?id=transacción) se consulta el resultado como respaldo del webhook.
  if (id && paymentsEnabled && order.status === 'pendiente_pago') {
    try {
      const transaction = await fetchTransaction(id)
      if (transaction) applyTransaction(transaction)
    } catch { /* si Wompi no responde, queda el webhook */ }
  }
  const fresh = findOrder(order.code)
  res.json({
    ...publicOrder(fresh),
    accessToken: fresh.access_token,
    checkoutUrl: paymentsEnabled && ['pendiente_pago'].includes(fresh.status) ? checkoutUrl(fresh) : null,
  })
})

/** Webhook de Wompi (configurar en el panel de Wompi → URL de eventos). */
store.post('/wompi/events', (req, res) => {
  if (!paymentsEnabled || !verifyEvent(req.body)) return res.status(401).json({ error: 'Firma no válida' })
  if (req.body.event === 'transaction.updated') applyTransaction(req.body.data?.transaction)
  res.json({ ok: true })
})
