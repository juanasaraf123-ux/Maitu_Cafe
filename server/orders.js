/**
 * Lógica de pedidos: estados, creación con reserva de stock, cambios de
 * estado, liberación de stock y vencimiento de pedidos sin pagar.
 */
import { randomBytes } from 'node:crypto'
import { db, shippingSettings, tx } from './db.js'
import { config } from './config.js'

/** Estados del pedido, en el orden del seguimiento. */
export const STATUSES = {
  pendiente_pago: 'Pendiente de pago',
  pago_rechazado: 'Pago rechazado',
  pagado: 'Pago confirmado',
  alistando: 'Alistando tu pedido',
  empacado: 'Empacado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

/** Flujo normal (para la línea de tiempo y para validar cambios del panel). */
export const FLOW = ['pendiente_pago', 'pagado', 'alistando', 'empacado', 'enviado', 'entregado']

export const PRESENTATIONS = { grano: 'Grano', molido: 'Molido' }

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Códigos legibles, sin caracteres que se confundan (0/O, 1/I).
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
function newCode() {
  const bytes = randomBytes(6)
  let s = ''
  for (const b of bytes) s += ALPHABET[b % ALPHABET.length]
  return `MT-${s}`
}

const clean = (v, max = 200) => String(v ?? '').trim().slice(0, max)

export function validateCustomer(c = {}) {
  const customer = {
    name: clean(c.name, 120),
    email: clean(c.email, 160).toLowerCase(),
    phone: clean(c.phone, 30),
    document: clean(c.document, 30),
    department: clean(c.department, 60),
    city: clean(c.city, 80),
    address: clean(c.address, 200),
    notes: clean(c.notes, 500),
  }
  const missing = ['name', 'email', 'phone', 'document', 'department', 'city', 'address'].filter((k) => !customer[k])
  if (missing.length) throw new HttpError(400, `Faltan datos: ${missing.join(', ')}`)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) throw new HttpError(400, 'El correo no es válido')
  if (customer.phone.replace(/\D/g, '').length < 7) throw new HttpError(400, 'El celular no es válido')
  return customer
}

export function shippingFor(subtotal) {
  const { shippingCop, freeShippingFromCop } = shippingSettings()
  if (freeShippingFromCop && subtotal >= freeShippingFromCop) return 0
  return shippingCop || 0
}

/**
 * Crea el pedido y RESERVA el stock en la misma transacción, para que dos
 * personas no compren la última bolsa al mismo tiempo.
 */
export function createOrder({ items, customer }) {
  if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, 'El carrito está vacío')
  if (items.length > 30) throw new HttpError(400, 'Demasiados productos en un pedido')
  const c = validateCustomer(customer)

  return tx(() => {
    const lines = []
    for (const it of items) {
      const qty = Number(it.qty)
      if (!Number.isInteger(qty) || qty < 1 || qty > 50) throw new HttpError(400, 'Cantidad no válida')
      const v = db.prepare(`
        SELECT v.*, p.name AS product_name, p.active AS product_active
        FROM variants v JOIN products p ON p.id = v.product_id WHERE v.id = ?`).get(Number(it.variantId))
      if (!v || !v.active || !v.product_active || !v.price_cop) throw new HttpError(409, 'Un producto del carrito ya no está disponible')
      if (v.stock < qty) {
        throw new HttpError(409, `Solo quedan ${v.stock} de ${v.product_name} (${PRESENTATIONS[v.presentation]}, ${v.weight_g} g)`)
      }
      db.prepare('UPDATE variants SET stock = stock - ? WHERE id = ?').run(qty, v.id)
      lines.push({ v, qty })
    }

    const subtotal = lines.reduce((s, l) => s + l.v.price_cop * l.qty, 0)
    const shipping = shippingFor(subtotal)
    const total = subtotal + shipping
    let code = newCode()
    while (db.prepare('SELECT 1 FROM orders WHERE code = ?').get(code)) code = newCode()
    const accessToken = randomBytes(16).toString('hex')

    const { lastInsertRowid: orderId } = db.prepare(`
      INSERT INTO orders (code, access_token, status, customer_name, email, phone, document, department, city, address, notes,
                          subtotal_cop, shipping_cop, total_cop)
      VALUES (?, ?, 'pendiente_pago', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(code, accessToken, c.name, c.email, c.phone, c.document, c.department, c.city, c.address, c.notes, subtotal, shipping, total)

    const ins = db.prepare(`INSERT INTO order_items (order_id, variant_id, product_name, presentation, weight_g, unit_price_cop, qty)
                            VALUES (?, ?, ?, ?, ?, ?, ?)`)
    for (const { v, qty } of lines) ins.run(orderId, v.id, v.product_name, v.presentation, v.weight_g, v.price_cop, qty)
    addEvent(orderId, 'pendiente_pago', 'Pedido recibido')
    return { id: Number(orderId), code, accessToken, total }
  })
}

export function addEvent(orderId, status, note = '') {
  db.prepare('INSERT INTO order_events (order_id, status, note) VALUES (?, ?, ?)').run(orderId, status, note)
}

/** Devuelve el stock reservado (pedido rechazado, vencido o cancelado). */
export function releaseStock(order) {
  if (order.stock_released) return
  const items = db.prepare('SELECT variant_id, qty FROM order_items WHERE order_id = ?').all(order.id)
  for (const it of items) db.prepare('UPDATE variants SET stock = stock + ? WHERE id = ?').run(it.qty, it.variant_id)
  db.prepare('UPDATE orders SET stock_released = 1 WHERE id = ?').run(order.id)
}

/**
 * Cambia el estado. Al rechazar, cancelar o reabrir el pago se ajusta el stock.
 */
export function setStatus(order, status, note = '', extra = {}) {
  if (!STATUSES[status]) throw new HttpError(400, 'Estado no válido')
  tx(() => {
    if ((status === 'pago_rechazado' || status === 'cancelado') && order.status !== 'cancelado') releaseStock(order)
    db.prepare(`UPDATE orders SET status = ?, carrier = COALESCE(?, carrier), tracking_number = COALESCE(?, tracking_number),
                payment_tx_id = COALESCE(?, payment_tx_id), payment_method = COALESCE(?, payment_method), updated_at = datetime('now')
                WHERE id = ?`)
      .run(status, extra.carrier ?? null, extra.trackingNumber ?? null, extra.txId ?? null, extra.method ?? null, order.id)
    addEvent(order.id, status, note)
  })
}

export function findOrder(code) {
  return db.prepare('SELECT * FROM orders WHERE code = ?').get(String(code || '').toUpperCase())
}

/**
 * Datos del pedido para mostrar (sin el token de acceso). Las notas internas
 * (marcadas con ⚠) solo se muestran en el panel.
 */
export function publicOrder(o, { forAdmin = false } = {}) {
  const items = db.prepare('SELECT product_name, presentation, weight_g, unit_price_cop, qty FROM order_items WHERE order_id = ?').all(o.id)
  const events = db.prepare('SELECT status, note, created_at FROM order_events WHERE order_id = ? ORDER BY id').all(o.id)
  return {
    code: o.code,
    status: o.status,
    statusLabel: STATUSES[o.status],
    customer: { name: o.customer_name, email: o.email, phone: o.phone, department: o.department, city: o.city, address: o.address },
    items: items.map((i) => ({ ...i, presentationLabel: PRESENTATIONS[i.presentation] })),
    subtotal: o.subtotal_cop,
    shipping: o.shipping_cop,
    total: o.total_cop,
    paymentMethod: o.payment_method,
    carrier: o.carrier,
    trackingNumber: o.tracking_number,
    createdAt: o.created_at,
    events: events.filter((e) => forAdmin || !e.note.includes('⚠')).map((e) => ({ ...e, label: STATUSES[e.status] })),
  }
}

/** Cancela pedidos sin pagar después de N horas y libera el stock. */
export function expireOldOrders() {
  const old = db.prepare(`SELECT * FROM orders WHERE status IN ('pendiente_pago', 'pago_rechazado')
                          AND created_at < datetime('now', ?)`).all(`-${config.orderExpiryHours} hours`)
  for (const o of old) setStatus(o, 'cancelado', 'Cancelado automáticamente: no se recibió el pago')
  return old.length
}
