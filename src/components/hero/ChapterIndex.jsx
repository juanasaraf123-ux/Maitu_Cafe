/**
 * Índice de capítulos 01–08. Cada número lleva al punto exacto del recorrido.
 * En escritorio es una columna a la derecha; en móvil, un contador compacto.
 */
export default function ChapterIndex({ chapters, active, onSelect }) {
  const current = chapters[active]
  return (
    <nav className="chapter-index" aria-label="Etapas del recorrido">
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              className={i === active ? 'is-active' : ''}
              aria-current={i === active ? 'step' : undefined}
              onClick={() => onSelect(i)}
            >
              <span className="chapter-index__num">{c.number}</span>
              <span className="chapter-index__name">{c.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="chapter-index__compact" aria-hidden="true">
        <b>{current.number}</b> / {chapters[chapters.length - 1].number} · {current.title}
      </p>
    </nav>
  )
}
