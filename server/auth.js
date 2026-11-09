/**
 * Sesión del panel de administración: token firmado con HMAC (sin dependencias).
 * La clave del panel (ADMIN_PASSWORD) y el secreto (ADMIN_SECRET) van en .env.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'
import { config } from './config.js'

const TTL_MS = 12 * 60 * 60 * 1000 // 12 horas
const b64 = (s) => Buffer.from(s).toString('base64url')
const sign = (data) => createHmac('sha256', config.admin.secret).update(data).digest('base64url')
const safeEqual = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))

export const adminConfigured = () => config.admin.password.length >= 8 && config.admin.secret.length >= 16

export function login(password) {
  if (!adminConfigured()) return null
  if (!safeEqual(String(password || ''), config.admin.password)) return null
  const payload = b64(JSON.stringify({ exp: Date.now() + TTL_MS }))
  return `${payload}.${sign(payload)}`
}

export function requireAdmin(req, res, next) {
  const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '')
  const [payload, sig] = token.split('.')
  if (adminConfigured() && payload && sig && safeEqual(sig, sign(payload))) {
    try {
      const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
      if (exp > Date.now()) return next()
    } catch { /* token dañado */ }
  }
  res.status(401).json({ error: 'Sesión no válida. Ingresa de nuevo.' })
}
