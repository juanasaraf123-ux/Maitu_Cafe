import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { formatCOP, formatDate, formatWeight } from '../lib/format.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import '../components/admin/admin.css'

/**
 * Panel de la marca (/admin): pedidos y su seguimiento, cafés con precios y
 * stock, y costo de envío. Requiere la clave definida en el servidor.
 */
const TOKEN_KEY = 'maitu-admin'
const STATUS_OPTIONS = [
  ['pendiente_pago', 'Pendiente de pago'], ['pagado', 'Pago confirmado'], ['alistando', 'Alistando'],
  ['empacado', 'Empacado'], ['enviado', 'Enviado'], ['entregado', 'Entregado'],
  ['pago_rechazado', 'Pago rechazado'], ['cancelado', 'Cancelado'],
]

export default function AdminPage() {
  usePageTitle('Panel')
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '')
  const [tab, setTab] = useState('pedidos')
  const logout = useCallback(() => { sessionStorage.removeItem(TOKEN_KEY); setToken('') }, [])

  if (!token) return <Login onToken={(t) => { sessionStorage.setItem(TOKEN_KEY, t); setToken(t) }} />

  return (
    <main className="admin">
      <header className="admin__bar">
        <b>Panel Maitú</b>
        <nav className="admin__tabs" aria-label="Secciones del panel">
          {[['pedidos', 'Pedidos'], ['cafes', 'Cafés y stock'], ['envio', 'Envío']].map(([k, l]) => (
            <button key={k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>{l}</button>
          ))}
        </nav>
        <button className="link-btn" onClick={logout}>Salir</button>
      </header>
      <div className="admin__body">
        {tab === 'pedidos' && <Orders token={token} onAuthError={logout} />}
        {tab === 'cafes' && <Products token={token} onAuthError={logout} />}
        {tab === 'envio' && <Shipping token={token} onAuthError={logout} />}
      </div>
    </main>
  )
}

function Login({ onToken }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    try { onToken((await api.admin.login(password)).token) } catch (err) { setError(err.message) }
  }
  return (
    <main className="admin admin--login">
      <form className="card" onSubmit={submit}>
        <h1>Panel Maitú</h1>
        <label className="field"><span>Clave</span><input type="password" required autoFocus value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="alert alert--error" role="alert">{error}</p>}
        <button className="btn btn--caramel btn--block">Entrar</button>
      </form>
    </main>
  )
}

/** Hook pequeño para llamadas del panel con manejo de sesión vencida. */
function useAdmin(token, onAuthError) {
  return useCallback(async (fn) => {
    try { return await fn(token) } catch (e) {
      if (e.status === 401) onAuthError()
      throw e
    }
  }, [token, onAuthError])
}

// ---------------- Pedidos ----------------
function Orders({ token, onAuthError }) {
  const call = useAdmin(token, onAuthError)
  const [filter, setFilter] = useState('')
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    call((t) => api.admin.get(`/orders${filter ? `?status=${filter}` : ''}`, t)).then(setOrders).catch((e) => setError(e.message))
  }, [call, filter])
  useEffect(load, [load])

  return (
    <div className="admin__split">
      <section>
        <div className="admin__toolbar">
          <h2>Pedidos</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar por estado">
            <option value="">Todos</option>
            {STATUS_OPTIONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          <button className="link-btn" onClick={load}>Actualizar</button>
        </div>
        {error && <p className="alert alert--error">{error}</p>}
        {orders.length === 0 ? <p className="muted">No hay pedidos.</p> : (
          <table className="table">
            <thead><tr><th>Código</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.code} className={selected === o.code ? 'is-selected' : ''} onClick={() => setSelected(o.code)}>
                  <td><button className="link-btn">{o.code}</button></td><td>{o.customer}<small>{o.city}</small></td>
                  <td>{formatCOP(o.total)}</td><td><span className={`pill pill--${o.status}`}>{o.statusLabel}</span></td><td>{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {selected && <OrderDetail key={selected} code={selected} call={call} onChanged={load} />}
    </div>
  )
}

function OrderDetail({ code, call, onChanged }) {
  const [o, setO] = useState(null)
  const [form, setForm] = useState({ status: '', note: '', carrier: '', trackingNumber: '' })
  const [msg, setMsg] = useState('')
  const load = useCallback(() => call((t) => api.admin.get(`/orders/${code}`, t)).then((d) => {
    setO(d)
    setForm({ status: d.status, note: '', carrier: d.carrier, trackingNumber: d.trackingNumber })
  }), [call, code])
  useEffect(() => { load() }, [load])
  if (!o) return <section className="card">Cargando…</section>

  const save = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      await call((t) => api.admin.post(`/orders/${code}/status`, form, t))
      setMsg('Guardado ✓')
      load(); onChanged()
    } catch (err) { setMsg(err.message) }
  }

  return (
    <section className="card admin__detail">
      <h2>{o.code} · {o.statusLabel}</h2>
      <p><b>{o.customer.name}</b> · CC {o.document}<br />{o.customer.phone} · {o.customer.email}<br />{o.customer.address}, {o.customer.city}, {o.customer.department}</p>
      {o.notes && <p className="muted">Indicaciones: {o.notes}</p>}
      <ul className="sum-lines">
        {o.items.map((i, k) => <li key={k}><span>{i.qty} × {i.product_name} <small>{i.presentationLabel} · {formatWeight(i.weight_g)}</small></span><b>{formatCOP(i.unit_price_cop * i.qty)}</b></li>)}
      </ul>
      <p>Envío {formatCOP(o.shipping)} · <b>Total {formatCOP(o.total)}</b>{o.paymentMethod && <> · {o.paymentMethod}</>}{o.paymentTxId && <small> (Wompi {o.paymentTxId})</small>}</p>
      <p><a href={o.link} target="_blank" rel="noreferrer">Ver como cliente ↗</a></p>

      <form className="admin__status" onSubmit={save}>
        <h3>Actualizar seguimiento</h3>
        <label className="field"><span>Estado</span>
          <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            {STATUS_OPTIONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        {(form.status === 'enviado' || form.status === 'entregado') && (
          <div className="form-grid">
            <label className="field"><span>Transportadora</span><input value={form.carrier} onChange={(e) => setForm((f) => ({ ...f, carrier: e.target.value }))} /></label>
            <label className="field"><span>Número de guía</span><input value={form.trackingNumber} onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))} /></label>
          </div>
        )}
        <label className="field"><span>Nota (la ve el cliente)</span><input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} /></label>
        {form.status === 'cancelado' && o.status !== 'cancelado' && <p className="alert">Al cancelar se devuelve el stock. Si el cliente ya pagó, la devolución del dinero se hace desde el panel de Wompi.</p>}
        <button className="btn btn--caramel">Guardar</button> {msg && <span className="muted">{msg}</span>}
      </form>

      <h3>Historial</h3>
      <ol className="admin__events">
        {o.events.map((e, k) => <li key={k}><b>{e.label}</b> · {formatDate(e.created_at)}{e.note && <> — {e.note}</>}</li>)}
      </ol>
    </section>
  )
}

// ---------------- Cafés y stock ----------------
function Products({ token, onAuthError }) {
  const call = useAdmin(token, onAuthError)
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const load = useCallback(() => call((t) => api.admin.get('/products', t)).then(setProducts).catch((e) => setError(e.message)), [call])
  useEffect(() => { load() }, [load])

  const create = async (e) => {
    e.preventDefault()
    try { await call((t) => api.admin.post('/products', { name: newName }, t)); setNewName(''); load() } catch (err) { setError(err.message) }
  }

  return (
    <div>
      <div className="admin__toolbar"><h2>Cafés y stock</h2></div>
      {error && <p className="alert alert--error">{error}</p>}
      {products.map((p) => <ProductEditor key={p.id} product={p} call={call} onSaved={load} />)}
      <form className="card admin__new" onSubmit={create}>
        <h3>Agregar un café</h3>
        <label className="field"><span>Nombre</span><input required value={newName} onChange={(e) => setNewName(e.target.value)} /></label>
        <button className="btn btn--caramel">Crear (queda oculto hasta activarlo)</button>
      </form>
    </div>
  )
}

const FIELDS = [
  ['name', 'Nombre'], ['summary', 'Frase corta'], ['description', 'Descripción', 'textarea'],
  ['origin', 'Procedencia'], ['variety', 'Variedad'], ['process', 'Proceso'], ['notes', 'Notas de sabor y aroma'],
  ['image', 'Imagen (ruta, ej. /media/productos/foto.webp)'],
]

function ProductEditor({ product, call, onSaved }) {
  const [p, setP] = useState(product)
  const [msg, setMsg] = useState('')
  const [nv, setNv] = useState({ presentation: 'grano', weightG: 340, price: '', stock: 0 })
  useEffect(() => setP(product), [product])

  const saveProduct = async () => {
    setMsg('')
    try { await call((t) => api.admin.put(`/products/${p.id}`, p, t)); setMsg('Guardado ✓'); onSaved() } catch (e) { setMsg(e.message) }
  }
  const saveVariant = async (v, patch) => {
    try { await call((t) => api.admin.put(`/variants/${v.id}`, patch, t)); onSaved() } catch (e) { setMsg(e.message) }
  }
  const addVariant = async (e) => {
    e.preventDefault()
    try { await call((t) => api.admin.post(`/products/${p.id}/variants`, nv, t)); onSaved() } catch (err) { setMsg(err.message) }
  }

  return (
    <details className="card admin__product" open={product.variants.some((v) => !v.price_cop)}>
      <summary><b>{product.name}</b> {product.active ? <span className="pill pill--pagado">Visible</span> : <span className="pill pill--cancelado">Oculto</span>}</summary>
      <div className="form-grid">
        {FIELDS.map(([k, label, type]) => (
          <label key={k} className={`field ${type === 'textarea' ? 'field--full' : ''}`}><span>{label}</span>
            {type === 'textarea'
              ? <textarea rows="3" value={p[k] || ''} onChange={(e) => setP({ ...p, [k]: e.target.value })} />
              : <input value={p[k] || ''} onChange={(e) => setP({ ...p, [k]: e.target.value })} />}
          </label>
        ))}
        <label className="check"><input type="checkbox" checked={!!p.active} onChange={(e) => setP({ ...p, active: e.target.checked ? 1 : 0 })} /><span>Visible en la tienda</span></label>
      </div>
      <button className="btn btn--caramel" onClick={saveProduct}>Guardar café</button> {msg && <span className="muted">{msg}</span>}

      <h3>Presentaciones, precio y stock</h3>
      <table className="table">
        <thead><tr><th>Presentación</th><th>Peso</th><th>Precio (COP)</th><th>Stock</th><th>Activa</th></tr></thead>
        <tbody>
          {product.variants.map((v) => <VariantRow key={v.id} v={v} onSave={(patch) => saveVariant(v, patch)} />)}
        </tbody>
      </table>
      <form className="admin__inline" onSubmit={addVariant}>
        <select value={nv.presentation} onChange={(e) => setNv({ ...nv, presentation: e.target.value })}><option value="grano">Grano</option><option value="molido">Molido</option></select>
        <input type="number" min="1" value={nv.weightG} onChange={(e) => setNv({ ...nv, weightG: e.target.value })} aria-label="Peso en gramos" /> g
        <input type="number" min="1" placeholder="Precio" value={nv.price} onChange={(e) => setNv({ ...nv, price: e.target.value })} aria-label="Precio" />
        <input type="number" min="0" value={nv.stock} onChange={(e) => setNv({ ...nv, stock: e.target.value })} aria-label="Stock" />
        <button className="btn btn--sm btn--caramel">Agregar presentación</button>
      </form>
    </details>
  )
}

function VariantRow({ v, onSave }) {
  const [price, setPrice] = useState(v.price_cop ?? '')
  const [stock, setStock] = useState(v.stock)
  const dirty = String(price) !== String(v.price_cop ?? '') || Number(stock) !== v.stock
  return (
    <tr>
      <td>{v.presentation === 'grano' ? 'Grano' : 'Molido'}</td>
      <td>{formatWeight(v.weight_g)}</td>
      <td><input type="number" min="1" placeholder="Sin precio" value={price} onChange={(e) => setPrice(e.target.value)} aria-label="Precio" /></td>
      <td><input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} aria-label="Stock" /></td>
      <td>
        <input type="checkbox" checked={!!v.active} onChange={(e) => onSave({ active: e.target.checked })} aria-label="Activa" />
        {dirty && <button className="btn btn--sm btn--caramel" onClick={() => onSave({ price: price === '' ? null : Number(price), stock: Number(stock) })}>Guardar</button>}
      </td>
    </tr>
  )
}

// ---------------- Envío ----------------
function Shipping({ token, onAuthError }) {
  const call = useAdmin(token, onAuthError)
  const [s, setS] = useState(null)
  const [msg, setMsg] = useState('')
  useEffect(() => { call((t) => api.admin.get('/settings', t)).then(setS).catch((e) => setMsg(e.message)) }, [call])
  if (!s) return <p className="muted">{msg || 'Cargando…'}</p>
  const save = async (e) => {
    e.preventDefault()
    try { setS(await call((t) => api.admin.put('/settings', s, t))); setMsg('Guardado ✓') } catch (err) { setMsg(err.message) }
  }
  return (
    <form className="card admin__shipping" onSubmit={save}>
      <h2>Envío</h2>
      <label className="field"><span>Costo de envío (COP)</span><input type="number" min="0" value={s.shippingCop ?? 0} onChange={(e) => setS({ ...s, shippingCop: e.target.value })} /></label>
      <label className="field"><span>Envío gratis desde (COP, vacío = nunca)</span><input type="number" min="1" value={s.freeShippingFromCop ?? ''} onChange={(e) => setS({ ...s, freeShippingFromCop: e.target.value })} /></label>
      <button className="btn btn--caramel">Guardar</button> {msg && <span className="muted">{msg}</span>}
    </form>
  )
}
