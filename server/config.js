/**
 * Configuración del servidor (variables de entorno). Ver .env.example.
 * Nunca subir el archivo .env con claves reales al repositorio.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Carga simple de .env (sin dependencias).
const envPath = resolve(process.cwd(), '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const env = process.env

export const config = {
  port: Number(env.PORT || 8787),
  publicUrl: (env.PUBLIC_URL || 'http://localhost:5173').replace(/\/$/, ''),
  dbPath: env.DB_PATH || resolve(process.cwd(), 'data', 'maitu.db'),
  orderExpiryHours: Number(env.ORDER_EXPIRY_HOURS || 24),
  // Muestra un aviso de "datos de prueba" en la web (solo desarrollo).
  demo: env.DEMO_MODE === '1',
  admin: {
    password: env.ADMIN_PASSWORD || '',
    secret: env.ADMIN_SECRET || '',
  },
  wompi: {
    env: env.WOMPI_ENV === 'production' ? 'production' : 'sandbox',
    publicKey: env.WOMPI_PUBLIC_KEY || '',
    integritySecret: env.WOMPI_INTEGRITY_SECRET || '',
    eventsSecret: env.WOMPI_EVENTS_SECRET || '',
  },
}

/** Los pagos en línea solo se activan con las tres claves de Wompi. */
export const paymentsEnabled = Boolean(
  config.wompi.publicKey && config.wompi.integritySecret && config.wompi.eventsSecret,
)
