import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTarget } from '../animations/smoothScroll.js'
import HeroVideo from '../components/hero/HeroVideo.jsx'
import StorySection from '../components/sections/StorySection.jsx'
import ProcessSection from '../components/sections/ProcessSection.jsx'
import ProductsSection from '../components/sections/ProductsSection.jsx'
import PrepSection from '../components/sections/PrepSection.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import Marquee from '../components/fx/Marquee.jsx'
import Wave from '../components/fx/Wave.jsx'

/** Inicio: video + historia, proceso, cafés y preparación. */
export default function HomePage({ introDone, onReady, reducedMotion }) {
  usePageTitle(null)
  const { hash } = useLocation()

  // Si se llega desde otra página a /#seccion, desplazarse al cargar.
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => scrollToTarget(hash, { immediate: true }), 50)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <main>
      <HeroVideo introDone={introDone} onReady={onReady} reducedMotion={reducedMotion} />
      <Marquee items={['Del origen <i>a tu taza</i>', 'Café de Colombia', '<i>by</i> Nicolas Bernal', 'Grano · Molido']} />
      <StorySection />
      <ProcessSection />
      <div className="wave-wrap wave-wrap--to-caramel"><Wave color="#d9a86c" /></div>
      <ProductsSection />
      <Marquee alt items={['Recién molido', 'Filtrado a mano', 'Hecho con paciencia', 'Maitú Café']} />
      <PrepSection />
      <div className="wave-wrap wave-wrap--to-dark"><Wave color="#1a100b" /></div>
    </main>
  )
}
