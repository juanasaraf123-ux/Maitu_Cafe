import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import ProductCard from '../components/shop/ProductCard.jsx'
import Bag3D from '../components/three/Bag3D.jsx'
import SplitHeading from '../components/fx/SplitHeading.jsx'
import { useStoreConfig } from '../store/StoreConfig.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import '../components/shop/shop.css'
import '../components/sections/sections.css'

/** Tienda: encabezado con la bolsa 3D, filtros y catálogo. */
export default function ShopPage() {
  usePageTitle('Tienda')
  const cfg = useStoreConfig()
  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [presentation, setPresentation] = useState('todas')
  const [sort, setSort] = useState('destacados')

  useEffect(() => {
    api.products().then(setProducts).catch((e) => setError(e.message))
  }, [])

  const list = useMemo(() => {
    if (!products) return []
    const term = q.trim().toLowerCase()
    let out = products
      .map((p) => ({ ...p, variants: presentation === 'todas' ? p.variants : p.variants.filter((v) => v.presentation === presentation) }))
      .filter((p) => presentation === 'todas' || p.variants.length > 0)
      .filter((p) => !term || [p.name, p.summary, p.origin, p.variety, p.process, p.notes].join(' ').toLowerCase().includes(term))
    const minPrice = (p) => (p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : Infinity)
    if (sort === 'precio-asc') out = [...out].sort((a, b) => minPrice(a) - minPrice(b))
    if (sort === 'precio-desc') out = [...out].sort((a, b) => minPrice(b) - minPrice(a))
    return out
  }, [products, q, presentation, sort])

  return (
    <main className="shop">
      <section className="shop-hero">
        <span className="pattern pattern--caramel" aria-hidden="true" />
        <span className="glow" style={{ right: '-15vmax', top: '-20vmax' }} aria-hidden="true" />
        <div className="container shop-hero__grid">
          <div>
            <p className="kicker">Tienda Maitú</p>
            <SplitHeading as="h1" className="display-title" text="Café de Colombia *directo a tu casa*" />
            <p className="lead">Elige tu café en grano o molido, paga seguro en línea y sigue tu pedido hasta tu puerta.</p>
            <ul className="trust-chips">
              {cfg.paymentsEnabled ? <><li>🏦 PSE</li><li>💳 Tarjetas</li><li>📱 Nequi</li></> : <li>💬 Pago coordinado por WhatsApp</li>}
              <li>📦 Seguimiento</li>
            </ul>
          </div>
          <div className="shop-hero__stage">
            <div className="showcase__halo" aria-hidden="true" />
            <Bag3D glow="#d9a86c" />
          </div>
        </div>
      </section>

      <div className="container shop__body">
        <div className="filters glass" role="search">
          <label className="field field--search">
            <span className="sr-only">Buscar café</span>
            <input type="search" placeholder="Buscar café…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <div className="chips" role="radiogroup" aria-label="Presentación">
            {[['todas', 'Todos'], ['grano', 'En grano'], ['molido', 'Molido']].map(([k, label]) => (
              <button key={k} role="radio" aria-checked={presentation === k} className={`chip ${presentation === k ? 'is-active' : ''}`} onClick={() => setPresentation(k)}>
                {label}
              </button>
            ))}
          </div>
          <label className="field field--select">
            <span className="sr-only">Ordenar</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </label>
        </div>

        {error && <p className="alert alert--error">{error}</p>}
        {!products && !error && <p className="muted">Cargando cafés…</p>}
        {products && list.length === 0 && <p className="muted">No encontramos cafés con esos filtros.</p>}
        <div className="pgrid">
          {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </div>
    </main>
  )
}
