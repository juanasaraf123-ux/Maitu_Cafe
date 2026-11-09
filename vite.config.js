import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // La API (server/) corre en 8787 durante el desarrollo.
    proxy: { '/api': 'http://localhost:8787' },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // GSAP y Lenis en un archivo aparte: se cachean entre versiones del sitio.
        manualChunks: (id) => (/node_modules\/(gsap|@gsap|lenis)/.test(id) ? 'motion' : undefined),
      },
    },
  },
})
