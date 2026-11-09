import { Link } from 'react-router-dom'
import { formatCOP, formatWeight, stockState } from '../../lib/format.js'
import './shop.css'

export function StockBadge({ stock }) {
  const s = stockState(stock)
  return <span className={`stock stock--${s.key}`}>{s.label}</span>
}

/** Tarjeta del catálogo: imagen, nombre, presentaciones, precio desde, disponibilidad. */
export default function ProductCard({ product }) {
  const prices = product.variants.map((v) => v.price)
  const from = prices.length ? Math.min(...prices) : null
  const stock = product.variants.reduce((s, v) => s + v.stock, 0)
  const presentations = [...new Set(product.variants.map((v) => v.presentationLabel))]
  const weights = [...new Set(product.variants.map((v) => formatWeight(v.weightG)))]

  return (
    <Link to={`/tienda/${product.slug}`} className="pcard">
      <div className="pcard__media">
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
      </div>
    </Link>
  )
}
