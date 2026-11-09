# Maitú Café — Del origen a tu taza

Sitio web de **Maitú Café** (by Nicolas Bernal): un inicio con video a pantalla completa
que muestra el recorrido del café de la mata a la taza, contenido de marca y, después, la tienda.

**Stack:** React 19 · Vite · GSAP + ScrollTrigger · Lenis · CSS. Three.js / React Three
Fiber se agregan en la Etapa 5.

## Ejecutar

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # versión de producción en dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

## Estado

| Etapa | | Estado |
|---|---|---|
| 1 | Identidad visual (con la marca real) | ✅ |
| 2 | Proyecto React + Vite | ✅ |
| 3 | Inicio: apertura + video a pantalla completa con letrero de etapa | ✅ Funcional, con video **provisional** |
| 4 | Animaciones GSAP (entradas, letrero, apariciones al hacer scroll) | ✅ Base lista |
| 5 | Elementos 3D | Pendiente |
| 6 | Historia, origen y procesos | Parcial: historia y recetas reales; faltan fincas y procesos |
| 7 | Catálogo y tienda | Pendiente (hoy: pedidos por WhatsApp) |
| 8 | Responsive | Base lista (composición móvil propia) |
| 9 | Optimización y pruebas | Pendiente |

## Estructura

```
public/brand/            Logos oficiales en SVG (extraídos del .ai)
public/media/hero/       Video del inicio (provisional hoy, real después) y póster
public/media/historia/   Foto real de Nicolas
scripts/                 Generar el video provisional · optimizar el video real
src/content/             Textos y datos editables (marca, recetas, recorrido, menú)
src/animations/          GSAP y scroll suave
src/components/hero/     Apertura y video del inicio con letrero de etapa
src/components/sections/ Historia, Preparación
src/components/layout/   Menú, pie de página
src/hooks/               Movimiento reducido, media queries, apariciones
src/styles/              Tokens de diseño y estilos globales
docs/                    Identidad, técnica del inicio, multimedia, datos pendientes
```

## Integrar el video real del inicio

```bash
npm run video:optimize -- ruta/al/video.mp4
```

Luego, en `src/content/hero.js`, cambiar `VIDEOS.placeholder` por `VIDEOS.recorrido`
y ajustar el segundo en que empieza cada etapa.

> Todo lo marcado como **PLACEHOLDER** o **⚠** debe reemplazarse con material real de la marca.
