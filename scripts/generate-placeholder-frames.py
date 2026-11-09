#!/usr/bin/env python3
"""
Genera la secuencia PROVISIONAL de fotogramas del hero (public/media/hero/placeholder).

Sirve solo para probar la mecánica de la animación por scroll mientras llega el
video real. Cada cuadro lleva la etiqueta "PLACEHOLDER" y el nombre de la etapa:
no debe confundirse con material de la marca.

Uso:  python3 scripts/generate-placeholder-frames.py
Requiere: Pillow (pip install pillow)
"""
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "media", "hero", "placeholder")
W, H = 1600, 900
FRAMES_PER_CHAPTER = 18

# (nombre, fondo, color del sujeto) — colores de referencia, no fotografía.
CHAPTERS = [
    ("01 · La cosecha", "#24361f", "#b8352a"),
    ("02 · El secado", "#7d5e33", "#d2b27a"),
    ("03 · La molienda", "#1b120c", "#4a2f1e"),
    ("04 · El filtrado", "#20160f", "#8a5a3b"),
    ("05 · Tu taza", "#e8dcc8", "#3b2619"),
]


def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


def font(size, bold=False):
    candidates = [
        "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf" if bold else "/usr/share/fonts/opentype/inter/Inter-Regular.otf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


def frame(chapter_idx, t):
    """t: 0..1 dentro del capítulo. Los últimos 35 % se funden con el siguiente."""
    name, bg, subj = CHAPTERS[chapter_idx]
    bg, subj = hex2rgb(bg), hex2rgb(subj)
    nxt = CHAPTERS[min(chapter_idx + 1, len(CHAPTERS) - 1)]
    blend = max(0.0, (t - 0.65) / 0.35)
    blend = blend * blend * (3 - 2 * blend)  # smoothstep
    bg = mix(bg, hex2rgb(nxt[1]), blend)
    subj = mix(subj, hex2rgb(nxt[2]), blend)

    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)

    # "Cámara" que se acerca y se aleja dentro de cada capítulo; en los bordes
    # del capítulo el tamaño coincide para que no haya saltos entre etapas.
    r = int(150 + 230 * math.sin(math.pi * t))
    cx, cy = W * 0.64, H * 0.52
    halo = Image.new("L", (W, H), 0)
    ImageDraw.Draw(halo).ellipse((cx - r * 1.8, cy - r * 1.8, cx + r * 1.8, cy + r * 1.8), fill=70)
    halo = halo.filter(ImageFilter.GaussianBlur(90))
    img.paste(Image.new("RGB", (W, H), mix(subj, (255, 240, 220), 0.25)), (0, 0), halo)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=subj)
    hl = int(r * 0.35)
    d.ellipse((cx - r * 0.45 - hl, cy - r * 0.45 - hl, cx - r * 0.45 + hl, cy - r * 0.45 + hl), fill=mix(subj, (255, 255, 255), 0.18))
    img = img.filter(ImageFilter.GaussianBlur(1.2))

    d = ImageDraw.Draw(img)
    light = sum(bg) / 3 > 140
    ink = (40, 28, 20) if light else (240, 232, 218)
    # Etiqueta centrada arriba: visible tanto en recorte horizontal como vertical.
    label = f"PLACEHOLDER · {name.upper()}"
    f = font(22, True)
    tw = d.textlength(label, font=f)
    x0 = (W - tw) / 2
    d.rectangle((x0 - 18, 118, x0 + tw + 18, 160), outline=ink, width=2)
    d.text((x0, 126), label, font=f, fill=ink)
    return img


def main():
    os.makedirs(OUT, exist_ok=True)
    n = 0
    for ci in range(len(CHAPTERS)):
        for k in range(FRAMES_PER_CHAPTER):
            n += 1
            t = k / FRAMES_PER_CHAPTER
            frame(ci, t).save(os.path.join(OUT, f"{n:03d}.webp"), quality=70, method=6)
    print(f"{n} fotogramas en {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
