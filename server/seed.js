/**
 * Carga inicial: el único café confirmado por el empaque (Maitú Café, 340 g).
 * Precio vacío y stock 0: NO se puede comprar hasta que la marca los defina en
 * el panel /admin. Solo se ejecuta si la base de datos está vacía.
 */
import { db } from './db.js'

if (!db.prepare('SELECT 1 FROM products LIMIT 1').get()) {
  const { lastInsertRowid: id } = db.prepare(`
    INSERT INTO products (slug, name, summary, description, origin, image, active)
    VALUES (?, ?, ?, ?, ?, ?, 1)`).run(
    'maitu-cafe',
    'Maitú Café',
    'Café de Colombia by Nicolas Bernal.',
    'Maitú es la invitación a explorar el mundo del café, a descubrir sabores ancestrales y a crear nuevas experiencias. Maitú es un puente entre el pasado y el presente, una conexión con nuestras raíces culturales.',
    'Colombia',
    '/media/productos/maitu-340g-frente.webp',
  )
  const v = db.prepare('INSERT INTO variants (product_id, presentation, weight_g, price_cop, stock) VALUES (?, ?, 340, NULL, 0)')
  v.run(id, 'grano')
  v.run(id, 'molido')
  console.log('Base de datos inicial creada: Maitú Café 340 g (sin precio ni stock: definir en /admin)')
}
