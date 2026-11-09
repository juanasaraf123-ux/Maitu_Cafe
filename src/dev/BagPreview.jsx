import Bag3D from '../components/three/Bag3D.jsx'
/** Vista de prueba de la bolsa 3D (solo desarrollo: /dev/bolsa). */
export default function BagPreview() {
  return (
    <main style={{ height: '100vh', background: 'radial-gradient(circle at 50% 40%, #4a2e1f, #1a100b)', color: '#fbf6ef', display: 'grid' }}>
      <Bag3D />
    </main>
  )
}
