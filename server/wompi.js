/**
 * Integración con Wompi (Bancolombia): PSE, tarjetas, Nequi, botón Bancolombia
 * y demás medios que tenga activos el comercio.
 *
 * Flujo:
 *  1. El servidor crea el pedido y arma el enlace al Web Checkout de Wompi con la
 *     firma de integridad (así nadie puede cambiar el valor a pagar).
 *  2. El cliente paga en Wompi y vuelve a /pedido/CODIGO?id=TRANSACCION.
 *  3. Wompi avisa el resultado al webhook (/api/wompi/events). Se verifica la firma
 *     del evento antes de cambiar el pedido. Como respaldo, la página del pedido
 *     consulta la transacción a la API de Wompi.
 *
 * Documentación: https://docs.wompi.co/
 */
import { createHash, timingSafeEqual } from 'node:crypto'
import { config } from './config.js'
import { db, tx } from './db.js'
import { addEvent, findOrder, setStatus } from './orders.js'

const API = {
  sandbox: 'https://sandbox.wompi.co/v1',
  production: 'https://production.wompi.co/v1',
}

const sha256 = (s) => createHash('sha256').update(s).digest('hex')

/** Firma de integridad: SHA256(referencia + monto_en_centavos + moneda + secreto). */
export function integritySignature(reference, amountInCents, currency = 'COP') {
  return sha256(`${reference}${amountInCents}${currency}${config.wompi.integritySecret}`)
}

/** Enlace al Web Checkout de Wompi para un pedido. */
export function checkoutUrl(order) {
  const amountInCents = order.total_cop * 100
  const params = new URLSearchParams({
    'public-key': config.wompi.publicKey,
    currency: 'COP',
    'amount-in-cents': String(amountInCents),
    reference: order.code,
    'signature:integrity': integritySignature(order.code, amountInCents),
    'redirect-url': `${config.publicUrl}/pedido/${order.code}?t=${order.access_token}`,
    'customer-data:email': order.email,
    'customer-data:full-name': order.customer_name,
    'customer-data:phone-number': order.phone.replace(/\D/g, ''),
    'customer-data:phone-number-prefix': '+57',
    'customer-data:legal-id': order.document,
    'customer-data:legal-id-type': 'CC',
  })
  return `https://checkout.wompi.co/p/?${params.toString()}`
}

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)

/**
 * Verifica la firma de un evento de Wompi:
 * SHA256(valores de signature.properties + timestamp + secreto de eventos).
 */
export function verifyEvent(body) {
  const props = body?.signature?.properties
  const checksum = String(body?.signature?.checksum || '').toLowerCase()
  if (!Array.isArray(props) || !checksum || body.timestamp == null) return false
  const concatenated = props.map((p) => get(body.data, p)).join('') + body.timestamp + config.wompi.eventsSecret
  const expected = sha256(concatenated)
  return expected.length === checksum.length && timingSafeEqual(Buffer.from(expected), Buffer.from(checksum))
}

const METHOD_LABELS = {
  PSE: 'PSE',
  CARD: 'Tarjeta',
  NEQUI: 'Nequi',
  BANCOLOMBIA_TRANSFER: 'Botón Bancolombia',
  BANCOLOMBIA_COLLECT: 'Efectivo (corresponsal Bancolombia)',
  DAVIPLATA: 'Daviplata',
}

/** Vuelve a reservar el stock si el pedido se había liberado (pago aprobado tarde). */
function reReserve(order) {
  if (!order.stock_released) return []
  const short = []
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id)
  for (const it of items) {
    const ok = db.prepare('UPDATE variants SET stock = stock - ? WHERE id = ? AND stock >= ?').run(it.qty, it.variant_id, it.qty)
    if (!ok.changes) short.push(`${it.product_name} ×${it.qty}`)
  }
  db.prepare('UPDATE orders SET stock_released = 0 WHERE id = ?').run(order.id)
  return short
}

/**
 * Aplica el resultado de una transacción de Wompi al pedido. Comprueba que la
 * referencia, el valor y la moneda coincidan exactamente con el pedido.
 */
export function applyTransaction(t) {
  if (!t?.reference) return { ok: false, reason: 'sin referencia' }
  const order = findOrder(t.reference)
  if (!order) return { ok: false, reason: 'pedido no encontrado' }
  if (Number(t.amount_in_cents) !== order.total_cop * 100 || (t.currency && t.currency !== 'COP')) {
    addEvent(order.id, order.status, `⚠ Transacción ${t.id} con valor distinto al del pedido: no se aplicó`)
    return { ok: false, reason: 'monto no coincide' }
  }
  const method = METHOD_LABELS[t.payment_method_type] || t.payment_method_type || null

  if (t.status === 'APPROVED') {
    if (!['pendiente_pago', 'pago_rechazado', 'cancelado'].includes(order.status)) return { ok: true, unchanged: true }
    let short = []
    tx(() => { short = reReserve(order) })
    const note = short.length
      ? `Pago aprobado (${method}). ⚠ Sin stock suficiente para: ${short.join(', ')}. Contactar al cliente.`
      : `Pago aprobado${method ? ` con ${method}` : ''}`
    setStatus(findOrder(order.code), 'pagado', note, { txId: t.id, method })
    return { ok: true, status: 'pagado' }
  }
  if (['DECLINED', 'VOIDED', 'ERROR'].includes(t.status)) {
    if (order.status !== 'pendiente_pago') return { ok: true, unchanged: true }
    const reason = t.status_message ? `: ${t.status_message}` : ''
    setStatus(order, 'pago_rechazado', `Pago no aprobado${method ? ` (${method})` : ''}${reason}`, { txId: t.id, method })
    return { ok: true, status: 'pago_rechazado' }
  }
  return { ok: true, status: 'pendiente' } // PENDING: esperar el evento final
}

/** Consulta una transacción en la API de Wompi (respaldo del webhook). */
export async function fetchTransaction(id) {
  if (!/^[\w-]{4,64}$/.test(String(id))) return null
  const res = await fetch(`${API[config.wompi.env]}/transactions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${config.wompi.publicKey}` },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) return null
  const json = await res.json()
  return json?.data ?? null
}
