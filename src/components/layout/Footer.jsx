import { Link } from 'react-router-dom'
import { brand, emailLink, instagramLink, whatsappLink } from '../../content/brand.js'
import { navLinks } from '../../content/navigation.js'
import '../sections/sections.css'

/** Pie de página: llamado a la acción, cuatro columnas y la palabra MAITÚ gigante. */
export default function Footer() {
  return (
    <footer id="contacto" className="footer">
      <span className="glow" aria-hidden="true" />
      <span className="footer__giant" aria-hidden="true">MAITÚ</span>
      <div className="container">
        <div className="footer__cta">
          <p className="display-title">¿Un café <span className="text-gradient">de los buenos?</span></p>
          <Link className="btn btn--glow" to="/tienda">Ir a la tienda <span aria-hidden="true">→</span></Link>
        </div>
        <div className="footer__grid">
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
            <ul className="footer__list">
              <li><Link to="/tienda">Tienda</Link></li>
              <li><Link to="/pedido">Seguir mi pedido</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} {brand.name} · by {brand.founder}</p>
          <img src={brand.logos.seal} alt="" width="52" height="52" loading="lazy" />
        </div>
      </div>
    </footer>
  )
}
