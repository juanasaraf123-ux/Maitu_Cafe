import { heroRecipe as r } from './recipes.js'

/**
 * Inicio: video a pantalla completa que se reproduce solo, en bucle.
 *
 * - `VIDEOS.placeholder`: video PROVISIONAL generado con
 *   `npm run video:placeholder` (8 etapas × 2 s).
 * - `VIDEOS.recorrido`: video real. Prepararlo con
 *   `npm run video:optimize -- ruta/video.mp4` y activar abajo.
 *
 * `chapters[].start` es el segundo del video en que empieza cada etapa: el
 * letrero de abajo a la izquierda cambia en ese momento. Al cambiar de video
 * hay que ajustar estos tiempos.
 */
const VIDEOS = {
  placeholder: {
    desktop: '/media/hero/recorrido-placeholder.mp4',
    mobile: '/media/hero/recorrido-placeholder.mp4',
    poster: '/media/hero/recorrido-placeholder-poster.webp',
    isPlaceholder: true,
  },
  recorrido: {
    desktop: '/media/hero/recorrido-desktop.mp4',
    mobile: '/media/hero/recorrido-mobile.mp4',
    poster: '/media/hero/recorrido-poster.webp',
    isPlaceholder: false,
  },
}

export const heroVideo = VIDEOS.placeholder

export const heroText = {
  eyebrow: 'Café de Colombia · by Nicolas Bernal',
  headline: ['Todo comienza', 'mucho antes', 'del primer sorbo.'],
}

/** Etapas del recorrido (confirmadas por la marca). */
export const chapters = [
  { id: 'mata', number: '01', title: 'La mata', caption: 'Donde todo comienza, en la finca.', start: 0 },
  { id: 'cosecha', number: '02', title: 'La cosecha', caption: 'La cereza madura se coge a mano.', start: 2 },
  { id: 'beneficio', number: '03', title: 'El beneficio', caption: 'Cada café tiene su propio proceso.', start: 4 },
  { id: 'secado', number: '04', title: 'El secado', caption: 'El sol y el tiempo hacen su parte.', start: 6 },
  { id: 'grano', number: '05', title: 'El grano', caption: 'Lo esencial del fruto.', start: 8 },
  { id: 'molienda', number: '06', title: 'La molienda', caption: `${r.coffeeGrams} g · ${r.grind.toLowerCase()}.`, start: 10 },
  { id: 'filtrado', number: '07', title: 'El filtrado', caption: `${r.waterMl} ml de agua · ${r.time} min.`, start: 12 },
  { id: 'taza', number: '08', title: 'Tu taza', caption: 'Del origen a tu taza.', start: 14 },
]
