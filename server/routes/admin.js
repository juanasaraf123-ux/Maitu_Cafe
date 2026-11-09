/** API del panel de administración (requiere sesión). */
import { Router } from 'express'
import { db, setSetting, shippingSettings } from '../db.js'
import { findOrder, HttpError, publicOrder, setStatus, STATUSES } from '../orders.js'
import { adminConfigured, login, requireAdmin } from '../auth.js'

export const admin = Router()

admin.post('/login', (req, res) => {
  if (!adminConfigured()) throw new HttpError(503, 'El panel no está configurado: define ADMIN_PASSWORD y ADMIN_SECRET en el servidor')
  const token = login(req.body?.password)
  if (!token) throw new HttpError(401, 'Clave incorrecta')
  res.json({ token })
})

admin.use(requireAdmin)

const int = (v, { min = 0, nullable = false } = {}) => {
  if (nullable && (v === null || v === '' || v === undefined)) return null
  const n = Number(v)
  if (!Number.isInteger(n) || n < min) throw new HttpError(400, 'Número no válido')
  return n
}
const text = (v, max = 2000) => String(v ?? '').trim().slice(0, max)
const slugify = (s) => text(s, 80).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// ---------- Productos ----------
admin.get('/products', (_req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY sort, id').all()
  const variants = db.prepare('SELECT * FROM variants WHERE product_id = ? ORDER BY weight_g, presentation')
  res.json(products.map((p) => ({ ...p, variants: variants.all(p.id) })))
})

const PRODUCT_FIELDS = ['name', 'summary', 'description', 'origin', 'variety', 'process', 'notes', 'image']

admin.post('/products', (req, res) => {
  const name = text(req.body?.name, 120)
  if (!name) throw new HttpError(400, 'El nombre es obligatorio')
  const slug = slugify(req.body?.slug || name)
  if (db.prepare('SELECT 1 FROM products WHERE slug = ?').get(slug)) throw new HttpError(409, 'Ya existe un café con ese nombre')
  const { lastInsertRowid } = db.prepare('INSERT INTO products (slug, name, active) VALUES (?, ?, 0)').run(slug, name)
  res.status(201).json({ id: Number(lastInsertRowid) })
})

admin.put('/products/:id', (req, res) => {
  const p = db.prepare('SELECT * FROM products WHERE id = ?').get(int(req.params.id))
  if (!p) throw new HttpError(404, 'Producto no encontrado')
  const b = req.body || {}
  const next = { ...p }
  for (const f of PRODUCT_FIELDS) if (f in b) next[f] = text(b[f])
  if ('active' in b) next.active = b.active ? 1 : 0
  if ('sort' in b) next.sort = int(b.sort)
  if (!next.name) throw new HttpError(400, 'El nombre es obligatorio')
  db.prepare(`UPDATE products SET name=?, summary=?, description=?, origin=?, variety=?, process=?, notes=?, image=?, active=?, sort=? WHERE id=?`)
    .run(next.name, next.summary, next.description, next.origin, next.variety, next.process, next.notes, next.image, next.active, next.sort, p.id)
  res.json({ ok: true })
})

admin.post('/products/:id/variants', (req, res) => {
  const b = req.body || {}
  if (!['grano', 'molido'].includes(b.presentation)) throw new HttpError(400, 'Presentación: grano o molido')
  try {
    db.prepare('INSERT INTO variants (product_id, presentation, weight_g, price_cop, stock) VALUES (?, ?, ?, ?, ?)')
      .run(int(req.params.id), b.presentation, int(b.weightG, { min: 1 }), int(b.price, { min: 1, nullable: true }), int(b.stock ?? 0))
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) throw new HttpError(409, 'Esa presentación y peso ya existen')
    throw e
  }
  res.status(201).json({ ok: true })
})

admin.put('/variants/:id', (req, res) => {
  const v = db.prepare('SELECT * FROM variants WHERE id = ?').get(int(req.params.id))
  if (!v) throw new HttpError(404, 'Presentación no encontrada')
  const b = req.body || {}
  const price = 'price' in b ? int(b.price, { min: 1, nullable: true }) : v.price_cop
  const stock = 'stock' in b ? int(b.stock) : v.stock
  const active = 'active' in b ? (b.active ? 1 : 0) : v.active
  db.prepare('UPDATE variants SET price_cop = ?, stock = ?, active = ? WHERE id = ?').run(price, stock, active, v.id)
  res.json({ ok: true })
})

// ---------- Pedidos ----------
admin.get('/orders', (req, res) => {
  const status = STATUSES[req.query.status] ? req.query.status : null
  const rows = status
    ? db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY id DESC LIMIT 200').all(status)
    : db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 200').all()
  res.json(rows.map((o) => ({ code: o.code, status: o.status, statusLabel: STATUSES[o.status], customer: o.customer_name, city: o.city, total: o.total_cop, createdAt: o.created_at })))
})

admin.get('/orders/:code', (req, res) => {
  const o = findOrder(req.params.code)
  if (!o) throw new HttpError(404, 'Pedido no encontrado')
  res.json({ ...publicOrder(o, { forAdmin: true }), document: o.document, notes: o.notes, paymentTxId: o.payment_tx_id, link: `/pedido/${o.code}?t=${o.access_token}` })
})

admin.post('/orders/:code/status', (req, res) => {
  const o = findOrder(req.params.code)
  if (!o) throw new HttpError(404, 'Pedido no encontrado')
  const { status } = req.body || {}
  if (!STATUSES[status]) throw new HttpError(400, 'Estado no válido')
  if (status === 'enviado' && !text(req.body.trackingNumber) && !o.tracking_number) {
    throw new HttpError(400, 'Para marcar como enviado escribe la transportadora y el número de guía')
  }
  setStatus(o, status, text(req.body.note, 300), {
    carrier: req.body.carrier !== undefined ? text(req.body.carrier, 60) : undefined,
    trackingNumber: req.body.trackingNumber !== undefined ? text(req.body.trackingNumber, 60) : undefined,
  })
  res.json({ ok: true })
})

// ---------- Ajustes ----------
admin.get('/settings', (_req, res) => res.json(shippingSettings()))
admin.put('/settings', (req, res) => {
  setSetting('shipping_cop', int(req.body?.shippingCop ?? 0))
  setSetting('free_shipping_from_cop', int(req.body?.freeShippingFromCop, { min: 1, nullable: true }))
  res.json(shippingSettings())
})
