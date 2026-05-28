import { Canvas } from "@react-three/fiber"

import {
  Environment,
  Float,
} from "@react-three/drei"

import Ring3D from "./Ring3D"

export default function HeroCanvas() {
  return (
    <div className="hero-canvas hero-canvas-premium">
      <Canvas
        dpr={[1, 1.7]}
        camera={{
          position: [0, 0, 4],
          fov: 38,
        }}
      >
        <color attach="background" args={["#050505"]} />

        <ambientLight intensity={0.5} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={5}
        />

        <directionalLight
          position={[-4, -1, -3]}
          intensity={1.2}
          color="#8ad8df"
        />

        <Float
          speed={1.5}
          rotationIntensity={0.15}
          floatIntensity={0.2}
        >
          <Ring3D
            src="/eternal_ring.glb"
            applyMaterials={false}
            rotation={[0.05, -0.55, 0]}
            scale={1}
            position={[0, 0, 0]}
            autoRotate
            rotationSpeed={0.002}
          />
        </Float>

        <Environment preset="city" />
      </Canvas>
    </div>
  )
}