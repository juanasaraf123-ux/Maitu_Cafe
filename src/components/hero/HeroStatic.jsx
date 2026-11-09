import { chapters, heroFrames, heroIntro } from '../../content/hero.js'
import { whatsappLink } from '../../content/brand.js'
import './hero.css'

/**
 * Versión del recorrido para "reducir movimiento": sin pantalla fija, sin
 * scroll animado. Cada etapa es un bloque con su imagen fija y su texto.
 */
export default function HeroStatic() {
  const set = heroFrames.desktop
  const perChapter = set.count / chapters.length
  const frameFor = (i) =>
    `${set.path}/${String(Math.min(set.count, Math.round(i * perChapter + perChapter / 2))).padStart(3, '0')}.webp`

  return (
    <section id="inicio" className="film-static" aria-label="El recorrido del café, del origen a tu taza">
      {chapters.map((c, i) => (
        <article key={c.id} className="film-static__chapter">
          <img src={frameFor(i)} alt="" loading={i === 0 ? 'eager' : 'lazy'} width="1600" height="900" />
          <div className="film-static__text">
            <p className="chapter__eyebrow"><span>{c.number}</span> {c.title}</p>
            {i === 0 ? (
              <>
                <h1 className="chapter__display">{heroIntro.headline.join(' ')}</h1>
                <p className="chapter__sub">{heroIntro.sub}</p>
              </>
            ) : (
              <h2 className="chapter__title">{c.final ? 'Del origen a tu taza.' : c.copy}</h2>
            )}
            {c.live && <p className="chapter__sub">{c.live.waterMl} ml de agua · {Math.floor(c.live.seconds / 60)}:{String(c.live.seconds % 60).padStart(2, '0')} min</p>}
            {c.final && (
              <div className="chapter__actions">
                <a className="btn btn--light" href="#historia">Conoce nuestra historia</a>
                <a className="btn btn--brand" href={whatsappLink()} target="_blank" rel="noreferrer">Pedir por WhatsApp</a>
              </div>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}
