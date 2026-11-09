import { Link } from 'react-router-dom'
import { formatCOP, formatWeight, stockState } from '../../lib/format.js'
import { useTilt } from '../../hooks/useTilt.js'
import './shop.css'

export function StockBadge({ stock }) {
  const s = stockState(stock)
  return <span className={`stock stock--${s.key}`}>{s.label}</span>
}

/** Colores de fondo por café (del empaque y del manual). */
const TONES = [
  ['#1f4b7f', '#0f2a48'], ['#c24a35', '#5a1d14'], ['#d9a86c', '#8a5a33'], ['#005c67', '#012d33'],
]

/** Tarjeta del catálogo: se inclina con el puntero, con brillo que lo sigue. */
export default function ProductCard({ product, index = 0 }) {
  const tilt = useTilt(10)
  const prices = product.variants.map((v) => v.price)
  const from = prices.length ? Math.min(...prices) : null
  const stock = product.variants.reduce((s, v) => s + v.stock, 0)
  const presentations = [...new Set(product.variants.map((v) => v.presentationLabel))]
  const weights = [...new Set(product.variants.map((v) => formatWeight(v.weightG)))]
  const [c1, c2] = TONES[index % TONES.length]

  return (
    <Link to={`/tienda/${product.slug}`} className="pcard tilt" style={{ '--c1': c1, '--c2': c2 }} {...tilt}>
      <span className="tilt__shine" aria-hidden="true" />
      <div className="pcard__media">
        <span className="pattern" aria-hidden="true" />
        {product.image && <img src={product.image} alt="" loading="lazy" width="720" height="1039" />}
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{product.name}</h3>
        {product.summary && <p className="pcard__summary">{product.summary}</p>}
        {presentations.length > 0 && <p className="pcard__meta">{presentations.join(' · ')} · {weights.join(' / ')}</p>}
        <div className="pcard__foot">
          <span className="pcard__price">{from ? <>{prices.length > 1 && <small>Desde </small>}{formatCOP(from)}</> : 'Próximamente'}</span>
          {from && <StockBadge stock={stock} />}
        </div>
        <span className="pcard__cta">Ver café <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  )
}
