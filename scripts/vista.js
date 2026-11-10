// Vista previa local con datos de ejemplo (Windows, Mac o Linux):
//   npm run vista
// Crea data/demo.db si no existe y abre la web en http://localhost:5173
// Panel: http://localhost:5173/admin  (clave: maitu-demo-2026)
import { existsSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { spawnSync, spawn } from 'node:child_process'

const [major, minor] = process.versions.node.split('.').map(Number)
if (major < 22 || (major === 22 && minor < 13)) {
  console.error(`Necesitas Node.js 22.13 o más nuevo. Tienes ${process.versions.node}. Descárgalo en https://nodejs.org`)
  process.exit(1)
}

process.env.DB_PATH = 'data/demo.db'
process.env.DEMO_MODE = '1'
process.env.ADMIN_PASSWORD ||= 'maitu-demo-2026'
process.env.ADMIN_SECRET ||= randomBytes(24).toString('hex')

if (!existsSync('data/demo.db')) {
  spawnSync(process.execPath, ['--no-warnings', 'server/seed-demo.js'], { stdio: 'inherit' })
}

console.log('\n  ☕ Maitú en http://localhost:5173')
console.log('  🔑 Panel: http://localhost:5173/admin  (clave: ' + process.env.ADMIN_PASSWORD + ')')
console.log('  Para apagar: Ctrl + C\n')
const child = spawn(process.execPath, ['scripts/dev.js'], { stdio: 'inherit' })
process.on('SIGINT', () => child.kill('SIGINT'))
