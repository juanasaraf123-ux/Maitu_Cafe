import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { formatCOP, formatWeight } from '../lib/format.js'
import { useCart } from '../store/CartContext.jsx'
import { useStoreConfig } from '../store/StoreConfig.jsx'
import { StockBadge } from '../components/shop/ProductCard.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import Bag3D from '../components/three/Bag3D.jsx'
import '../components/shop/shop.css'
import '../components/sections/sections.css'

/** Ficha del café: presentación (grano/molido), peso, cantidad, stock y precio. */
export default function ProductPage() {
  const { slug } = useParams()
  const { add, items } = useCart()
  const cfg = useStoreConfig()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [presentation, setPresentation] = useState(null)
  const [weight, setWeight] = useState(null)
  const [qty, setQty] = useState(1)
  usePageTitle(product?.name || 'Café')

  useEffect(() => {
    api.product(slug).then((p) => {
      setProduct(p)
      const first = p.variants.find((v) => v.stock > 0) || p.variants[0]
      if (first) { setPresentation(first.presentation); setWeight(first.weightG) }
    }).catch((e) => setError(e.message))
  }, [slug])

  const presentations = useMemo(() => [...new Map((product?.variants || []).map((v) => [v.presentation, v.presentationLabel])).entries()], [product])
  const weights = useMemo(() => [...new Set((product?.variants || []).filter((v) => v.presentation === presentation).map((v) => v.weightG))], [product, presentation])
  const variant = product?.variants.find((v) => v.presentation === presentation && v.weightG === weight)
  const inCart = items.find((l) => l.variantId === variant?.id)?.qty || 0
  const maxQty = variant ? Math.max(0, variant.stock - inCart) : 0

  useEffect(() => { if (weights.length && !weights.includes(weight)) setWeight(weights[0]) }, [weights, weight])
  useEffect(() => { setQty(1) }, [variant?.id])

  if (error) return <main className="page container"><p className="alert alert--error">{error}</p><Link to="/tienda">← Volver a la tienda</Link></main>
  if (!product) return <main className="page container"><p className="muted">Cargando…</p></main>

  const details = [['Origen', product.origin], ['Variedad', product.variety], ['Proceso', product.process], ['Notas', product.notes]].filter(([, v]) => v)

  return (
    <main className="page product">
      <div className="container">
        <nav className="crumbs" aria-label="Ruta"><Link to="/tienda">Tienda</Link> / <span>{product.name}</span></nav>
        <div className="product__grid">
          <div className="product__media">
            <span className="pattern" aria-hidden="true" />
            <div className="showcase__halo" aria-hidden="true" />
            <Bag3D glow="#f2cf7e" label={`Empaque de ${product.name} en 3D`} />
          </div>
          <div className="product__info">
            <p className="kicker">Café de {product.origin || 'Colombia'}</p>
            <h1 className="display-title">{product.name}</h1>
            {product.summary && <p className="lead">{product.summary}</p>}

            {product.variants.length === 0 ? (
              <p className="alert">Muy pronto disponible en la tienda. Mientras tanto puedes pedirlo por WhatsApp.</p>
            ) : (
              <>
                <p className="product__price text-gradient">{variant ? formatCOP(variant.price) : '—'}</p>
                <fieldset className="opts">
                  <legend>Presentación</legend>
                  {presentations.map(([k, label]) => (
                    <label key={k} className={`opt ${presentation === k ? 'is-active' : ''}`}>
                      <input type="radio" name="presentation" value={k} checked={presentation === k} onChange={() => setPresentation(k)} />
                      {label}
                    </label>
                  ))}
                </fieldset>
                <fieldset className="opts">
                  <legend>Peso</legend>
                  {weights.map((w) => (
                    <label key={w} className={`opt ${weight === w ? 'is-active' : ''}`}>
                      <input type="radio" name="weight" value={w} checked={weight === w} onChange={() => setWeight(w)} />
                      {formatWeight(w)}
                    </label>
                  ))}
                </fieldset>

                {variant && <p className="product__stock"><StockBadge stock={variant.stock} />{inCart > 0 && <span className="muted"> · {inCart} en tu carrito</span>}</p>}

                <div className="product__buy">
                  <div className="qty qty--lg" role="group" aria-label="Cantidad">
                    <button onClick={() => setQty((n) => Math.max(1, n - 1))} disabled={qty <= 1} aria-label="Menos">−</button>
                    <span aria-live="polite">{qty}</span>
                    <button onClick={() => setQty((n) => Math.min(maxQty, n + 1))} disabled={qty >= maxQty} aria-label="Más">+</button>
                  </div>
                  <button className="btn btn--glow btn--grow" disabled={!variant || maxQty < 1} onClick={() => add(product, variant, qty)}>
                    {variant?.stock === 0 ? 'Agotado' : maxQty < 1 ? 'Ya tienes todo el stock en el carrito' : 'Agregar al carrito'}
                  </button>
                </div>
              </>
            )}

            {product.description && <p className="product__desc">{product.description}</p>}
            {details.length > 0 && (
              <dl className="product__details">
                {details.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl>
            )}
            <ul className="trust">
              {cfg.paymentsEnabled
                ? <><li>🔒 Pago seguro con Wompi (Bancolombia)</li><li>🏦 PSE · 💳 Tarjetas · 📱 Nequi</li></>
                : <li>💬 Confirmamos tu pedido y el pago por WhatsApp</li>}
              <li>📦 Seguimiento de tu pedido hasta la entrega</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
