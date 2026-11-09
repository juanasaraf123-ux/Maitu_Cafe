/** Onda divisoria entre secciones. `color` = color de la sección siguiente. */
export default function Wave({ color, flip = false, className = '' }) {
  return (
    <svg className={`wave ${flip ? 'wave--flip' : ''} ${className}`} viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true">
      <path fill={color} d="M0,70 C180,110 360,110 540,78 C720,46 900,20 1080,36 C1260,52 1350,86 1440,66 L1440,111 L0,111 Z" />
    </svg>
  )
}
