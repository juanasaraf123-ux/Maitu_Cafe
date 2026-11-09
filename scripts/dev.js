// Arranca en paralelo la API (puerto 8787) y Vite (5173). Ctrl+C detiene ambos.
import { spawn } from 'node:child_process'
const run = (cmd, args) => spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' })
const procs = [run('npm', ['run', 'dev:api']), run('npm', ['run', 'dev:web'])]
const stop = () => { procs.forEach((p) => p.kill()); process.exit() }
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
