# Inicio · video a pantalla completa (versión 3.1)

> **3.1:** la página sigue la estructura de la referencia que eligió la marca (video
> "Follow the first drop"): titular en mayúsculas a la izquierda, índice vertical
> 01–08 a la derecha, indicador para bajar, y debajo secciones crema que alternan texto
> e imagen (Nuestra historia → El proceso → Nuestros cafés → Preparación) con un pie
> de página de cuatro columnas.

> Historial: v1 eran clips con cortes; v2, un recorrido fijo controlado por el
> scroll. **v3 (actual, pedida por la marca):** el video se reproduce solo, a
> pantalla completa, sin tener que hacer scroll. El visitante no se pierde: la
> página se desplaza con normalidad.

## 1. La experiencia

1. **Apertura** (`HeroIntro`): pantalla café, el logo blanco se revela y la cortina
   sube. Se salta con clic, tecla o scroll. En visitas siguientes dura ~1 s.
2. **Inicio** (`HeroVideo`):
   - Video a pantalla completa, en bucle y sin sonido, que se reproduce solo.
     Llena la pantalla sin deformarse (`object-fit: cover`) y tiene una versión vertical
     para el celular.
   - A la izquierda: "Maitú Café · by Nicolas Bernal", el titular **DEL ORIGEN / A TU
     TAZA.** (segunda línea en caramelo), una frase, el botón *Conoce nuestros cafés* y
     el control circular *Pausar video / Ver el recorrido*.
   - A la derecha: índice vertical 01–08; cada número salta a esa etapa del video.
   - Abajo al centro: indicador para bajar (lleva a Nuestra historia).
   - **Abajo a la izquierda, el letrero de la etapa** que se está viendo, como en la
     referencia de la marca: "04 / 08 · El recorrido", la etapa en grande
     ("El secado."), una frase corta y 8 barritas que se llenan con el video.
3. Al bajar se ve **Nuestra historia**, **El proceso**, **Nuestros cafés**,
   **Preparación** y el pie de página con el contacto. El video se
   pausa cuando sale de la pantalla y se reanuda al volver.

| # | Etapa | Frase del letrero | Empieza en (video provisional) |
|---|---|---|---|
| 01 | La mata | Donde todo comienza, en la finca. | 0 s |
| 02 | La cosecha | La cereza madura se coge a mano. | 2 s |
| 03 | El beneficio | Cada café tiene su propio proceso. | 4 s |
| 04 | El secado | El sol y el tiempo hacen su parte. | 6 s |
| 05 | El grano | Lo esencial del fruto. | 8 s |
| 06 | La molienda | 25 g · molienda media. (receta del empaque) | 10 s |
| 07 | El filtrado | 380 ml de agua · 3:30 min. (receta del empaque) | 12 s |
| 08 | Tu taza | Del origen a tu taza. | 14 s |

Todo se edita en `src/content/hero.js`. `start` es el segundo del video en que cambia
el letrero.

## 2. Técnica

- `<video autoplay muted loop playsinline>`: los navegadores permiten la reproducción
  automática solo si el video no tiene sonido.
- El letrero se sincroniza leyendo `video.currentTime` en cada cuadro de animación
  (`requestAnimationFrame`) mientras el video corre. El texto cambia con una máscara
  (GSAP) y las barras se llenan con `transform: scaleX`, que es barato para la GPU.
- `IntersectionObserver` pausa el video fuera de pantalla (ahorra batería y datos).
- **Movimiento reducido:** no hay apertura y el video no arranca solo; queda el póster
  con el botón Reproducir.

## 3. El video con inteligencia artificial

Hoy se usa un video **provisional** (`npm run video:placeholder`, 16 s, 460 KB) con la
etiqueta "PLACEHOLDER".

Recomendaciones para el video final:

- 8 clips cortos (2–4 s cada uno), uno por etapa, con la misma luz y paleta, unidos
  con fundidos. Total: 16–30 s, en bucle.
- Formato horizontal 16:9 (4K o 1080p) con el centro despejado, para recortar la
  versión vertical. Sin texto ni logos dentro del video: los pone la página.
- Zona central y abajo a la izquierda más oscura o tranquila: ahí van el logo y el
  letrero.
- Sin máquinas de espresso; el filtrado es manual (gotero cónico).

Para integrarlo:

```bash
npm run video:optimize -- ruta/al/video.mp4
```

Luego, en `src/content/hero.js`: `heroVideo = VIDEOS.recorrido` y ajustar el `start`
de cada etapa a los segundos reales del video.

## 4. Pendiente

- Selector de procesos (lavado, honey, natural…) en la sección "El proceso" (Etapa 6).
- Elemento 3D (grano de café) en la sección de proceso o de cafés (Etapa 5).
