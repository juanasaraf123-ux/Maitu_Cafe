import { brand, emailLink, instagramLink, whatsappLink } from '../../content/brand.js'
import { Link } from 'react-router-dom'
import { navLinks } from '../../content/navigation.js'
import '../sections/sections.css'

/** Pie de página en 4 columnas (como la referencia) con los datos reales del empaque. */
export default function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img className="footer__logo" src={brand.logos.white} alt={brand.name} width="528" height="408" loading="lazy" />
          <p>{brand.description}</p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="footer__head">Explora</h2>
          <ul className="footer__list">
            {navLinks.map((l) => (
              <li key={l.href}>{l.href.startsWith('/#') ? <a href={l.href}>{l.label}</a> : <Link to={l.href}>{l.label}</Link>}</li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer__head">Contacto</h2>
          <ul className="footer__list">
            <li><a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp · {brand.contact.whatsappDisplay}</a></li>
            <li><a href={instagramLink} target="_blank" rel="noreferrer">Instagram · @{brand.contact.instagram}</a></li>
            <li><a href={emailLink}>{brand.contact.email}</a></li>
          </ul>
        </div>

        <div>
          <h2 className="footer__head">Compras</h2>
          <p className="footer__muted">Compra en línea y sigue tu pedido hasta la entrega.</p>
          <Link className="btn btn--caramel" to="/tienda">
            Ir a la tienda <span aria-hidden="true">→</span>
          </Link>
          <p className="footer__muted"><Link to="/pedido">Seguir mi pedido</Link></p>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {brand.name} · by {brand.founder}</p>
        <img src={brand.logos.seal} alt="" width="52" height="52" loading="lazy" />
      </div>
    </footer>
  )
}
