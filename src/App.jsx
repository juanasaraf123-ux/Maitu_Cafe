import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ScrollTrigger } from './animations/gsap.js'
import { destroySmoothScroll, initSmoothScroll, scrollToTarget } from './animations/smoothScroll.js'
import { useReducedMotion } from './hooks/useReducedMotion.js'
import { CartProvider } from './store/CartContext.jsx'
import { StoreConfigProvider, useStoreConfig } from './store/StoreConfig.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import HeroIntro from './components/hero/HeroIntro.jsx'
import HomePage from './pages/HomePage.jsx'
import CartDrawer from './components/shop/CartDrawer.jsx'

// La tienda y el panel se cargan solo cuando se visitan (división de código).
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'))
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'))
const OrderPage = lazy(() => import('./pages/OrderPage.jsx'))
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'))

export default function App() {
  return (
    <StoreConfigProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </StoreConfigProvider>
  )
}

function DemoBanner() {
  const { demo } = useStoreConfig()
  return demo ? <p className="demo-banner">Modo de prueba: precios, stock y productos de ejemplo. No son datos reales de Maitú.</p> : null
}

function Shell() {
  const reducedMotion = useReducedMotion()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')
  const [firstFrame, setFirstFrame] = useState(false)
  // La apertura con el logo solo se muestra al entrar por el inicio.
  const [introDone, setIntroDone] = useState(reducedMotion || !isHome)

  useEffect(() => {
    initSmoothScroll({ reducedMotion })
    return () => destroySmoothScroll()
  }, [reducedMotion])

  // Al cambiar de página: arriba del todo y recalcular animaciones.
  useEffect(() => {
    if (!window.location.hash) scrollToTarget(0, { immediate: true })
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])

  // Enlaces a secciones del inicio (#historia o /#historia) con scroll suave.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"], a[href^="/#"]')
      if (!a || e.metaKey || e.ctrlKey) return
      const hash = a.getAttribute('href').replace(/^\//, '')
      if (hash.length < 2) return
      e.preventDefault()
      if (window.location.pathname !== '/') return navigate(`/${hash}`)
      const target = document.querySelector(hash)
      if (target) scrollToTarget(target)
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  useEffect(() => { document.fonts?.ready.then(() => ScrollTrigger.refresh()) }, [])

  const onIntroDone = useCallback(() => setIntroDone(true), [])
  const onFirstFrame = useCallback(() => setFirstFrame(true), [])

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <DemoBanner />
      {isHome && !introDone && <HeroIntro ready={firstFrame} onDone={onIntroDone} />}
      {!isAdmin && <Navbar visible={introDone} overHero={isHome} />}
      <div id="contenido">
        <Suspense fallback={<main className="page container"><p className="muted">Cargando…</p></main>}>
          <Routes>
            <Route path="/" element={<HomePage introDone={introDone} onReady={onFirstFrame} reducedMotion={reducedMotion} />} />
            <Route path="/tienda" element={<ShopPage />} />
            <Route path="/tienda/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pedido" element={<OrderPage />} />
            <Route path="/pedido/:code" element={<OrderPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<main className="page container"><h1 className="page__title">Página no encontrada</h1><a href="/">Volver al inicio</a></main>} />
          </Routes>
        </Suspense>
      </div>
      {!isAdmin && <Footer />}
      {!isAdmin && <CartDrawer />}
    </>
  )
}
