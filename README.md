# Maitú Café — Del origen a tu taza

Sitio web y tienda virtual de **Maitú Café** (by Nicolas Bernal): inicio con video,
historia, proceso, preparación y **tienda con carrito, pagos con Wompi (PSE, tarjetas,
Nequi) y seguimiento de pedidos**.

**Stack:** React 19 · Vite · React Router · GSAP · Lenis · Three.js + React Three Fiber ·
Node 22 + Express 5 · SQLite (integrado en Node) · Wompi.

## Ejecutar

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Abre la web en `http://localhost:5173`. La API corre en el puerto 8787 y el panel está en `/admin`.

Para probar la tienda con datos de ejemplo (base de datos aparte, marcada como prueba):

```bash
npm run seed:demo
```

```bash
DB_PATH=data/demo.db DEMO_MODE=1 npm run dev
```

Producción:

```bash
npm run build
```

```bash
npm run start
```

## Estado

| Etapa | | Estado |
|---|---|---|
| 1 | Identidad visual | ✅ v4: diseño oscuro y cálido con el patrón del empaque, efectos y movimiento |
| 2 | React + Vite | ✅ |
| 3 | Inicio | ✅ Video en marco con borde en onda, letrero de etapa, índice 01–08 · video **provisional** |
| 4 | Animaciones GSAP | ✅ |
| 5 | Elementos 3D | ✅ Bolsa Maitú en 3D con el arte real del empaque (inicio, tienda y ficha) |
| 6 | Historia, proceso, preparación | ✅ Con datos reales; faltan fincas y procesos |
| 7 | Tienda | ✅ Catálogo, ficha, carrito, pago Wompi, seguimiento, panel · **faltan precios reales y llaves de Wompi** |
| 8 | Responsive | ✅ Base |
| 9 | Optimización y pruebas | Parcial: pruebas de la tienda listas |

## Estructura

```
server/                  API: catálogo, pedidos, Wompi, panel (Express + SQLite)
  routes/store.js        Rutas públicas · routes/admin.js: panel
  orders.js · wompi.js   Lógica de pedidos y pagos
data/                    Base de datos (no se sube al repositorio)
public/brand/            Logos oficiales en SVG
public/media/            Video del inicio, foto de Nicolas, empaque
src/pages/               Inicio, Tienda, Ficha, Pago, Pedido, Panel
src/components/          hero/, sections/, shop/, layout/, admin/, three/ (bolsa 3D), fx/ (efectos)
src/store/               Carrito y configuración de la tienda
src/content/             Textos y datos editables de la marca
docs/                    Identidad, inicio, multimedia, datos pendientes, tienda
```

Ver **`docs/05-tienda.md`** para activar Wompi, usar el panel y publicar.
