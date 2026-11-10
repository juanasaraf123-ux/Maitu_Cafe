# Video del inicio con IA · guía completa

Video para el inicio de la página de Maitú Café: **8 etapas, de la mata a la taza**,
estilo cinematográfico y realista, **24 segundos en bucle**, **sin texto, sin logos,
sin voz y sin música** (la página pone el titular y el letrero de cada etapa encima, y
el video se reproduce en silencio).

> El video es **ilustrativo**: no muestra las fincas ni a los productores reales de
> Maitú. La página no lo presentará como si lo fuera.

---

## 0. Resumen de lo que hay que entregar

| | |
|---|---|
| Duración | **24 s** (8 etapas × 3 s) |
| Formato | **16:9 horizontal**, 1920×1080 o 4K |
| Cuadros por segundo | 24 o 30 fps |
| Archivo | **MP4 (H.264)** |
| Audio | **Ninguno** |
| Texto, logos, subtítulos, marca de agua | **Ninguno** |
| Opcional | Una versión **9:16 vertical** (1080×1920) para celular. Si no, yo recorto la horizontal. |

Orden y tiempos (el letrero de la página cambia exactamente en estos segundos):

| # | Etapa | Segundos |
|---|---|---|
| 01 | La mata | 0 – 3 |
| 02 | La cosecha | 3 – 6 |
| 03 | El beneficio | 6 – 9 |
| 04 | El secado | 9 – 12 |
| 05 | El grano | 12 – 15 |
| 06 | La molienda | 15 – 18 |
| 07 | El filtrado | 18 – 21 |
| 08 | Tu taza | 21 – 24 |

---

## 1. Reglas de encuadre (importantes para la página)

```
 ┌──────────────────────────────────────────────────────────┐
 │ menú de la página                                        │
 │                                                          │
 │  TITULAR DE         ░░░░░░░░░░░░░░░░░░░                  │
 │  LA PÁGINA          ░░  SUJETO PRINCIPAL ░░    01        │
 │  (zona izquierda    ░░  (centro / centro- ░░    02  índice│
 │   más oscura y      ░░   derecha)        ░░    03        │
 │   tranquila)        ░░░░░░░░░░░░░░░░░░░                  │
 │                                                          │
 │  04/08 El secado    (zona inferior tranquila)            │
 └──────────────────────────────────────────────────────────┘
```

- **Sujeto principal en el centro o un poco a la derecha.** En el celular se recorta el
  centro del video en vertical, así que lo importante debe estar en el **tercio central**.
- **Lado izquierdo y parte de abajo más oscuros y sin detalles fuertes:** ahí van el
  titular y el letrero.
- **Movimientos de cámara lentos y suaves.** Nada de cortes rápidos ni sacudidas.
- **Misma luz y misma paleta en todo el video:** tonos café, caramelo y crema; luz cálida
  de mañana; un poco de grano de película.

---

## 2. Camino A — el más rápido: un solo prompt en invideo

En invideo (inicio → caja de texto, o "Use my script"), pega el **prompt maestro**. Si
te pregunta opciones, elige: **sin voz en off, sin música, sin subtítulos, sin texto en
pantalla, 16:9, estilo cinematográfico, material generado con IA (no stock)**.

### Prompt maestro

```
Create a 24-second cinematic, photorealistic, wordless video that loops seamlessly, showing the journey of Colombian specialty coffee from the plant to the cup, in exactly 8 shots of 3 seconds each, in this order:

1. (0-3s) Extreme close-up of a coffee plant branch with ripe glossy red coffee cherries covered in morning dew, misty Andean mountains out of focus behind. Slow push-in.
2. (3-6s) A farmer's weathered hands picking ripe red cherries one by one and dropping them into a woven basket. No face visible. Slow motion.
3. (6-9s) Freshly pulped coffee beans covered in glossy mucilage being washed in a wooden channel with clear flowing water, sunlight sparkling. Slow motion.
4. (9-12s) Top-down view of parchment coffee beans drying on a raised bed under the sun, a wooden rake drawing gentle wave lines through them. Slow descent.
5. (12-15s) Macro of roasted coffee beans falling and rotating in slow motion against a dark warm background, rim light on the center crease, wisps of smoke.
6. (15-18s) Fresh medium-ground coffee pouring in a thin stream from a grinder into a paper filter, fine particles floating in a beam of warm light.
7. (18-21s) Side view of a cone pour-over dripper on a glass server: hot water poured from a gooseneck kettle in a slow spiral, the coffee bed blooms, amber coffee drips into the server, steam rising.
8. (21-24s) A handmade ceramic cup of black filtered coffee on a rustic wooden table by a window, morning light, steam curling up, coffee plants and misty mountains out of focus outside. Very slow pull-back. End calm so it loops back to shot 1.

Style for every shot: cinematic macro documentary, early morning soft golden light, shallow depth of field, warm color grade of deep coffee browns, caramel and cream, subtle film grain, 35mm anamorphic look, slow smooth camera moves, smooth dissolve transitions between shots.
Composition: keep the main subject in the center or center-right; keep the left third and the bottom area darker and calm (on-screen text will be added later by a website).
Do NOT include: any text, titles, captions, subtitles, logos, brand names, watermarks, voiceover, music, espresso machines, latte art, milk, people's faces.
Aspect ratio 16:9, 1080p or higher, 24 fps.
```

Después, en el editor de invideo, revisa cada escena (sección 5). Si alguna no te gusta,
**regenera solo esa escena** con su prompt de la sección 3.

---

## 3. Camino B — más control: los 8 clips uno por uno

Usa el generador de video de invideo (o Kling, Veo, Runway). Para cada etapa:

1. **Crea la imagen** con el prompt de *Imagen* + el **estilo base**.
2. **Anímala** (imagen → video, 5 s) con el prompt de *Movimiento*.
3. Genera 2–4 versiones y quédate con la mejor.

### Estilo base (pegar al final de TODOS los prompts)

```
Cinematic macro documentary footage, Colombian Andes coffee farm, early morning soft golden light through mist, shallow depth of field, warm color grade with deep coffee browns, caramel and cream highlights, subtle film grain, 35mm anamorphic look, slow smooth camera movement, photorealistic, 16:9, main subject centered, darker calm left side
```

### Negativo (campo "negative prompt" si existe)

```
text, letters, words, subtitles, watermark, logo, brand names, espresso machine, latte art, milk, faces, distorted hands, extra fingers, plastic look, oversaturated colors, cartoon, blurry, fast camera, shaky camera
```

### 01 · La mata (0–3 s)
- **Imagen:** `Extreme close-up of a coffee plant branch with a cluster of ripe glossy red coffee cherries covered in morning dew, dark green leaves, misty green Andean mountains softly out of focus in the background.`
- **Movimiento:** `Very slow push-in toward the ripest red cherry, dew drops glistening, leaves moving gently in the breeze, mist drifting in the background.`

### 02 · La cosecha (3–6 s)
- **Imagen:** `Close-up of a farmer's weathered hands picking ripe red coffee cherries from the branch, a woven basket at the waist half full of red cherries, coffee plants around, no face visible.`
- **Movimiento:** `The hands gently pick several red cherries one by one and drop them into the woven basket, cherries tumbling in slow motion, camera follows the hands.`

### 03 · El beneficio (6–9 s) — elige según tu proceso
- **Lavado**
  - **Imagen:** `Freshly pulped coffee beans covered in glossy mucilage inside a wooden washing channel with clear flowing water, sunlight sparkling on the water.`
  - **Movimiento:** `Clear water flows over the beans while a wooden paddle stirs them slowly, bubbles and light reflections, slow motion.`
- **Honey**
  - **Imagen:** `Coffee beans still coated in sticky golden honey-like mucilage spread on a drying bed, glossy amber texture, warm sunlight.`
  - **Movimiento:** `Slow macro glide over the sticky golden beans, light glinting on the glossy mucilage.`
- **Natural**
  - **Imagen:** `Whole ripe red coffee cherries drying under the sun on a raised bed, some turning deep burgundy and wrinkled.`
  - **Movimiento:** `Slow top-down drift over the drying cherries, warm sunlight and soft leaf shadows moving across them.`

### 04 · El secado (9–12 s)
- **Imagen:** `Top-down view of parchment coffee beans spread evenly on a raised drying bed under a greenhouse roof, warm sunlight, soft shadows of leaves.`
- **Movimiento:** `Slow top-down descent while a wooden rake draws gentle wave-like lines through the drying beans.`

### 05 · El grano (12–15 s)
- **Imagen:** `Macro shot of roasted coffee beans falling in slow motion against a dark warm background, rim light highlighting the center crease of each bean, a few wisps of smoke.`
- **Movimiento:** `Roasted coffee beans fall and rotate in slow motion toward the camera, rim light gleaming, wisps of smoke curling.`

### 06 · La molienda (15–18 s)
- **Imagen:** `Fresh medium-ground coffee pouring in a thin stream from a grinder chute into a paper filter, fine coffee particles floating in a beam of warm light, dark background.`
- **Movimiento:** `Ground coffee pours in slow motion forming a small mound, tiny particles float and sparkle in the light, camera slowly tilts down.`

### 07 · El filtrado (18–21 s)
- **Imagen:** `Side view of a cone pour-over dripper with a paper filter full of ground coffee on top of a glass server, a gooseneck kettle pouring hot water, warm window light, wooden counter.`
- **Movimiento:** `Hot water pours from the gooseneck kettle in a slow spiral, the coffee bed blooms and bubbles, amber coffee drips steadily into the glass server, steam rising, slow motion.`

### 08 · Tu taza (21–24 s)
- **Imagen:** `A handmade ceramic coffee cup filled with black filtered coffee on a rustic wooden table next to a window, morning light, steam curling up, coffee plants and misty mountains out of focus outside.`
- **Movimiento:** `Steam curls slowly from the cup, sunlight shifts gently across the table, very slow pull-back revealing the warm, cozy scene, calm ending.`

### Transiciones "mágicas" (opcional)

Si la herramienta acepta **imagen inicial + imagen final** (Kling, y otros modelos en
invideo), genera un clip corto de 1–2 s entre etapas vecinas, con la última imagen de una
etapa como inicio y la primera de la siguiente como final. Prompts:

| De → a | Prompt de transición |
|---|---|
| 01 → 02 | `Camera pulls back from the red cherry to reveal hands reaching in to pick it, seamless continuous shot.` |
| 02 → 03 | `The red cherries in the basket dissolve into flowing water and wet pulped beans, seamless morph.` |
| 03 → 04 | `Water drains away and the wet beans spread out on a sunny drying bed, seamless morph.` |
| 04 → 05 | `Camera dives into a single drying bean that darkens into a roasted bean against a dark background, seamless morph.` |
| 05 → 06 | `The falling roasted beans pour into a grinder and turn into a stream of ground coffee, seamless morph.` |
| 06 → 07 | `The ground coffee settles in a paper filter as a kettle begins to pour water, seamless continuous shot.` |
| 07 → 08 | `The coffee from the glass server is poured into a ceramic cup on a wooden table, seamless continuous shot.` |
| 08 → 01 | `Steam from the cup drifts and becomes morning mist over a coffee plant with red cherries, seamless morph.` *(para que el bucle no se note)* |

---

## 4. Consejos para que todo parezca una sola película

- Usa **el mismo modelo** para todos los clips.
- Pega **el mismo estilo base** al final de cada prompt, sin cambiarlo.
- Si la herramienta tiene **imagen de referencia de estilo**, usa la mejor imagen del
  clip 1 como referencia para los demás.
- Prefiere los resultados con **luz cálida y lateral**; descarta los muy azules,
  saturados o planos.
- Revisa **las manos** del clip 2 (que no tengan dedos de más) y que no aparezcan
  **letras o logos** inventados en bolsas, etiquetas o máquinas.

---

## 5. Montaje (en el editor de invideo o en CapCut)

1. Proyecto **16:9**, **30 fps** (o 24).
2. Pon los clips en orden y recorta cada uno a **exactamente 3,0 s**. Si usaste
   transiciones mágicas, súmalas dentro de esos 3 s.
3. Entre clips sin transición mágica: **disolver de 0,3–0,5 s**.
4. Si los colores cambian mucho entre clips, aplica a todos **el mismo filtro cálido**
   (más temperatura, un poco menos de saturación, sombras levemente levantadas).
5. **Quita todo el audio** y no agregues texto ni música.
6. Revisa el bucle: el final del clip 8 debe ser tranquilo (vapor, luz) para que el
   salto al clip 1 no se note.
7. Exporta **MP4, 1080p o 4K, 24/30 fps**.

Si puedes, exporta también una versión **9:16** con el sujeto centrado (para celular).

---

## 6. Lista de revisión antes de enviarlo

- [ ] Dura 24 s (± 1 s) y las 8 etapas están en orden.
- [ ] Cada etapa cambia cerca de los segundos 3, 6, 9, 12, 15, 18 y 21.
- [ ] Sin texto, letras, logos, marcas de agua ni subtítulos.
- [ ] Sin máquinas de espresso, latte art ni leche.
- [ ] Manos y objetos se ven naturales.
- [ ] Lado izquierdo y parte de abajo sin detalles fuertes.
- [ ] Sin audio.
- [ ] El salto del final al inicio se ve suave.

## 7. Enviármelo

Adjunta el MP4 (y el vertical, si lo hiciste) aquí en el chat. Yo:
1. lo optimizo para la web, en versión de computador y de celular y liviano;
2. ajusto el segundo exacto de cada letrero si tus tiempos quedaron distintos;
3. reviso que el titular se lea bien en cada escena;
4. reemplazo el video provisional y te muestro el resultado.
