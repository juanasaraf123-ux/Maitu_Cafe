# Maitú Café — Del origen a tu taza

Sitio web de **Maitú Café** (by Nicolas Bernal): un recorrido cinematográfico, controlado
con el scroll, desde la mata hasta la taza, más contenido de marca y, después, la tienda.

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
| 3 | Inicio cinematográfico: apertura + recorrido por scroll | ✅ Funcional, con cuadros **provisionales** |
| 4 | GSAP / ScrollTrigger: timeline maestro, índice, datos en vivo | ✅ Base lista; se afinará con el video real |
| 5 | Elementos 3D | Pendiente |
| 6 | Historia, origen y procesos | Parcial: historia y recetas reales; faltan fincas y procesos |
| 7 | Catálogo y tienda | Pendiente (hoy: pedidos por WhatsApp) |
| 8 | Responsive | Base lista (composición móvil propia) |
| 9 | Optimización y pruebas | Pendiente |

## Estructura

```
public/brand/            Logos oficiales en SVG (extraídos del .ai)
public/media/hero/       Cuadros del recorrido (placeholder/ hoy, recorrido/ después)
public/media/historia/   Foto real de Nicolas
scripts/                 Generar cuadros provisionales · convertir el video real a cuadros
src/content/             Textos y datos editables (marca, recetas, recorrido, menú)
src/animations/          GSAP, scroll suave, secuencia de cuadros, timeline del recorrido
src/components/hero/     Apertura, recorrido, índice de etapas, versión estática
src/components/sections/ Historia, Preparación
src/components/layout/   Menú, pie de página
src/hooks/               Movimiento reducido, media queries, apariciones
src/styles/              Tokens de diseño y estilos globales
docs/                    Identidad, técnica del inicio, multimedia, datos pendientes
```

## Integrar el video real del recorrido

```bash
npm run frames:video -- ruta/al/recorrido.mp4 180 120
```

Luego, en `src/content/hero.js`, cambiar `SETS.placeholder` por `SETS.recorrido`.

> Todo lo marcado como **PLACEHOLDER** o **⚠** debe reemplazarse con material real de la marca.
