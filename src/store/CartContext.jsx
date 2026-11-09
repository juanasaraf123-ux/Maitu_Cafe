import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Carrito de compras. Se guarda en el navegador (localStorage) para no perderlo
 * al recargar. Cada línea guarda la variante (presentación + peso) y el stock
 * conocido para no permitir más unidades de las disponibles.
 */
const CartContext = createContext(null)
const KEY = 'maitu-cart-v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)) }, [items])

  const add = useCallback((product, variant, qty = 1) => {
    setItems((list) => {
      const found = list.find((l) => l.variantId === variant.id)
      if (found) {
        return list.map((l) => (l.variantId === variant.id ? { ...l, qty: Math.min(l.qty + qty, variant.stock), stock: variant.stock, price: variant.price } : l))
      }
      return [...list, {
        variantId: variant.id, slug: product.slug, name: product.name, image: product.image,
        presentation: variant.presentationLabel, weightG: variant.weightG, price: variant.price,
        stock: variant.stock, qty: Math.min(qty, variant.stock),
      }]
    })
    setOpen(true)
  }, [])

  const setQty = useCallback((variantId, qty) => {
    setItems((list) => list.map((l) => (l.variantId === variantId ? { ...l, qty: Math.max(1, Math.min(qty, l.stock)) } : l)))
  }, [])
  const remove = useCallback((variantId) => setItems((list) => list.filter((l) => l.variantId !== variantId)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const count = items.reduce((s, l) => s + l.qty, 0)
    const subtotal = items.reduce((s, l) => s + l.qty * l.price, 0)
    return { items, count, subtotal, add, setQty, remove, clear, open, setOpen }
  }, [items, add, setQty, remove, clear, open])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
