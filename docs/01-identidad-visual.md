# Etapa 1 · Identidad visual y diseño conceptual

> Estado: **propuesta para aprobación**. Todo lo marcado con `⚠ PROVISIONAL` debe ser
> confirmado o reemplazado por la marca antes de producción.

## 1. Concepto rector

**"Del origen a tu taza"** — la web es una película que el visitante dirige con el scroll.
No es una cafetería ni un catálogo: es un recorrido documental, pausado y sensorial, desde
la cereza en la montaña del Tolima hasta el café filtrado servido en casa.

Tres actos, que ordenan tanto el hero como la arquitectura de la página:

| Acto | Qué transmite | Sensación visual | Secciones |
|------|---------------|------------------|-----------|
| **I. Origen** | Montaña, finca, productores | Verde bosque, luz de neblina, sombra | Escenas 1–2, Historia y origen |
| **II. Proceso** | Transformación del fruto | Tierra, pergamino, luz cálida de secado | Escenas 3–5, Conoce el proceso |
| **III. Experiencia** | Molienda, filtrado, la taza | Crema, cerámica, vapor, café oscuro | Escenas 6–8, Preparación, Cafés, Tienda |

La página "se aclara" a medida que avanza: empieza en verdes profundos (bosque, noche,
origen) y termina en cremas cálidos (mesa, mañana, taza). Este degradado narrativo es la
firma visual de la marca.

## 2. Principios de diseño

1. **Cine antes que web.** Encuadres a pantalla completa, velos oscuros para leer texto,
   cortes con intención (match cuts, zoom, barridos de luz), nunca carruseles.
2. **Editorial de lujo.** Mucho aire, textos cortos, una idea por pantalla, jerarquía
   tipográfica marcada, líneas finas doradas como detalle.
3. **Autenticidad verificable.** Ningún dato de origen, variedad, proceso o productor se
   inventa: todo vive en archivos de contenido editables (`src/content/*`) con campos
   vacíos o marcados como provisionales.
4. **Movimiento con propósito.** El movimiento cuenta la historia (acercarse, recoger,
   transformar). Nada rebota, nada gira sin razón. Curvas suaves (expo/power3).
5. **Rendimiento como estética.** Una experiencia que tarda en cargar no es premium.

## 3. Paleta de color

| Token | Hex | Rol |
|-------|-----|-----|
| `--c-bosque-900` | `#1B261E` | Fondo oscuro principal (hero, navegación sobre video) |
| `--c-bosque-800` | `#24332A` | Superficies oscuras secundarias |
| `--c-bosque-300` | `#A8B3A0` | Texto secundario sobre oscuro |
| `--c-tueste-900` | `#2B1E17` | Texto principal sobre claro, fondos de la sección Experiencia |
| `--c-tueste-500` | `#5C4A3D` | Texto secundario sobre claro |
| `--c-crema-100` | `#F3ECDF` | Fondo claro principal, texto sobre oscuro |
| `--c-beige-300` | `#D9C9AE` | Superficies, tarjetas, separadores |
| `--c-tierra-500` | `#9C6B45` | Detalles decorativos, ilustraciones (no texto pequeño) |
| `--c-oro-400` | `#B8975A` | Dorado discreto: líneas, iconos, estados activos sobre oscuro |
| `--c-oro-700` | `#7E6034` | Dorado para texto sobre claro |
| `--c-cereza-600` | `#7A3326` | Acento puntual (precio en oferta, badge “Agotado”, cereza) |

**Contraste verificado (WCAG 2.1):**

| Combinación | Ratio | Uso permitido |
|-------------|-------|---------------|
| Crema sobre bosque-900 | 13.3 : 1 | Todo texto |
| Beige-300 sobre bosque-900 | 9.6 : 1 | Todo texto |
| Bosque-300 sobre bosque-900 | 7.2 : 1 | Texto secundario |
| Oro-400 sobre bosque-900 | 5.7 : 1 | Texto y botones |
| Tueste-900 sobre crema | 13.7 : 1 | Todo texto |
| Tueste-500 sobre crema | 7.1 : 1 | Texto secundario |
| Cereza-600 sobre crema | 7.7 : 1 | Texto de acento |
| Tierra-500 sobre crema | 3.9 : 1 | **Solo** texto ≥ 24px o decoración |

Regla de proporción por pantalla: **70 % fondo (bosque o crema) · 20 % tierra/beige · 8 % texto
y fotografía · 2 % dorado/cereza.**

## 4. Tipografía

| Rol | Familia | Por qué |
|-----|---------|---------|
| Títulos, frases del hero, citas | **Cormorant Garamond** (300/400/500 + itálica) | Serif de alto contraste, editorial y elegante; su itálica da un tono manuscrito, de oficio. |
| Texto, navegación, botones, fichas | **Manrope** (400/500/600) | Sans geométrica-humanista, muy legible en móvil, cifras claras para precios y pesos. |

Ambas son open source (OFL). En la Etapa 2 se **autoalojan** con `@fontsource` (sin
dependencia de Google Fonts, mejor rendimiento y privacidad), con `font-display: swap` y
precarga solo de los pesos usados en el hero.

Jerarquía:

- **Display** (hero): Cormorant 300, mayúsculas, `clamp(2.75rem → 7rem)`, tracking −1.5 %.
- **H1/H2**: Cormorant 400, caja mixta; palabras clave en *itálica*.
- **Eyebrow** (antetítulo): Manrope 600, 12px, mayúsculas, tracking 0.22em, dorado.
- **Cuerpo**: Manrope 400, 16–17px, interlineado 1.65, máx. 62 caracteres por línea.
- **Datos** (precio, peso, altitud): Manrope 500 con cifras tabulares.

> ⚠ PROVISIONAL: si la marca ya tiene tipografías corporativas, se sustituyen en
> `src/styles/tokens.css` (`--font-serif`, `--font-sans`) sin tocar componentes.

## 5. Logotipo

`design/logo-provisional.svg` es un **logotipo provisional** (cereza con surco + palabra
"MAITU") creado solo para maquetar. **Se necesita el logotipo oficial en SVG** (versión
horizontal, símbolo solo, y monocromo claro/oscuro). La animación de entrada del hero
dibujará los trazos del símbolo (`stroke-dashoffset`), por lo que el SVG oficial debe
entregarse con trazos o formas limpias, sin texto rasterizado.

## 6. Dirección fotográfica y de video

- **Luz:** natural, lateral, horas doradas o neblina de montaña. Sombras profundas,
  nunca flash ni luz plana.
- **Grade:** verdes desaturados hacia oliva, rojos de cereza profundos (no saturados),
  negros levantados ligeramente (look fílmico), grano sutil.
- **Encuadre:** macro y detalle (textura de la cereza, manos, granos), alternado con
  planos generales del paisaje. Personas con consentimiento y nombre real (si se nombran).
- **Prohibido como protagonista:** máquinas de espresso, cafeteras industriales, barras de
  cafetería, tazas con latte art, imágenes de stock presentadas como propias.
- **Mientras no exista material real**, la web usa *placeholders* tonales con la etiqueta
  visible "PLACEHOLDER — Escena X" (nunca fotos de stock disfrazadas de la marca).

## 7. Voz y tono

Sereno, cercano, preciso. Frases cortas, verbos sensoriales, sin superlativos vacíos
("el mejor café del mundo") ni afirmaciones no verificables ("orgánico", "comercio justo",
"puntaje SCA 86") salvo que la marca las documente.

## 8. Componentes base (definidos en la styleguide)

- **Botón primario:** píldora, fondo crema sobre oscuro / tueste sobre claro, Manrope 600,
  flecha que se desplaza 4px al hover.
- **Botón secundario:** contorno fino 1px dorado, texto crema.
- **Enlace editorial:** subrayado fino que crece de izquierda a derecha.
- **Eyebrow + número de capítulo:** `01 — El origen`, guía la narrativa en toda la página.
- **Etiqueta de placeholder:** franja punteada con texto en mayúsculas, imposible de
  confundir con contenido final.

Se pueden ver en vivo en `design/styleguide.html`.

## 9. Principios de movimiento

| Tipo | Duración | Curva | Ejemplo |
|------|----------|-------|---------|
| Micro (hover, foco) | 180 ms | `power2.out` | Botones, enlaces |
| Entrada de texto | 900 ms, stagger 60–90 ms | `expo.out` | Líneas del titular suben desde una máscara |
| Transición de escena (scroll) | Vinculada al scroll (`scrub: 1`) | `none`/`power2.inOut` | Zoom, barridos, máscaras |
| Cinematográfica (intro) | 1.2 – 1.6 s | `power3.inOut` | Logo, primer fundido del video |

Con `prefers-reduced-motion: reduce`: sin pin ni scrub, sin parallax, sin 3D animado; las
escenas se muestran como una secuencia vertical con fundidos simples de opacidad.
