#!/usr/bin/env bash
# Prepara el video real del inicio (hecho con IA o grabado) para la web:
# versión de escritorio (horizontal), versión móvil (vertical) y póster.
#
# Uso:
#   bash scripts/optimize-video.sh ruta/al/video.mp4
#
# Resultado en public/media/hero/:
#   recorrido-desktop.mp4   1920 px, H.264, sin audio (~3–6 MB para 20–30 s)
#   recorrido-mobile.mp4    720×1280 recorte vertical centrado (~1–2 MB)
#   recorrido-poster.webp   primer cuadro, se muestra mientras carga
#
# Después, en src/content/hero.js: cambiar `heroVideo = VIDEOS.placeholder`
# por `VIDEOS.recorrido` y ajustar el segundo en que empieza cada etapa (`start`).
set -euo pipefail

IN="${1:?Indica la ruta del video}"
OUT="public/media/hero"
mkdir -p "$OUT"

ffmpeg -v error -y -i "$IN" -an \
  -vf "scale='min(1920,iw)':-2:flags=lanczos,fps=24" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart \
  "$OUT/recorrido-desktop.mp4"

ffmpeg -v error -y -i "$IN" -an \
  -vf "crop='min(iw,ih*9/16)':ih,scale=720:-2:flags=lanczos,fps=24" \
  -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart \
  "$OUT/recorrido-mobile.mp4"

ffmpeg -v error -y -i "$OUT/recorrido-desktop.mp4" -frames:v 1 -q:v 70 "$OUT/recorrido-poster.webp"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/recorrido-desktop.mp4")
echo "Duración: ${DUR}s"
ls -lh "$OUT"/recorrido-desktop.mp4 "$OUT"/recorrido-mobile.mp4 "$OUT"/recorrido-poster.webp
