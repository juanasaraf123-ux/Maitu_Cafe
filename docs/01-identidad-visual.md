# Etapa 1 · Identidad visual (versión 2, con la marca real)

> La primera propuesta (verde bosque y dorado) fue descartada por la marca.
> Esta versión parte del **Manual de Marca Maitú**, del **arte del empaque** y de
> la dirección pedida: **café + beige + el azul del empaque**.

## 1. Marca

| | |
|---|---|
| Nombre | **Maitú Café** · *by Nicolas Bernal* |
| Esencia (manual) | "Maitú es la invitación a explorar el mundo del café, a descubrir sabores ancestrales y a crear nuevas experiencias. Un puente entre el pasado y el presente." |
| Palabras clave (manual) | Joven · Orgullo regional · Calidad |
| Logos usados en la web | `public/brand/` — extraídos en vector (SVG) del archivo `.ai` original, sin modificar formas ni colores |

Archivos de logo:

| Archivo | Uso |
|---|---|
| `maitu-logo-color.svg` | Menú sobre fondo claro |
| `maitu-logo-blanco.svg` | Apertura, menú sobre el recorrido, pie de página |
| `maitu-sello-nicolas.svg` | Reservado (sello con la silueta de Nicolas) |
| `maitu-sello-m.svg` | Ícono del sitio (favicon) y sello del pie |

Se respetan las reglas del manual: no cambiar colores, no girar, no deformar, no
recortar, no agregar elementos y mantener el espacio seguro.

## 2. Paleta

Base de la web: **café** (el recorrido), **beige/crema** (secciones de lectura) y
**azul Maitú** (tienda y botones de compra). Los acentos del manual y del empaque se
usan en dosis pequeñas.

| Token | Hex | Origen | Uso |
|---|---|---|---|
| `--c-cafe-900` | `#1A120D` | — | Fondo del recorrido y del pie |
| `--c-cafe-800` | `#2A1C14` | — | Texto principal sobre claro |
| `--c-cafe-600` | `#6E5444` | — | Texto secundario sobre claro |
| `--c-crema-100` | `#F6F0E6` | — | Fondo claro, texto sobre oscuro |
| `--c-beige-200` | `#E8DCC8` | — | Superficies, hover de botones claros |
| `--c-azul-700` | `#1F4B7F` | **Empaque** (medido en el arte) | Botones de compra, sección Preparación |
| `--c-azul-800` | `#163A63` | Derivado | Menú móvil, hover |
| `--c-azul-300` | `#A9C7EA` | Patrón del empaque | Acentos sobre café y azul |
| `--c-coral-500` | `#E9573F` | Logo / empaque | Acento puntual (cereza) |
| `--c-amarillo-400` | `#F2B33D` | Empaque | Datos en vivo y cifras de recetas |
| `--c-teal-logo` | `#005C67` | Logo | **Solo** dentro del logotipo |

Contraste verificado (WCAG 2.1, mínimo 4.5:1 para texto normal):

| Combinación | Ratio |
|---|---|
| Crema sobre café 900 | 16.3 : 1 |
| Azul claro sobre café 900 | 10.6 : 1 |
| Amarillo sobre café 900 | 9.9 : 1 |
| Crema sobre azul Maitú | 7.8 : 1 |
| Azul claro sobre azul Maitú | 5.1 : 1 |
| Amarillo sobre azul Maitú | 4.8 : 1 |
| Café 800 sobre crema | 14.5 : 1 |
| Café 600 sobre crema | 6.2 : 1 |
| Coral 700 (`#C2412B`) sobre crema | 4.5 : 1 — el coral 500 solo para texto ≥ 24 px |

## 3. Tipografía

| Rol | Manual | En la web hoy | Nota |
|---|---|---|---|
| Títulos | Peachy Woman | **Fraunces** (serif variable, libre) | ⚠ Para usar Peachy Woman se necesita el archivo `.woff2` y su licencia web. Ya está declarada primero en `--font-display`: al agregar el archivo se usa sola. |
| Texto | Open Sans | **Open Sans** | Autoalojada con `@fontsource`, sin depender de Google Fonts. |
| Alternativa títulos | Beloved Script | No se usa | Script decorativo: poco legible en pantallas pequeñas. |

## 4. Fotografía

- Única foto real disponible: Nicolas Bernal catando (del manual). Se usa en
  "Nuestra historia".
- Las demás fotos del manual son de banco de imágenes (barista, latte art, taza con
  granos) y **no se usan** como si fueran de la marca.
- Faltan fotos reales de fincas, recolección, secado, empaque y preparación.

## 5. Movimiento

| Tipo | Duración | Curva |
|---|---|---|
| Micro (hover, foco) | 180 ms | `power2.out` |
| Entrada de texto | 0.9–1.2 s, escalonado | `expo.out` |
| Letrero de etapa | 0.8 s, sincronizado con el video | `expo.out` |
| Apertura | ~2.8 s (≈1 s en visitas siguientes) | `power3.inOut` / `expo.inOut` |

Con *reducir movimiento* activado: sin apertura ni scroll suave, y el video no arranca
solo (queda el botón Reproducir).
