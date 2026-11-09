#!/usr/bin/env bash
# Convierte el video final del recorrido (de la mata a la taza) en secuencias de
# fotogramas WebP para el hero: una horizontal (escritorio) y una vertical (móvil).
#
# Uso:
#   bash scripts/video-to-frames.sh ruta/al/video.mp4 [fotogramas_escritorio] [fotogramas_movil]
#
# Ejemplo:
#   bash scripts/video-to-frames.sh recorrido.mp4 180 120
#
# Después, en src/content/hero.js, cambiar `frames.set` a "recorrido" y ajustar
# `frames.count` / `frames.countMobile` a los números usados aquí.
set -euo pipefail

IN="${1:?Indica la ruta del video}"
N_DESK="${2:-180}"
N_MOB="${3:-120}"
OUT="public/media/hero/recorrido"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")

mkdir -p "$OUT/desktop" "$OUT/mobile"
rm -f "$OUT"/desktop/*.webp "$OUT"/mobile/*.webp

# Escritorio: 1600 px de ancho, calidad 72 (~25–40 KB por cuadro).
ffmpeg -v error -i "$IN" -an \
  -vf "fps=${N_DESK}/${DUR},scale=1600:-2:flags=lanczos" \
  -frames:v "$N_DESK" -c:v libwebp -quality 72 -compression_level 6 \
  "$OUT/desktop/%03d.webp"

# Móvil: recorte vertical 9:16 centrado, 720 px de ancho.
ffmpeg -v error -i "$IN" -an \
  -vf "fps=${N_MOB}/${DUR},crop='min(iw,ih*9/16)':ih,scale=720:-2:flags=lanczos" \
  -frames:v "$N_MOB" -c:v libwebp -quality 68 -compression_level 6 \
  "$OUT/mobile/%03d.webp"

echo "Escritorio: $(ls "$OUT/desktop" | wc -l) cuadros, $(du -sh "$OUT/desktop" | cut -f1)"
echo "Móvil:      $(ls "$OUT/mobile" | wc -l) cuadros, $(du -sh "$OUT/mobile" | cut -f1)"
