import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer, PresentationControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Bolsa de café Maitú en 3D, construida con las medidas reales del empaque
 * (14 × 20 × 7,5 cm) y su arte original en las cinco caras.
 *
 * Forma de "bolsa con fuelle": frente y reverso abombados, costados que se
 * cierran hacia el sellado superior, base plana y sello dentado arriba.
 */
const W = 1.4
const H = 2.0
const D = 0.75
const SEAL = 0.16 // alto del sello superior
const TEX = {
  front: '/media/3d/bolsa-frente.webp',
  back: '/media/3d/bolsa-reverso.webp',
  left: '/media/3d/bolsa-lado-recetas.webp',
  right: '/media/3d/bolsa-lado-colombia.webp',
  bottom: '/media/3d/bolsa-base.webp',
}

/** Media profundidad según la altura: constante en el cuerpo, se cierra arriba. */
function halfDepth(y) {
  const top = H / 2 - SEAL
  const start = top - 0.42
  if (y <= start) return D / 2
  const t = Math.min(1, (y - start) / (top - start))
  // Curva suave (coseno): la bolsa se "desinfla" hacia el sello, sin aristas rectas.
  const e = 0.5 + 0.5 * Math.cos(Math.PI * Math.pow(t, 0.85))
  return Math.max(0.014, (D / 2) * e)
}

/** Abombado del frente/reverso: máximo al centro, cero en los bordes. */
function bulge(x, y) {
  const nx = (2 * x) / W
  const top = H / 2 - SEAL
  const ny = THREE.MathUtils.clamp((y + H / 2) / (top + H / 2), 0, 1)
  const vertical = Math.sin(Math.PI * Math.pow(ny, 0.9)) * 0.9 + 0.1
  return 0.13 * (1 - Math.pow(Math.abs(nx), 2.4)) * vertical
}

function panelGeometry(side) {
  const g = new THREE.PlaneGeometry(W, H - SEAL, 40, 60)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i) - SEAL / 2
    const z = halfDepth(y) + bulge(x, y) * Math.min(1, halfDepth(y) / (D / 2) + 0.25)
    p.setXYZ(i, side === 'front' ? x : -x, y, side === 'front' ? z : -z)
  }
  g.computeVertexNormals()
  return g
}

function gussetGeometry(side) {
  const g = new THREE.PlaneGeometry(D, H - SEAL, 20, 60)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i) / (D / 2) // -1..1 a lo ancho del costado
    const y = p.getY(i) - SEAL / 2
    const hd = halfDepth(y)
    // El costado se hunde un poco hacia adentro al cerrarse (pliegue del fuelle).
    const fold = (1 - hd / (D / 2)) * 0.2 * (1 - u * u) + 0.03 * (1 - u * u)
    const x = side === 'right' ? W / 2 - fold : -(W / 2 - fold)
    const z = side === 'right' ? -u * hd : u * hd
    p.setXYZ(i, x, y, z)
  }
  g.computeVertexNormals()
  return g
}

function Bag({ autoRotate }) {
  const group = useRef()
  const maps = useTexture(TEX)
  Object.values(maps).forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
  })

  const geo = useMemo(() => ({
    front: panelGeometry('front'),
    back: panelGeometry('back'),
    left: gussetGeometry('left'),
    right: gussetGeometry('right'),
  }), [])

  const mat = (map) => new THREE.MeshPhysicalMaterial({ map, roughness: 0.48, clearcoat: 0.45, clearcoatRoughness: 0.35, side: THREE.DoubleSide })
  const materials = useMemo(() => ({
    front: mat(maps.front),
    back: mat(maps.back),
    left: mat(maps.left),
    right: mat(maps.right),
    bottom: mat(maps.bottom),
    seal: new THREE.MeshPhysicalMaterial({ color: '#1f4b7f', roughness: 0.55, clearcoat: 0.3 }),
  }), [maps])

  useFrame((_, dt) => {
    if (autoRotate && group.current) group.current.rotation.y += dt * 0.35
  })

  return (
    <group ref={group} rotation={[0, -0.45, 0]}>
      <mesh geometry={geo.front} material={materials.front} castShadow />
      <mesh geometry={geo.back} material={materials.back} castShadow />
      <mesh geometry={geo.left} material={materials.left} />
      <mesh geometry={geo.right} material={materials.right} />
      {/* Base */}
      <mesh position={[0, -H / 2, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.bottom}>
        <planeGeometry args={[W, D]} />
      </mesh>
      {/* Sello superior con dientes */}
      <mesh position={[0, H / 2 - SEAL / 2 + 0.005, 0]} material={materials.seal}>
        <boxGeometry args={[W, SEAL, 0.03]} />
      </mesh>
      {Array.from({ length: 28 }, (_, i) => (
        <mesh key={i} position={[-W / 2 + (i + 0.5) * (W / 28), H / 2 + 0.008, 0]} rotation={[0, 0, Math.PI / 4]} material={materials.seal}>
          <boxGeometry args={[0.03, 0.03, 0.03]} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Escena completa: luces de estudio generadas localmente (sin descargar
 * mapas), sombra de contacto, flotación suave y giro con el mouse o el dedo.
 */
export default function CoffeeBagScene({ autoRotate = true, float = true, interactive = true, glow = '#d9a86c' }) {
  const bag = <Bag autoRotate={autoRotate} />
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color={glow} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 3, 4]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2} color={glow} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[5, 1, -2]} rotation-y={-Math.PI / 2} scale={[3, 5, 1]} />
        <Lightformer form="ring" intensity={2} position={[0, -3, 3]} scale={2} />
      </Environment>
      {interactive ? (
        <PresentationControls global snap rotation={[0, 0, 0]} polar={[-0.25, 0.25]} azimuth={[-Math.PI, Math.PI]} config={{ mass: 1, tension: 170, friction: 26 }}>
          {float ? <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.6}>{bag}</Float> : bag}
        </PresentationControls>
      ) : float ? <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.6}>{bag}</Float> : bag}
      <ContactShadows position={[0, -1.25, 0]} opacity={0.45} scale={6} blur={2.6} far={2.5} color="#1a100b" />
    </>
  )
}
