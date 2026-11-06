# Maitu Café — Del origen a tu taza

Plataforma web premium para una marca de café del Tolima, Colombia: experiencia
cinematográfica controlada por scroll + contenido de origen y proceso + tienda.

**Stack previsto:** React · Vite · GSAP + ScrollTrigger · Three.js + React Three Fiber · CSS3.

## Estado por etapas

| Etapa | Descripción | Estado |
|-------|-------------|--------|
| 1 | Identidad visual y diseño conceptual | ✅ Propuesta lista para aprobación |
| 2 | Configuración React + Vite | Pendiente |
| 3 | Inicio cinematográfico | Pendiente |
| 4 | GSAP + ScrollTrigger | Pendiente |
| 5 | Elementos 3D | Pendiente |
| 6 | Historia, origen y procesos | Pendiente |
| 7 | Catálogo y tienda (pedidos por WhatsApp) | Pendiente |
| 8 | Responsive | Pendiente |
| 9 | Optimización y pruebas | Pendiente |

## Etapa 1 — archivos

| Archivo | Contenido |
|---------|-----------|
| `docs/01-identidad-visual.md` | Concepto, paleta con contrastes WCAG, tipografía, foto/video, voz, movimiento |
| `docs/02-hero-cinematografico.md` | Propuesta visual y técnica del hero: apertura, 8 escenas, transiciones, 3D, móvil, rendimiento |
| `docs/03-recursos-multimedia.md` | Lista de tomas, especificaciones de entrega y web, comandos ffmpeg, nombres de archivo |
| `docs/04-informacion-requerida.md` | Datos que debe entregar la marca (nada se inventa) |
| `src/styles/tokens.css` | Design tokens: color, tipografía fluida, espaciado, movimiento, capas |
| `design/logo-provisional.svg` | Logotipo **provisional** solo para maquetar |
| `design/styleguide.html` | Styleguide visual: fotograma del hero, paleta, tipografía, botones, storyboard |

### Cómo ver la styleguide

```bash
python3 -m http.server 8080
```

Luego abre `http://localhost:8080/design/styleguide.html` (las rutas relativas cargan
`src/styles/tokens.css`).

> Todo contenido marcado como **PLACEHOLDER** o **⚠ PROVISIONAL** debe reemplazarse con
> información y material real de la marca.
