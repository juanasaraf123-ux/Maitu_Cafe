/**
 * Servidor de Maitú Café: API de la tienda + sitio compilado (dist/).
 *   npm run start       → producción (sirve dist/ y /api)
 *   npm run dev:api     → API en desarrollo (Vite redirige /api aquí)
 */
import express from 'express'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config, paymentsEnabled } from './config.js'
import { expireOldOrders } from './orders.js'
import { store } from './routes/store.js'
import { admin } from './routes/admin.js'
import { adminConfigured } from './auth.js'
import './seed.js'

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(express.json({ limit: '50kb' }))
app.use((_req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff')
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

app.use('/api', store)
app.use('/api/admin', admin)
app.use('/api', (_req, res) => res.status(404).json({ error: 'No encontrado' }))

// Sitio compilado (producción). Las rutas de React (/tienda, /pedido…) devuelven index.html.
const dist = resolve(process.cwd(), 'dist')
if (existsSync(dist)) {
  app.use(express.static(dist, { maxAge: '7d', index: false }))
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(resolve(dist, 'index.html')))
}

// Errores: mensajes claros al cliente, detalle solo en el registro del servidor.
app.use((err, _req, res, _next) => {
  const status = err.status || (err.type === 'entity.parse.failed' ? 400 : 500)
  if (status >= 500) console.error(err)
  res.status(status).json({ error: status >= 500 ? 'Error del servidor. Intenta de nuevo.' : err.message })
})

expireOldOrders()
setInterval(expireOldOrders, 10 * 60 * 1000).unref()

app.listen(config.port, () => {
  console.log(`Maitú API en http://localhost:${config.port}`)
  console.log(`  Pagos Wompi: ${paymentsEnabled ? `activos (${config.wompi.env})` : 'NO configurados (los pedidos se coordinan por WhatsApp)'}`)
  console.log(`  Panel admin: ${adminConfigured() ? 'activo' : 'NO configurado (ADMIN_PASSWORD / ADMIN_SECRET)'}`)
})
