# Tienda virtual · cómo funciona y cómo activarla

## 1. Qué incluye

| Parte | Dónde | Qué hace |
|---|---|---|
| Catálogo | `/tienda` | Cafés con búsqueda, filtro grano/molido y orden por precio |
| Ficha | `/tienda/:café` | Presentación (grano o molido), peso, cantidad, precio, stock y descripción |
| Carrito | Ícono del menú | Se guarda en el navegador; no permite más unidades que el stock |
| Pago | `/checkout` | Datos del comprador y la entrega, resumen y envío; pago con **Wompi** (PSE, tarjetas, Nequi, botón Bancolombia) |
| Seguimiento | `/pedido` | Línea de tiempo: Pedido recibido → Pago confirmado → Alistando → Empacado → Enviado (transportadora y guía) → Entregado |
| Panel | `/admin` | Pedidos y su estado, cafés con precio y stock, costo de envío |

## 2. Cómo se protege el dinero y el inventario

- **El precio lo calcula el servidor**, nunca el navegador. El enlace a Wompi lleva una
  **firma de integridad** (SHA-256 de referencia, valor, moneda y un secreto), así nadie
  puede cambiar el valor a pagar.
- **El pago solo se confirma con Wompi.** El servidor recibe el aviso de Wompi
  (`/api/wompi/events`), **verifica su firma** y comprueba que la referencia y el valor
  coincidan con el pedido. Si algo no cuadra, no cambia nada. Como respaldo, al volver del
  pago se consulta la transacción en la API de Wompi.
- **Stock reservado:** al confirmar el pedido se descuenta el stock. Si el pago se rechaza,
  o pasan `ORDER_EXPIRY_HOURS` horas (24 por defecto) sin pago, el stock vuelve.
- **Sin pagos falsos:** si Wompi no está configurado, la web no simula cobros. El pedido
  queda registrado y reservado, y se avisa que el pago se coordina por WhatsApp.
- Los datos de tarjeta o cuenta **nunca pasan por el servidor de Maitú**: se ingresan en Wompi.
- El seguimiento solo se ve con el enlace privado del pedido o con el código y el correo
  de la compra.

## 3. Activar Wompi (paso a paso)

1. Crear la cuenta de comercio en <https://comercios.wompi.co> a nombre de la marca.
2. En **Desarrolladores**, copiar las llaves de **pruebas** (sandbox): llave pública,
   secreto de integridad y secreto de eventos.
3. En el servidor, crear `.env` a partir de `.env.example`:
   ```
   WOMPI_ENV=sandbox
   WOMPI_PUBLIC_KEY=pub_test_...
   WOMPI_INTEGRITY_SECRET=test_integrity_...
   WOMPI_EVENTS_SECRET=test_events_...
   PUBLIC_URL=https://dominio-de-maitu.com
   ```
4. En Wompi → Desarrolladores → **URL de eventos**:
   `https://dominio-de-maitu.com/api/wompi/events`
5. Hacer compras de prueba con los datos de prueba de Wompi (tarjetas y PSE de pruebas,
   ver <https://docs.wompi.co/docs/colombia/datos-de-prueba-en-sandbox/>).
6. Cuando todo funcione, cambiar a las llaves de **producción** y `WOMPI_ENV=production`.

## 4. Panel de administración (`/admin`)

Se activa con `ADMIN_PASSWORD` (mínimo 8 caracteres) y `ADMIN_SECRET` (mínimo 16) en `.env`.

- **Pedidos:** filtrar por estado, ver datos del cliente y de la entrega, y avanzar el
  seguimiento. Para "Enviado" se piden la transportadora y el número de guía, que el
  cliente ve en su seguimiento. Al cancelar se devuelve el stock; si el cliente ya había
  pagado, la devolución del dinero se hace desde el panel de Wompi.
- **Cafés y stock:** editar nombre, descripción, procedencia, variedad, proceso, notas e
  imagen; crear presentaciones (grano o molido + peso) con su precio y stock; ocultar o
  mostrar cafés. **Una presentación sin precio no se muestra en la tienda.**
- **Envío:** costo fijo de envío y, si se quiere, un valor desde el cual el envío es gratis.

> El producto inicial (Maitú Café 340 g, en grano y molido) se crea **sin precio y con
> stock 0**. Hay que definirlos en el panel antes de abrir la tienda.

## 5. Publicar

Es un solo servicio Node que sirve la web y la API:

```bash
npm install
```

```bash
npm run build
```

```bash
npm run start
```

- Requiere **Node 22.13 o superior** (usa la base de datos SQLite integrada en Node).
- La base de datos es el archivo `data/maitu.db`. En el hosting debe estar en un **disco
  persistente** (Render, Railway, Fly.io o un VPS) y respaldarse con frecuencia.
- Variables de entorno: ver `.env.example`. Nunca subir `.env` al repositorio.
- Servir con HTTPS (lo exige Wompi).

## 6. Desarrollo y pruebas

```bash
npm run seed:demo
```

```bash
DB_PATH=data/demo.db DEMO_MODE=1 npm run dev
```

`seed:demo` crea `data/demo.db` con **precios, stock y un café de prueba inventados**. La
web muestra el aviso "Modo de prueba" y nunca usa la base de datos real.

Pruebas realizadas (todas pasan):

- Pedido con stock insuficiente → rechazado; correo inválido → rechazado.
- Pedido válido: total = productos + envío; el stock se reserva.
- Enlace a Wompi con la firma de integridad correcta.
- Aviso de Wompi con firma falsa → rechazado; con valor alterado → no cambia el pedido;
  aviso válido → "Pago confirmado" y el carrito se vacía.
- Pago rechazado → el stock vuelve.
- Panel: clave incorrecta → 401; "Enviado" exige guía; el cliente ve transportadora y guía.
- Seguimiento con correo equivocado → no se muestra; búsqueda con código + correo funciona.

## 7. Pendiente de la marca

- Precios, presentaciones reales (¿grano, molido, ambos?), pesos y stock.
- Más cafés, si los hay: nombre, procedencia, variedad, proceso y notas **reales**.
- Costo de envío, cobertura y transportadora.
- Cuenta y llaves de Wompi.
- Política de tratamiento de datos y términos de venta (textos legales).
