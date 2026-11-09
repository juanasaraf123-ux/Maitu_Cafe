/** Cliente de la API de la tienda (/api). Lanza Error con el mensaje del servidor. */
async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'No pudimos conectar con la tienda. Intenta de nuevo.')
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  config: () => request('/config'),
  products: () => request('/products'),
  product: (slug) => request(`/products/${encodeURIComponent(slug)}`),
  createOrder: (body) => request('/orders', { method: 'POST', body }),
  order: (code, params) => request(`/orders/${encodeURIComponent(code)}?${new URLSearchParams(params)}`),
  admin: {
    login: (password) => request('/admin/login', { method: 'POST', body: { password } }),
    get: (path, token) => request(`/admin${path}`, { token }),
    post: (path, body, token) => request(`/admin${path}`, { method: 'POST', body, token }),
    put: (path, body, token) => request(`/admin${path}`, { method: 'PUT', body, token }),
  },
}
