import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { brand, whatsappLink } from '../../content/brand.js'
import { api } from '../../lib/api.js'
import { formatCOP, formatWeight } from '../../lib/format.js'
import { gsap, useGSAP } from '../../animations/gsap.js'
import Bag3D from '../three/Bag3D.jsx'
import SplitHeading from '../fx/SplitHeading.jsx'
import './sections.css'

/**
 * Nuestros cafés — la bolsa Maitú en 3D al centro (se gira con el mouse o el
 * dedo), la palabra MAITÚ gigante detrás y datos flotando alrededor.
 */
export default function ProductsSection() {
  const ref = useRef(null)
  const [products, setProducts] = useState(null)
  useEffect(() => { api.products().then(setProducts).catch(() => setProducts([])) }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.showcase__word', { xPercent: 12 }, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.from('.chip-float', { scale: 0, opacity: 0, duration: 0.9, ease: 'back.out(2)', stagger: 0.12, scrollTrigger: { trigger: '.showcase__stage', start: 'top 70%', once: true } })
    })
    return () => mm.revert()
  }, { scope: ref })

  const p = products?.[0]
  const prices = p?.variants.map((v) => v.price) || []
  const from = prices.length ? Math.min(...prices) : null
  const presentations = [...new Set((p?.variants || []).map((v) => v.presentationLabel))]
  const weights = [...new Set((p?.variants || []).map((v) => formatWeight(v.weightG)))]

  return (
    <section id="cafes" ref={ref} className="section showcase">
      <span className="pattern pattern--dark" aria-hidden="true" />
      <span className="showcase__word" aria-hidden="true">MAITÚ</span>
      <div className="container showcase__grid">
        <div className="showcase__text">
          <p className="kicker kicker--dark">Nuestros cafés</p>
          <SplitHeading className="display-title" text={`${p?.name || brand.name} *en tu casa*`} />
          <p className="lead">Café de Colombia seleccionado por {brand.founder}. En grano para moler en casa o molido listo para tu método.</p>
          <p className="showcase__price">{from ? <>{prices.length > 1 && <small>Desde </small>}{formatCOP(from)}</> : <small>Muy pronto en la tienda</small>}</p>
          <div className="row__actions">
            <Link className="btn btn--dark" to={p && from ? `/tienda/${p.slug}` : '/tienda'}>
              Comprar ahora <span aria-hidden="true">→</span>
            </Link>
            <a className="circle-link circle-link--dark" href={whatsappLink(`Hola Maitú, quiero información sobre ${p?.name || 'sus cafés'}.`)} target="_blank" rel="noreferrer" aria-label="Preguntar por WhatsApp">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" /></svg>
            </a>
          </div>
        </div>
        <div className="showcase__stage">
          <div className="showcase__halo" aria-hidden="true" />
          <Bag3D className="showcase__bag" glow="#f2cf7e" />
          <span className="chip-float chip-float--1">☕ {p?.origin ? `Café de ${p.origin}` : 'Café de Colombia'}</span>
          <span className="chip-float chip-float--2">⚖️ {weights.length ? weights.join(' / ') : '340 g'}</span>
          <span className="chip-float chip-float--3">✨ {presentations.length ? presentations.join(' · ') : 'Grano · Molido'}</span>
        </div>
      </div>
    </section>
  )
}
