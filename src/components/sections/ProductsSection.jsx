import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { brand, whatsappLink } from '../../content/brand.js'
import { api } from '../../lib/api.js'
import { formatCOP, formatWeight } from '../../lib/format.js'
import { useReveal } from '../../hooks/useReveal.js'
import './sections.css'

/**
 * Nuestros cafés (inicio) — texto izquierda, empaque derecha. Toma el café
 * destacado de la tienda: si tiene precio lo muestra y lleva a comprarlo.
 */
export default function ProductsSection() {
  const ref = useRef(null)
  const [products, setProducts] = useState(null)
  useReveal(ref)

  useEffect(() => { api.products().then(setProducts).catch(() => setProducts([])) }, [])

  const p = products?.[0]
  const prices = p?.variants.map((v) => v.price) || []
  const from = prices.length ? Math.min(...prices) : null
  const presentations = [...new Set((p?.variants || []).map((v) => v.presentationLabel))]
  const weights = [...new Set((p?.variants || []).map((v) => formatWeight(v.weightG)))]

  return (
    <section id="cafes" ref={ref} className="section section--light">
      <span className="watermark" aria-hidden="true">Café</span>
      <div className="container row">
        <div className="row__text">
          <p className="script" data-reveal>Nuestros cafés</p>
          <h2 className="section__title" data-reveal>{p?.name || brand.name}</h2>
          <p className="lead" data-reveal>
            Café de Colombia seleccionado por {brand.founder}. En grano para moler en casa o molido listo para tu método.
          </p>
          <dl className="product__data" data-reveal>
            <div><dt>Origen</dt><dd>{p?.origin || 'Colombia'}</dd></div>
            <div><dt>Presentación</dt><dd>{presentations.length ? presentations.join(' · ') : 'Por confirmar'}</dd></div>
            <div><dt>Contenido</dt><dd>{weights.length ? weights.join(' / ') : '12 oz (340 g)'}</dd></div>
            <div><dt>Precio</dt><dd>{from ? `${prices.length > 1 ? 'Desde ' : ''}${formatCOP(from)}` : 'Muy pronto'}</dd></div>
          </dl>
          <div className="row__actions" data-reveal>
            <Link className="btn btn--caramel" to={p && from ? `/tienda/${p.slug}` : '/tienda'}>
              Comprar en la tienda <span aria-hidden="true">→</span>
            </Link>
            <a className="circle-link" href={whatsappLink(`Hola Maitú, quiero información sobre ${p?.name || 'sus cafés'}.`)} target="_blank" rel="noreferrer" aria-label="Preguntar por WhatsApp">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" /></svg>
            </a>
          </div>
        </div>
        <div className="row__media row__media--product" data-reveal>
          <img
            src="/media/productos/maitu-340g-frente.webp"
            srcSet="/media/productos/maitu-340g-frente-420.webp 420w, /media/productos/maitu-340g-frente.webp 720w"
            sizes="(max-width: 899px) 70vw, 30vw"
            alt={`Empaque de ${brand.name}, 12 oz (340 g)`}
            width="720"
            height="1039"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
