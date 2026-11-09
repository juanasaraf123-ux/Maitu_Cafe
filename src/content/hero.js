import { heroRecipe } from './recipes.js'

/**
 * Configuración del recorrido cinematográfico del inicio.
 *
 * - `frames`: secuencia de imágenes que se dibuja según el scroll.
 *   Hoy apunta a los fotogramas PROVISIONALES. Cuando exista el video real:
 *   `npm run frames:video -- ruta/video.mp4 180 120` y cambiar `set` a 'recorrido'.
 * - `chapters`: etapas del recorrido. `copy` es texto provisional de la web
 *   (no son datos técnicos); los datos en vivo salen de la receta del empaque.
 */
const SETS = {
  placeholder: {
    desktop: { path: '/media/hero/placeholder', count: 90 },
    mobile: { path: '/media/hero/placeholder', count: 90 },
    isPlaceholder: true,
  },
  recorrido: {
    desktop: { path: '/media/hero/recorrido/desktop', count: 180 },
    mobile: { path: '/media/hero/recorrido/mobile', count: 120 },
    isPlaceholder: false,
  },
}

export const heroFrames = SETS.placeholder

export const heroIntro = {
  headline: ['Todo comienza', 'mucho antes', 'del primer sorbo.'],
  sub: 'En la finca, la cereza madura se coge a mano, directo de la mata.',
  cta: 'Descubrir el recorrido',
}

/**
 * Recorrido definido por la marca:
 * la cereza se coge de la mata en la finca → se seca → se muele → se filtra → la taza.
 */
export const chapters = [
  { id: 'cosecha', number: '01', title: 'La cosecha', copy: null }, // usa heroIntro
  { id: 'secado', number: '02', title: 'El secado', copy: 'El sol y el tiempo hacen su parte.' },
  {
    id: 'molienda',
    number: '03',
    title: 'La molienda',
    copy: 'Justo antes de preparar, para no perder el aroma.',
    data: [{ label: 'Café', value: `${heroRecipe.coffeeGrams} g` }, { label: 'Molienda', value: heroRecipe.grind.replace('Molienda ', '') }],
  },
  {
    id: 'filtrado',
    number: '04',
    title: 'El filtrado',
    copy: 'Agua, tiempo y paciencia.',
    live: { waterMl: heroRecipe.waterMl, seconds: heroRecipe.timeSeconds },
  },
  { id: 'taza', number: '05', title: 'Tu taza', copy: 'Del origen a tu taza.', final: true },
]
