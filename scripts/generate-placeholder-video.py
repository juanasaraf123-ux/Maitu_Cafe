#!/usr/bin/env python3
"""
Genera el video PROVISIONAL del inicio (public/media/hero/).

Mientras se produce el video real con inteligencia artificial, este video en
bucle permite ver la página tal como funcionará: 8 etapas de 2 s cada una,
con la etiqueta "PLACEHOLDER" y el nombre de la etapa para comprobar que el
letrero de la página va sincronizado.

Uso:  python3 scripts/generate-placeholder-video.py
Requiere: Pillow y ffmpeg.
"""
import math
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "media", "hero")
W, H = 1280, 720
FPS = 24
SECONDS_PER_CHAPTER = 2

# Debe coincidir con `chapters` en src/content/hero.js
CHAPTERS = [
    ("01 · La mata", "#24361f", "#b8352a"),
    ("02 · La cosecha", "#33401f", "#9e2f25"),
    ("03 · El beneficio", "#3e3122", "#d8c7a4"),
    ("04 · El secado", "#7d5e33", "#d2b27a"),
    ("05 · El grano", "#24170f", "#6e4a2e"),
    ("06 · La molienda", "#1b120c", "#4a2f1e"),
    ("07 · El filtrado", "#20160f", "#8a5a3b"),
    ("08 · Tu taza", "#e8dcc8", "#3b2619"),
]


def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


def font(size):
    for c in ("/usr/share/fonts/opentype/inter/Inter-SemiBold.otf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"):
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


FONT = font(14)


def frame(ci, t):
    """t: 0..1 dentro de la etapa. El último 30 % se funde con la siguiente
    (la última se funde con la primera para que el bucle no tenga salto)."""
    name, bg, subj = CHAPTERS[ci]
    nxt = CHAPTERS[(ci + 1) % len(CHAPTERS)]
    blend = max(0.0, (t - 0.7) / 0.3)
    blend = blend * blend * (3 - 2 * blend)
    bg = mix(hex2rgb(bg), hex2rgb(nxt[1]), blend)
    subj = mix(hex2rgb(subj), hex2rgb(nxt[2]), blend)

    img = Image.new("RGB", (W, H), bg)
    r = int(120 + 170 * math.sin(math.pi * t))
    cx, cy = W * 0.62, H * 0.5
    halo = Image.new("L", (W, H), 0)
    ImageDraw.Draw(halo).ellipse((cx - r * 1.8, cy - r * 1.8, cx + r * 1.8, cy + r * 1.8), fill=70)
    halo = halo.filter(ImageFilter.GaussianBlur(70))
    img.paste(Image.new("RGB", (W, H), mix(subj, (255, 240, 220), 0.25)), (0, 0), halo)
    d = ImageDraw.Draw(img)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=subj)
    hl = int(r * 0.35)
    d.ellipse((cx - r * 0.45 - hl, cy - r * 0.45 - hl, cx - r * 0.45 + hl, cy - r * 0.45 + hl), fill=mix(subj, (255, 255, 255), 0.18))

    light = sum(bg) / 3 > 140
    ink = (40, 28, 20) if light else (240, 232, 218)
    # Etiqueta abajo al centro, donde no tapa el texto de la página.
    label = f"PLACEHOLDER · VIDEO IA · {name.upper()}"
    tw = d.textlength(label, font=FONT)
    x0 = (W - tw) / 2
    d.rectangle((x0 - 12, H - 52, x0 + tw + 12, H - 22), outline=ink, width=1)
    d.text((x0, H - 47), label, font=FONT, fill=ink)
    return img


def main():
    if not shutil.which("ffmpeg"):
        print("Falta ffmpeg", file=sys.stderr)
        return 1
    os.makedirs(OUT_DIR, exist_ok=True)
    per = FPS * SECONDS_PER_CHAPTER
    with tempfile.TemporaryDirectory() as tmp:
        n = 0
        for ci in range(len(CHAPTERS)):
            for k in range(per):
                n += 1
                frame(ci, k / per).save(os.path.join(tmp, f"{n:04d}.png"))
        mp4 = os.path.join(OUT_DIR, "recorrido-placeholder.mp4")
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", os.path.join(tmp, "%04d.png"),
             "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4],
            check=True,
        )
        frame(0, 0.25).save(os.path.join(OUT_DIR, "recorrido-placeholder-poster.webp"), quality=70)
    print(f"{n} cuadros → {mp4} ({os.path.getsize(mp4) // 1024} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
