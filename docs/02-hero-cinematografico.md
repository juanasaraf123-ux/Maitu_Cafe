# Inicio cinematográfico · cómo funciona (versión 2)

> Cambio respecto a la primera propuesta: después de ver las referencias de la
> marca se reemplazaron los clips en bucle con cortes por **una sola toma continua
> controlada por el scroll**, como en esas referencias.

## 1. La experiencia

1. **Apertura** (`HeroIntro`): pantalla café, el logo blanco se revela de izquierda a
   derecha y la cortina sube. Se salta con clic, tecla o scroll. En visitas siguientes
   dura ~1 s (`sessionStorage`).
2. **Titular**: "Todo comienza / *mucho antes* / del primer sorbo." entra línea por
   línea, con el botón **Descubrir el recorrido**, que lleva a la etapa 02.
3. **Recorrido** (`HeroFilm`): la pantalla se fija y el scroll hace avanzar o
   retroceder un video continuo, desde la mata hasta la taza:

| # | Etapa | Texto en pantalla | Datos |
|---|---|---|---|
| 01 | La mata | Titular principal | — |
| 02 | La cosecha | Cereza por cereza, se recoge solo el fruto maduro. | — |
| 03 | El beneficio | El fruto se transforma según lo que cada café necesita. | ⚠ Proceso real por confirmar |
| 04 | El secado | El sol y el tiempo hacen su parte. | — |
| 05 | El grano | Del fruto queda lo esencial: el grano. | — |
| 06 | La molienda | Justo antes de preparar, para no perder el aroma. | 25 g · molienda media (empaque) |
| 07 | El filtrado | Agua, tiempo y paciencia. | **En vivo**: 0 → 380 ml y 0:00 → 3:30 (receta del empaque) |
| 08 | Tu taza | Del origen a tu taza. | Botones: Nuestra historia · Pedir por WhatsApp |

Textos editables en `src/content/hero.js`. Son textos de la web, no datos técnicos.

4. Al terminar, la página se suelta y continúa con **Nuestra historia**,
   **Preparación** y **Contacto**.

Siempre visibles durante el recorrido: índice 01–08 en el que se puede hacer clic
(en móvil, contador compacto), barra de progreso azul y el aviso de animación
provisional mientras no exista el video real.

## 2. Técnica

**Secuencia de imágenes en `<canvas>`** (`src/animations/frameSequence.js`). El video
se convierte en cuadros WebP y se dibuja el cuadro que corresponde al scroll. Es más
fluido que mover un `<video>` con el scroll, sobre todo en iPhone.

- Carga progresiva: primero el cuadro 1; después uno de cada 8, de cada 4, de cada 2 y
  el resto. Si el usuario baja rápido, se dibuja el cuadro cargado más cercano.
- Ajuste tipo *cover*: llena la pantalla sin deformarse; en móvil recorta al centro.
- Resolución limitada a 2× para no gastar memoria.

**Un solo timeline de GSAP** (`src/animations/heroTimeline.js`) con ScrollTrigger
(`pin` + `scrub: 0.8`). Una unidad de tiempo equivale a un capítulo y anima a la vez:
cuadro del video, acercamiento sutil de cámara, textos (máscaras de línea),
datos en vivo y barra de progreso. Cada capítulo tiene la etiqueta `ch-N`, que usa el
índice para saltar.

**Lenis** (scroll suave) sincronizado con el reloj de GSAP; desactivado con
*reducir movimiento*.

## 3. El video del recorrido

Es lo único que falta para que el inicio sea el definitivo. Hoy se usan 96 cuadros
**provisionales** (`npm run frames:placeholder`), marcados con la etiqueta
"PLACEHOLDER".

Requisitos del video final:

- Una sola toma continua (o tomas unidas sin cortes visibles) que pase por las 8 etapas.
- 10–20 s, 24–30 fps, 4K o 1080p, sin audio.
- Encuadre con aire en el centro, para poder recortar la versión vertical del móvil.
- Zona izquierda e inferior más tranquila: ahí va el texto.

Para integrarlo:

```bash
npm run frames:video -- ruta/al/recorrido.mp4 180 120
```

Después, en `src/content/hero.js`, cambiar `heroFrames = SETS.placeholder` por
`SETS.recorrido`. Los cuadros de escritorio pesan ~25–40 KB cada uno (≈5–7 MB en total,
cargados de forma progresiva).

## 4. Pendiente (Etapas 4–5)

- Transiciones de color entre capítulos sincronizadas con el video real.
- Elemento 3D (grano de café con React Three Fiber) en la transición grano → molienda,
  con alternativa 2D para equipos sin WebGL.
