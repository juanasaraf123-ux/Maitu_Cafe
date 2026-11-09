import { useRef } from 'react'
import { brand, whatsappLink } from '../../content/brand.js'
import { products } from '../../content/products.js'
import { useReveal } from '../../hooks/useReveal.js'
import './sections.css'

/**
 * Nuestros cafés — texto izquierda, empaque derecha (como "Products" en la
 * referencia). Solo datos del empaque; precio y presentaciones se piden por
 * WhatsApp hasta que la marca los confirme. La tienda con carrito llega en la Etapa 7.
 */
export default function ProductsSection() {
  const ref = useRef(null)
  useReveal(ref)
  const p = products[0]

  return (
    <section id="cafes" ref={ref} className="section section--light">
      <span className="watermark" aria-hidden="true">Café</span>
      <div className="container row">
        <div className="row__text">
          <p className="script" data-reveal>Nuestros cafés</p>
          <h2 className="section__title" data-reveal>{p.name}</h2>
          <p className="lead" data-reveal>
            Café de Colombia seleccionado por {brand.founder}. Escríbenos y te contamos las presentaciones
            disponibles y cómo recibirlo.
          </p>
          <dl className="product__data" data-reveal>
            <div><dt>Origen</dt><dd>{p.origin}</dd></div>
            <div><dt>Contenido</dt><dd>{p.weight}</dd></div>
            <div><dt>Precio</dt><dd>{p.price ?? 'Consúltalo por WhatsApp'}</dd></div>
          </dl>
          <div className="row__actions" data-reveal>
            <a className="btn btn--brand" href={whatsappLink(`Hola Maitú, quiero pedir ${p.name} ${p.weight}.`)} target="_blank" rel="noreferrer">
              Pedir por WhatsApp <span aria-hidden="true">→</span>
            </a>
            <a className="circle-link" href="#preparacion" aria-label="Ver cómo prepararlo">→</a>
          </div>
        </div>
        <div className="row__media row__media--product" data-reveal>
          <img src={p.image} srcSet={`${p.imageSmall} 420w, ${p.image} 720w`} sizes="(max-width: 899px) 70vw, 30vw" alt={`Empaque de ${p.name}, ${p.weight}`} width="720" height="1039" loading="lazy" />
        </div>
      </div>
    </section>
  )
}
