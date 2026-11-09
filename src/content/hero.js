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
    desktop: { path: '/media/hero/placeholder', count: 112 },
    mobile: { path: '/media/hero/placeholder', count: 112 },
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
  sub: 'Café de Colombia, de la finca a tu taza.',
  cta: 'Descubrir el recorrido',
}

/**
 * Recorrido en 8 etapas (confirmado por la marca):
 * la mata → la cosecha → el beneficio → el secado → el grano → la molienda →
 * el filtrado → tu taza.
 */
export const chapters = [
  { id: 'mata', number: '01', title: 'La mata', copy: null }, // usa heroIntro
  { id: 'cosecha', number: '02', title: 'La cosecha', copy: 'En la finca, la cereza madura se coge a mano, directo de la mata.' },
  { id: 'beneficio', number: '03', title: 'El beneficio', copy: 'Se despulpa y se lava: del fruto queda el grano.' },
  { id: 'secado', number: '04', title: 'El secado', copy: 'El sol y el tiempo hacen su parte.' },
  { id: 'grano', number: '05', title: 'El grano', copy: 'Lo esencial del fruto, listo para el tueste.' },
  {
    id: 'molienda',
    number: '06',
    title: 'La molienda',
    copy: 'Justo antes de preparar, para no perder el aroma.',
    data: [{ label: 'Café', value: `${heroRecipe.coffeeGrams} g` }, { label: 'Molienda', value: heroRecipe.grind.replace('Molienda ', '') }],
  },
  {
    id: 'filtrado',
    number: '07',
    title: 'El filtrado',
    copy: 'Agua, tiempo y paciencia.',
    live: { waterMl: heroRecipe.waterMl, seconds: heroRecipe.timeSeconds },
  },
  { id: 'taza', number: '08', title: 'Tu taza', copy: 'Del origen a tu taza.', final: true },
]
