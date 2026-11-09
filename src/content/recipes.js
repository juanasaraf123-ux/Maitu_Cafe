/**
 * Recetas de preparación impresas en el empaque oficial de Maitú.
 * No modificar sin confirmación de la marca.
 */
export const recipes = [
  {
    id: 'goteo',
    method: 'Filtrado por goteo',
    note: 'Gotero cónico (tipo V60)',
    coffeeGrams: 25,
    grind: 'Molienda media',
    waterMl: 380,
    time: '3:30',
    timeSeconds: 210,
  },
  {
    id: 'prensa',
    method: 'Prensa francesa',
    note: 'Inmersión',
    coffeeGrams: 25,
    grind: 'Molienda gruesa',
    waterMl: 380,
    time: '4:40',
    timeSeconds: 280,
  },
  {
    id: 'aeropress',
    method: 'AeroPress',
    note: 'Presión manual',
    coffeeGrams: 16,
    grind: 'Molienda media',
    waterMl: 225,
    time: '2:30',
    timeSeconds: 150,
  },
]

/** Receta usada en la escena del filtrado del hero. */
export const heroRecipe = recipes[0]
