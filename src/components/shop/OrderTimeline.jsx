import { formatDate } from '../../lib/format.js'

/**
 * Seguimiento del pedido: recibido → pago → alistando → empacado → enviado → entregado.
 * Muestra la fecha de cada paso cumplido.
 */
const STEPS = [
  { key: 'pendiente_pago', label: 'Pedido recibido', icon: '🧾' },
  { key: 'pagado', label: 'Pago confirmado', icon: '💳' },
  { key: 'alistando', label: 'Alistando', icon: '☕' },
  { key: 'empacado', label: 'Empacado', icon: '📦' },
  { key: 'enviado', label: 'Enviado', icon: '🚚' },
  { key: 'entregado', label: 'Entregado', icon: '🏡' },
]

export default function OrderTimeline({ order }) {
  const reached = new Map()
  for (const e of order.events) if (!reached.has(e.status)) reached.set(e.status, e.created_at)
  const currentIndex = STEPS.findIndex((s) => s.key === order.status)

  return (
    <ol className="timeline">
      {STEPS.map((s, i) => {
        const done = reached.has(s.key) && (currentIndex === -1 ? true : i <= currentIndex)
        const current = s.key === order.status
        return (
          <li key={s.key} className={`timeline__step ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`} aria-current={current ? 'step' : undefined}>
            <span className="timeline__dot" aria-hidden="true">{done ? '✓' : s.icon}</span>
            <div>
              <p className="timeline__label">{s.label}</p>
              {done && reached.get(s.key) && <p className="timeline__date">{formatDate(reached.get(s.key))}</p>}
              {s.key === 'enviado' && done && order.trackingNumber && (
                <p className="timeline__extra">{order.carrier} · Guía <b>{order.trackingNumber}</b></p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
