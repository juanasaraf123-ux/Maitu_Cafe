# Video del inicio con inteligencia artificial · guía de producción

Un video de **~24 segundos en bucle**, en **8 clips de 3 s**, uno por etapa:

| # | Etapa | Segundos en el video final |
|---|---|---|
| 01 | La mata | 0 – 3 |
| 02 | La cosecha | 3 – 6 |
| 03 | El beneficio | 6 – 9 |
| 04 | El secado | 9 – 12 |
| 05 | El grano | 12 – 15 |
| 06 | La molienda | 15 – 18 |
| 07 | El filtrado | 18 – 21 |
| 08 | Tu taza | 21 – 24 |

El letrero de la página ("04 / 08 · El secado") cambia en esos segundos. Si el video final
dura distinto, se ajusta en `src/content/hero.js`.

> El video es **ilustrativo**: no muestra las fincas ni a los productores reales de
> Maitú, y la página no lo presentará como si lo fuera.

---

## 1. Herramientas

Cualquiera de estas sirve; todas tienen plan gratis o de prueba:

| Herramienta | Por qué |
|---|---|
| **Kling AI** (klingai.com) | Muy realista. Permite **imagen inicial y final**: ideal para transiciones suaves entre etapas. |
| **Google Veo** (Gemini / Flow) | Muy buena calidad y movimiento natural. |
| **Runway** (runwayml.com) | Buen control de cámara. |
| **Hailuo / MiniMax**, **Luma** | Alternativas rápidas. |

**Recomendación:** Kling, con el método *imagen → video*.

## 2. Método para que los 8 clips parezcan una sola película

1. **Primero crea una imagen fija por etapa** con el mismo "estilo base" (sección 3), en
   cualquier generador de imágenes (ChatGPT, Gemini, Midjourney, Ideogram, o el de Kling).
   Elige la mejor de cada etapa.
2. **Anima cada imagen** con su prompt de movimiento (sección 4), en clips de 5 s.
3. **Transiciones mágicas** (opcional, como en tu referencia): en Kling, usa la imagen de la
   etapa 4 como *inicio* y la de la etapa 5 como *final*, y así entre etapas vecinas. La IA
   crea el paso de una a otra.
4. **Une todo** en CapCut (gratis, sección 5).

Consejos:
- Escribe los prompts **en inglés**: las herramientas responden mejor.
- Siempre **16:9 horizontal**, 1080p o más.
- Deja el **centro de la imagen** con lo importante: en el celular se recorta en vertical.
- Deja la **zona izquierda y la de abajo** más tranquilas: ahí van el titular y el letrero.
- Genera 2–4 versiones de cada clip y quédate con la mejor.

## 3. Estilo base (pegar al final de TODOS los prompts)

```
Cinematic macro documentary footage, Colombian Andes coffee farm, early morning soft golden light through mist, shallow depth of field, warm color grade with deep coffee browns, caramel and cream highlights, subtle film grain, 35mm anamorphic look, slow smooth camera movement, photorealistic, 16:9
```

**Lo que NO queremos** (campo *negative prompt*, si la herramienta lo tiene):

```
espresso machine, latte art, milk, text, letters, watermark, logo, brand names, distorted hands, extra fingers, plastic look, oversaturated colors, cartoon, blurry
```

## 4. Los 8 clips

Cada clip: primero el prompt de **imagen** y luego el de **movimiento**.

### 01 · La mata
- **Imagen:** `Extreme close-up of a coffee plant branch with a cluster of ripe glossy red coffee cherries covered in morning dew, dark green leaves, misty green mountains softly out of focus in the background.`
- **Movimiento:** `Very slow push-in toward the ripest red cherry, dew drops glistening, leaves moving gently in the breeze, mist drifting in the background.`

### 02 · La cosecha
- **Imagen:** `Close-up of a farmer's weathered hands picking ripe red coffee cherries from the branch, a woven basket at the waist half full of red cherries, coffee plants around, no face visible.`
- **Movimiento:** `The hands gently pick several red cherries one by one and drop them into the woven basket, cherries tumbling in slow motion, camera follows the hands.`

### 03 · El beneficio (lavado)
- **Imagen:** `Freshly pulped coffee beans covered in glossy mucilage inside a wooden washing channel with clear flowing water, sunlight sparkling on the water surface.`
- **Movimiento:** `Clear water flows over the beans while a wooden paddle stirs them slowly, bubbles and light reflections, slow motion, camera slowly moves along the channel.`

> Si tu café es *honey* o *natural*, avísame y cambio este clip: honey = granos con miel
> secándose; natural = cerezas enteras secándose al sol.

### 04 · El secado
- **Imagen:** `Top-down view of parchment coffee beans spread evenly on a raised drying bed under a greenhouse roof, warm sunlight, soft shadows of leaves.`
- **Movimiento:** `Slow top-down descent while a wooden rake draws gentle wave-like lines through the drying beans, beans rolling softly.`

### 05 · El grano
- **Imagen:** `Macro shot of roasted coffee beans falling in slow motion against a dark warm background, rim light highlighting the center crease of each bean, a few wisps of smoke.`
- **Movimiento:** `Roasted coffee beans fall and rotate in slow motion toward the camera, rim light gleaming on their surface, wisps of smoke curling.`

### 06 · La molienda
- **Imagen:** `Fresh medium-ground coffee pouring in a thin stream from a grinder chute into a paper filter, fine coffee particles floating in a beam of warm light, dark background.`
- **Movimiento:** `Ground coffee pours in slow motion forming a small mound, tiny particles float and sparkle in the light beam, camera slowly tilts down.`

### 07 · El filtrado
- **Imagen:** `Side view of a cone pour-over dripper with a paper filter full of ground coffee on top of a glass server, a gooseneck kettle pouring hot water, warm window light, wooden counter.`
- **Movimiento:** `Hot water pours from the gooseneck kettle in a slow spiral, the coffee bed blooms and bubbles, amber coffee drips steadily into the glass server, steam rising, slow motion.`

### 08 · Tu taza
- **Imagen:** `A handmade ceramic coffee cup filled with black filtered coffee on a rustic wooden table next to a window, morning light, steam curling up, coffee plants and misty mountains out of focus outside.`
- **Movimiento:** `Steam curls slowly from the cup, sunlight shifts gently across the table, very slow pull-back revealing the warm, cozy scene.`

## 5. Unir los clips (CapCut, gratis)

1. Nuevo proyecto **16:9**. Importa los 8 clips **en orden**.
2. Recorta cada clip a **3 segundos**: la parte más bonita, sin cortes bruscos.
3. Entre clips, si no usaste imagen inicial y final: transición **"Disolver"** de 0,4 s.
4. **Quita el audio** (la página lo reproduce en silencio).
5. Para que el bucle no salte: que el final del clip 8 sea tranquilo (vapor, luz).
6. Exporta: **1080p o 4K, 24 o 30 fps, MP4**.

## 6. Enviármelo

Adjunta el MP4 aquí en el chat. Yo:
1. lo optimizo para la web (computador y celular, versión liviana) con
   `npm run video:optimize -- video.mp4`;
2. ajusto en qué segundo cambia cada letrero;
3. reviso que el titular se lea bien sobre cada escena;
4. reemplazo el video provisional y te muestro el resultado.
