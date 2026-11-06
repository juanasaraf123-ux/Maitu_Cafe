# Propuesta visual y técnica · Inicio cinematográfico

## 1. Experiencia en dos tiempos

### Tiempo A — Apertura (automática, ~4 s, sin scroll)

| t | Qué ocurre | Técnica |
|---|------------|---------|
| 0.0 s | Pantalla bosque-900 limpia, grano fílmico sutil. Se precargan el póster y el primer video. | Loader CSS puro (no espera a todo, solo al póster de la escena 1) |
| 0.3 s | El símbolo del logo se **dibuja** trazo a trazo; aparece la palabra con tracking que se cierra. | SVG `stroke-dashoffset` + GSAP timeline |
| 1.6 s | El logo sube y se reduce hacia su posición en la navegación (continuidad, no desaparece). | GSAP Flip-like (`getBoundingClientRect` → `x/y/scale`) |
| 1.8 s | El video de la cereza aparece en fundido desde negro con un leve zoom 1.08 → 1. | `<video>` + GSAP `opacity/scale` |
| 2.4 s | **"TODO COMIENZA / MUCHO ANTES / DEL PRIMER SORBO"** línea por línea desde una máscara. | GSAP SplitText (`lines` + `mask`) |
| 3.6 s | Invitación: botón **"Descubrir el recorrido"** + indicador de scroll animado. El botón hace scroll real a la escena 2. | GSAP ScrollTo |

El visitante puede hacer scroll en cualquier momento: la apertura se completa instantáneamente
(`timeline.progress(1)`) para no bloquearle. Se recuerda en `sessionStorage` para no repetir
el logo largo en recargas.

### Tiempo B — La película controlada por scroll (8 escenas)

Un contenedor `HeroFilm` se **fija** (`pin: true`) a pantalla completa durante
~700 % de alto de viewport (escritorio) / ~500 % (móvil). Un único **timeline maestro**
de GSAP, enlazado a ScrollTrigger con `scrub`, orquesta todas las capas. Cada escena
es una capa absoluta (video + velo + texto) y el timeline solo anima `transform`,
`opacity` y `clip-path` (propiedades baratas para la GPU).

| # | Escena | Contenido visual | Transición de entrada | Texto (⚠ copy provisional) |
|---|--------|------------------|------------------------|-----------------------------|
| 01 | **El origen** | Cereza madura en la planta, hojas, rocío | (Apertura) — durante el scroll la cámara se **acerca** lentamente (scale 1 → 1.35) | "Todo comienza mucho antes del primer sorbo" |
| 02 | **La recolección** | Manos recogiendo cerezas maduras | **Match cut circular**: un círculo se abre desde el centro de la cereza (`clip-path: circle()`) revelando las manos | "Cereza por cereza, a mano" |
| 03 | **La transformación** | Beneficio según el método real (lavado, honey, natural… ⚠ por confirmar) | **Desplazamiento horizontal**: la escena 2 sale a la izquierda, la 3 entra; el texto con parallax a distinta velocidad | "Cada café pide su propio proceso" |
| 04 | **El secado** | Café en camas/patios de secado al sol | **Barrido de luz vertical** (`clip-path: inset()` de abajo hacia arriba) + velo cálido | "El sol y el tiempo hacen su parte" |
| 05 | **El grano** | Granos seleccionados, trillado/selección | **Zoom-out** desde el patio de secado; aparece el **grano 3D** que gira con el scroll (momento 3D principal) | "Seleccionado grano a grano" |
| 06 | **La molienda** | Molino manual/eléctrico, café molido cayendo | El grano 3D "cae" y se funde con el video del molino (`opacity` + `y`) | "Del grano al molido, justo antes de preparar" |
| 07 | **El filtrado** | Café molido, agua caliente vertida, extracción, gotas cayendo | **Secuencia de fotogramas controlada por scroll** (canvas): el usuario literalmente "vierte" el agua con el scroll | "Agua, tiempo y paciencia" |
| 08 | **El resultado** | Taza servida en ambiente cálido y natural | Fundido a tonos crema; titular final letra por letra | **"DEL ORIGEN A TU TAZA"** + CTA "Conocer nuestros cafés" / "Nuestra historia" |

Elementos persistentes durante la película:

- **Índice de capítulos** (lateral en escritorio, barra inferior en móvil): `01 … 08` con
  el nombre de la escena activa; **cada número es clicable** y desplaza al punto exacto
  del timeline (`scrollTrigger.labelToScroll`).
- **Barra de progreso** fina dorada.
- **Botón "Saltar recorrido"** (accesibilidad y usuarios recurrentes): lleva a la sección
  Historia.

## 2. Por qué esta técnica (decisiones clave)

**Videos en bucle + transiciones por scroll (no "scrub" de video en todas las escenas).**
Hacer *scrubbing* de `video.currentTime` en 8 videos es inestable (saltos en Safari/iOS,
decodificación costosa, archivos enormes con keyframes en cada cuadro). Por eso:

- Cada escena reproduce un **clip corto en bucle (4–8 s)**, silenciado, `playsinline`.
- El **scroll controla la cámara y los cortes** (zoom, máscaras, desplazamientos, textos).
- Solo se reproduce el video de la escena visible (y se precarga la siguiente); el resto
  está pausado con `preload="none"` → memoria y batería bajo control.
- El único momento de *scrub* real es el **filtrado (escena 7)**, resuelto con una
  **secuencia de imágenes WebP/AVIF en `<canvas>`** (técnica tipo "Apple product page"),
  que es fluida en todos los navegadores.

**Un solo timeline maestro** (y no un ScrollTrigger por escena) garantiza que las
transiciones se encadenen sin saltos, se puedan etiquetar (`addLabel`) y navegar desde el
índice.

**Lenis (scroll suave)** — biblioteca adicional de ~4 KB, sincronizada con el ticker de
GSAP. Aporta la sensación de "película" en rueda de ratón y trackpad. Se desactiva en
táctil nativo y con movimiento reducido.

## 3. Arquitectura React prevista (Etapas 2–5)

```
src/
  components/hero/
    HeroIntro.jsx          # Apertura: logo, primer video, titular, CTA
    HeroFilm.jsx           # Contenedor fijado + timeline maestro
    FilmScene.jsx          # Capa genérica: video/póster + velo + texto
    FrameSequence.jsx      # Canvas con secuencia de imágenes (escena 7)
    ChapterIndex.jsx       # Índice 01–08 clicable + barra de progreso
    SceneVideo.jsx         # <video> con fuente responsive, play/pause por visibilidad
  components/three/
    BeanCanvas.jsx         # Canvas R3F (carga diferida)
    CoffeeBean.jsx         # Malla del grano (procedural o GLB Draco)
    CoffeeCherry.jsx       # Cereza 3D (uso secundario)
  animations/
    heroTimeline.js        # Construcción del timeline maestro (separado de la UI)
    transitions.js         # Transiciones reutilizables: circleReveal, panX, lightWipe, zoomOut
    textReveal.js          # SplitText con máscara
  content/
    hero.js                # Textos, rutas de medios y orden de escenas (editable)
  hooks/
    useReducedMotion.js
    useDeviceProfile.js    # móvil/escritorio, WebGL, memoria, conexión
  config/
    media.js               # Breakpoints de video, CDN, formatos
```

La lógica de animación vive en `animations/` (funciones puras que reciben refs),
separada de los componentes. Los contenidos y rutas de medios viven en `content/hero.js`:
reemplazar un video o un texto **no requiere tocar componentes**.

## 4. Experiencia 3D (Etapa 5)

- **Momento principal:** escena 5 → 6. Un **grano de café 3D** emerge del patio de
  secado, gira lentamente vinculado al scroll mostrando su surco, y "cae" hacia el molino.
- **Momento secundario (opcional):** cereza 3D en la sección Historia o en el loader.
- **Modelado:** el grano se genera de forma procedural (geometría deformada + surco por
  shader/desplazamiento) para pesar ~0 KB, o se reemplaza por un **GLB con compresión
  Draco y texturas KTX2 (< 400 KB)** si se encarga a un artista 3D.
- **Iluminación:** `Environment` HDRI pequeño (estudio cálido, 256 px), luz principal
  lateral cálida, *rim light* verde sutil; material `MeshPhysicalMaterial` con
  `clearcoat` bajo y mapa de rugosidad.
- **Rendimiento:** el canvas se monta con `React.lazy` solo al acercarse a la escena 5,
  `frameloop="demand"`, `dpr={[1, 1.75]}`, y se desmonta al salir.
- **Alternativa:** sin WebGL, en equipos de baja memoria (`navigator.deviceMemory < 4`),
  con ahorro de datos o movimiento reducido → imagen AVIF del grano con el mismo
  movimiento hecho en CSS/GSAP 2D.

## 5. Versión móvil (composición propia, no reducción)

- **Videos verticales 9:16** con encuadre propio (no recorte automático del 16:9).
- Pin más corto (~500 vh), transiciones simplificadas: la horizontal se convierte en
  vertical; el círculo nace del centro inferior (zona del pulgar).
- Textos más cortos, una línea de 2–4 palabras por escena.
- Índice de capítulos como barra inferior delgada; CTA en zona alcanzable.
- 3D solo en dispositivos capaces; la secuencia de fotogramas usa la mitad de cuadros.
- Se respeta `100svh` para evitar saltos con la barra de direcciones de iOS/Android.

## 6. Accesibilidad y movimiento reducido

- Videos decorativos con `aria-hidden`; el texto de cada escena es HTML real (indexable
  y legible por lectores de pantalla), en orden lógico.
- Botón de **pausa de video** visible (WCAG 2.2.2).
- `prefers-reduced-motion`: sin pin/scrub/Lenis/3D; escenas apiladas con pósters estáticos.
- Navegación completa por teclado, foco visible dorado, "Saltar recorrido".

## 7. Presupuesto de rendimiento (objetivos)

| Métrica | Objetivo |
|---------|----------|
| LCP (póster de la escena 1) | < 2.0 s en 4G |
| JS inicial (gzip) | < 120 KB (Three.js en chunk diferido) |
| Peso primer pantallazo | < 600 KB (póster AVIF + JS + fuentes) |
| Cada clip de escena | Escritorio ≤ 2.5 MB · Móvil ≤ 1.2 MB |
| Secuencia de filtrado | ≤ 3 MB total escritorio / ≤ 1.5 MB móvil |
| CLS | < 0.05 |
| FPS durante el scroll | 60 fps en portátil medio, ≥ 50 en móvil medio |
