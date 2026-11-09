/**
 * DATOS DE PRUEBA — solo para probar la tienda en desarrollo.
 * Usa una base de datos aparte (data/demo.db) y NUNCA la de producción.
 *   npm run seed:demo
 * Precios, stock y el segundo café son inventados y se marcan como prueba.
 */
process.env.DB_PATH ||= 'data/demo.db'
if (!process.env.DB_PATH.includes('demo')) {
  console.error('seed-demo solo puede usar una base de datos de prueba (DB_PATH con "demo")')
  process.exit(1)
}
const { db } = await import('./db.js')
await import('./seed.js')

db.prepare("UPDATE variants SET price_cop = 42000, stock = 12 WHERE presentation = 'grano'").run()
db.prepare("UPDATE variants SET price_cop = 42000, stock = 3 WHERE presentation = 'molido'").run()
if (!db.prepare("SELECT 1 FROM products WHERE slug = 'cafe-de-prueba'").get()) {
  const { lastInsertRowid: id } = db.prepare(`INSERT INTO products (slug, name, summary, description, origin, variety, process, notes, image, active, sort)
    VALUES ('cafe-de-prueba', 'Café de prueba', 'PRODUCTO DE PRUEBA', 'Este producto existe solo para probar la tienda. No es un café real de Maitú.',
            'Prueba', 'Prueba', 'Prueba', 'Prueba', '/media/productos/maitu-340g-frente.webp', 1, 1)`).run()
  db.prepare("INSERT INTO variants (product_id, presentation, weight_g, price_cop, stock) VALUES (?, 'grano', 500, 58000, 0)").run(id)
}
db.prepare("INSERT INTO settings (key, value) VALUES ('shipping_cop', '9000') ON CONFLICT(key) DO UPDATE SET value = '9000'").run()
console.log('Datos de prueba listos en', process.env.DB_PATH)
