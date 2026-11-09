import { brand, emailLink, instagramLink, whatsappLink } from '../../content/brand.js'
import '../sections/sections.css'

/** Contacto y pie de página con los datos reales del empaque. */
export default function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="container footer__grid">
        <div>
          <img className="footer__logo" src={brand.logos.white} alt={brand.name} width="528" height="408" loading="lazy" />
          <p className="footer__desc">Café de {brand.origin.country}. {brand.tagline}.</p>
        </div>

        <div>
          <p className="eyebrow">Contacto</p>
          <h2 className="footer__title">¿Quieres tu café Maitú?</h2>
          <p>La tienda en línea está en construcción. Mientras tanto, haz tu pedido por WhatsApp.</p>
          <a className="btn btn--light" href={whatsappLink()} target="_blank" rel="noreferrer">
            Escribir por WhatsApp <span aria-hidden="true">→</span>
          </a>
        </div>

        <ul className="footer__links">
          <li><span>WhatsApp</span><a href={whatsappLink()} target="_blank" rel="noreferrer">{brand.contact.whatsappDisplay}</a></li>
          <li><span>Instagram</span><a href={instagramLink} target="_blank" rel="noreferrer">@{brand.contact.instagram}</a></li>
          <li><span>Correo</span><a href={emailLink}>{brand.contact.email}</a></li>
        </ul>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {brand.name} · by {brand.founder}</p>
        <img src={brand.logos.seal} alt="" width="56" height="56" loading="lazy" />
      </div>
    </footer>
  )
}
