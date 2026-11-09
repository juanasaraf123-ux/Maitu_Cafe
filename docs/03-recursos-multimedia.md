# Recursos multimedia necesarios

> **Actualización:** el inicio ahora usa **un solo video continuo** de la mata a la
> taza, convertido en cuadros (ver `docs/02-hero-cinematografico.md`, sección 3).
> La lista de tomas de abajo sigue sirviendo como guion de ese video y para las
> fotos de las secciones de origen y proceso.

> Prioridad: el material **real de la marca**. Mientras llega, la web muestra
> placeholders tonales etiquetados ("PLACEHOLDER — Escena X"). No se usarán imágenes de
> stock presentadas como propias.

## 1. Lista de tomas para el hero (shot list)

Para cada escena se necesita **una toma horizontal (16:9) y una vertical (9:16)**,
o al menos una toma 4K horizontal con margen suficiente para reencuadrar en vertical.

| # | Escena | Toma ideal | Duración útil | Notas de rodaje |
|---|--------|-----------|---------------|-----------------|
| 01 | Origen | Macro de cereza roja madura en la rama; leve movimiento de hojas; rocío/neblina | 6–10 s | Trípode o slider lento hacia la cereza. Luz lateral de mañana. El centro de la cereza en el centro del cuadro (punto de origen del corte circular). |
| 02 | Recolección | Manos recogiendo cerezas y depositándolas en el canasto | 6–10 s | Primer plano de manos. Iniciar el plano sobre una cereza en el centro (match cut). Pedir autorización de imagen. |
| 03 | Transformación | Despulpado, fermentación, lavado o el proceso real que se use | 6–10 s | ⚠ Confirmar procesos reales por café. Una toma por proceso si hay varios. |
| 04 | Secado | Café en camas africanas, marquesinas o patios; manos/rastrillo moviendo los granos | 6–10 s | Luz cenital/dorada. Plano cenital ideal (permite el barrido vertical). |
| 05 | Grano | Granos verdes y tostados cayendo o en manos; selección | 5–8 s | Fondo oscuro, luz lateral. |
| 06 | Molienda | Granos entrando al molino y café molido cayendo | 5–8 s | Macro; el molido cayendo en cámara lenta (60–120 fps). |
| 07 | Filtrado | Vertido de agua en espiral sobre el café molido en el filtro, *bloom*, gotas cayendo en la jarra | 8–12 s | **Toma fija en trípode**, cámara lenta 60–120 fps. Se convertirá en secuencia de imágenes. Indicar el método (V60, Chemex, Kalita…) ⚠ por confirmar. |
| 08 | Resultado | Taza servida en mesa de madera/lino, luz de ventana, vapor | 6–10 s | Ambiente cálido y natural, sin máquinas de espresso. |

También: **fotografías** de fincas, paisajes del Tolima, productores (con autorización),
empaques del producto (fondo neutro, varias vistas) y el logotipo oficial en SVG.

## 2. Especificaciones de entrega (material original)

- Video: 4K o mínimo 1080p, 24/25 fps (cámara lenta a 60–120 fps), perfil plano/log si es
  posible, **sin audio necesario**, sin marcas de agua.
- Foto: RAW o JPG de máxima calidad, mínimo 3000 px en el lado largo.
- Derechos: confirmación escrita de que la marca puede usar el material y las imágenes de
  las personas que aparecen.

## 3. Especificaciones web (lo que generaremos a partir del original)

| Recurso | Escritorio | Móvil |
|---------|-----------|-------|
| Clip de escena | 1920×1080, H.264 MP4 + VP9/AV1 WebM, 24 fps, 4–8 s, sin audio, ≤ 2.5 MB | 1080×1920 (o 720×1280), ≤ 1.2 MB |
| Póster de escena | AVIF + WebP, 1920 px, ≤ 150 KB | AVIF + WebP, 1080 px, ≤ 90 KB |
| Secuencia filtrado | 90–120 cuadros WebP/AVIF 1600 px, ≤ 3 MB total | 45–60 cuadros 900 px, ≤ 1.5 MB |
| Fotografías editoriales | AVIF + WebP, 3 tamaños (640/1280/2048), `srcset` | — |
| Modelo 3D (opcional) | GLB + Draco + KTX2, ≤ 400 KB | mismo archivo, menor DPR |

Comandos de referencia (ffmpeg) que se usarán en la Etapa 9:

```bash
# Clip escritorio H.264 (compatibilidad universal, inicio rápido)
ffmpeg -i origen.mov -an -vf "scale=1920:-2,fps=24" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart escena-01-origen-1080.mp4

# Clip escritorio AV1/WebM (menor peso en navegadores modernos)
ffmpeg -i origen.mov -an -vf "scale=1920:-2,fps=24" -c:v libsvtav1 -crf 38 -preset 6 escena-01-origen-1080.webm

# Recorte vertical móvil (ajustar x del crop al punto de interés)
ffmpeg -i origen.mov -an -vf "crop=ih*9/16:ih,scale=720:-2,fps=24" -c:v libx264 -crf 27 -pix_fmt yuv420p -movflags +faststart escena-01-origen-720v.mp4

# Póster (primer cuadro) en AVIF
ffmpeg -i escena-01-origen-1080.mp4 -frames:v 1 -c:v libaom-av1 -still-picture 1 -crf 32 escena-01-origen-poster.avif

# Secuencia de imágenes del filtrado (100 cuadros)
ffmpeg -i filtrado.mov -an -vf "fps=12,scale=1600:-2" -c:v libwebp -quality 72 frames/filtrado-%03d.webp
```

## 4. Convención de nombres y ubicación

```
public/media/hero/
  escena-01-origen/
    desktop.mp4  desktop.webm  mobile.mp4  mobile.webm  poster-desktop.avif  poster-mobile.avif ...
  escena-07-filtrado/
    frames-desktop/001.webp … 120.webp
    frames-mobile/001.webp … 060.webp
```

Las rutas se declaran en `src/content/hero.js`; cambiar un video es cambiar un archivo.
