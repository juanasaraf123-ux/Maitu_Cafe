import { Canvas } from '@react-three/fiber'
import CoffeeBagScene from './CoffeeBag.jsx'

/** Lienzo WebGL de la bolsa. `active=false` detiene el dibujo fuera de pantalla. */
export default function BagCanvas({ active, ...props }) {
  return (
    <Canvas
      className="bag3d__canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      shadows
      camera={{ position: [0, 0.15, 5.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <CoffeeBagScene {...props} />
    </Canvas>
  )
}
