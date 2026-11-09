import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api.js'

/** Configuración pública de la tienda: pagos activos, envío, modo de prueba. */
const Ctx = createContext({ loaded: false })

export function StoreConfigProvider({ children }) {
  const [cfg, setCfg] = useState({ loaded: false })
  useEffect(() => {
    api.config().then((c) => setCfg({ ...c, loaded: true })).catch(() => setCfg({ loaded: true, offline: true }))
  }, [])
  return <Ctx.Provider value={cfg}>{children}</Ctx.Provider>
}

export const useStoreConfig = () => useContext(Ctx)
