/**
 * FrameSequence — dibuja en un <canvas> una secuencia de imágenes según un
 * progreso 0..1 (que controla el scroll). Es la técnica de las páginas de
 * producto de Apple: fluida en todos los navegadores, incluido iOS, porque no
 * depende de decodificar video al vuelo.
 *
 * Carga progresiva: primero el cuadro 1 (para mostrar algo de inmediato),
 * después un cuadro de cada 8, luego de cada 4, de cada 2 y el resto. Así,
 * si el usuario hace scroll antes de que todo cargue, se dibuja el cuadro
 * cargado más cercano en lugar de un hueco.
 */
export class FrameSequence {
  constructor(canvas, { path, count, ext = 'webp', pad = 3 }) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', { alpha: false })
    this.count = count
    this.urls = Array.from({ length: count }, (_, i) => `${path}/${String(i + 1).padStart(pad, '0')}.${ext}`)
    this.images = new Array(count).fill(null)
    this.current = -1
    this.progress = 0
    this.destroyed = false
    this.onResize = this.resize.bind(this)
    window.addEventListener('resize', this.onResize)
    this.resize()
  }

  /** Orden de carga: 0, luego pasos de 8, 4, 2, 1. */
  loadOrder() {
    const seen = new Set([0])
    const order = [0]
    for (const step of [8, 4, 2, 1]) {
      for (let i = 0; i < this.count; i += step) {
        if (!seen.has(i)) { seen.add(i); order.push(i) }
      }
    }
    if (!seen.has(this.count - 1)) order.push(this.count - 1)
    return order
  }

  loadImage(i) {
    return new Promise((resolve) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (this.destroyed) return resolve()
        this.images[i] = img
        // Si este cuadro es mejor que el que se ve, redibujar.
        this.draw(true)
        resolve()
      }
      img.onerror = () => resolve()
      img.src = this.urls[i]
    })
  }

  /** Resuelve cuando el primer cuadro está listo; el resto sigue cargando. */
  async load({ concurrency = 6 } = {}) {
    const order = this.loadOrder()
    await this.loadImage(order[0])
    const queue = order.slice(1)
    const worker = async () => {
      while (queue.length && !this.destroyed) await this.loadImage(queue.shift())
    }
    this.rest = Promise.all(Array.from({ length: concurrency }, worker))
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const { clientWidth: w, clientHeight: h } = this.canvas
    if (!w || !h) return
    this.canvas.width = Math.round(w * dpr)
    this.canvas.height = Math.round(h * dpr)
    this.draw(true)
  }

  /** progress: 0..1 */
  render(progress) {
    this.progress = Math.min(1, Math.max(0, progress))
    this.draw(false)
  }

  nearestLoaded(index) {
    if (this.images[index]) return index
    for (let d = 1; d < this.count; d++) {
      if (this.images[index - d]) return index - d
      if (this.images[index + d]) return index + d
    }
    return -1
  }

  draw(force) {
    const target = Math.round(this.progress * (this.count - 1))
    const index = this.nearestLoaded(target)
    if (index < 0 || (!force && index === this.current)) return
    this.current = index
    const img = this.images[index]
    const { width: cw, height: ch } = this.canvas
    // object-fit: cover
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
  }

  destroy() {
    this.destroyed = true
    window.removeEventListener('resize', this.onResize)
    this.images = []
  }
}
