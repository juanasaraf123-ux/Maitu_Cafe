const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

/** 42000 → "$ 42.000" */
export const formatCOP = (n) => cop.format(n || 0)

export const formatWeight = (g) => (g >= 1000 && g % 1000 === 0 ? `${g / 1000} kg` : `${g} g`)

export const formatDate = (iso) =>
  new Date(`${iso.replace(' ', 'T')}Z`).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

/** Estado de inventario para mostrar al cliente. */
export function stockState(stock) {
  if (stock <= 0) return { key: 'agotado', label: 'Agotado' }
  if (stock <= 3) return { key: 'pocas', label: `Últimas ${stock} unidades` }
  return { key: 'disponible', label: 'Disponible' }
}
