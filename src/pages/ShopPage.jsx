import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'
import ProductCard from '../components/shop/ProductCard.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import '../components/shop/shop.css'

/** Catálogo: búsqueda, filtro grano/molido y orden por precio. */
export default function ShopPage() {
  usePageTitle('Tienda')
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
    <main className="page shop">
      <header className="page__head container">
        <p className="script">Tienda Maitú</p>
        <h1 className="page__title">Nuestros cafés</h1>
        <p className="lead">Elige tu café en grano o molido. Pagas seguro con PSE, tarjeta o Nequi y sigues tu pedido hasta tu puerta.</p>
      </header>

      <div className="container">
        <div className="filters" role="search">
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
          {list.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </div>
    </main>
  )
}
