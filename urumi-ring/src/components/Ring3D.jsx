import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

const METALS_MAT = {
  white: { color: "#e8e5df", roughness: 0.16, env: 2.2 },
  yellow: { color: "#d7ad4d", roughness: 0.1, env: 3.6 },
  rose: { color: "#d99a8a", roughness: 0.12, env: 3.2 },
  platinum: { color: "#ccd1d8", roughness: 0.18, env: 2.6 },
  palladium: { color: "#b7bcc3", roughness: 0.24, env: 2.1 },
}

const STONE_NAMES = {
  StoneRound: "round",
  StoneOval: "oval",
  StonePear: "pear",
  StonePrincess: "princess",
}

function isStoneMesh(name) {
  return Object.prototype.hasOwnProperty.call(STONE_NAMES, name)
}

export default function Ring3D({
  src = "/ring_4.glb",
  metal = "rose",
  stone = "round",
  applyMaterials = true,
  autoRotate = false,
  rotationSpeed = 0.004,
  rotation = [0.08, -0.32, 0],
  scale = 1.1,
  position = [0, 0, 0],
}) {
  const { scene } = useGLTF(src)
  const groupRef = useRef()
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed
    }
  })

  useEffect(() => {
    if (!applyMaterials) {
      clonedScene.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true
          obj.receiveShadow = true
        }
      })
      return
    }

    const metalMaterial = new THREE.MeshPhysicalMaterial({
      color: METALS_MAT[metal].color,
      metalness: 0.92,
      roughness: METALS_MAT[metal].roughness,
      envMapIntensity: METALS_MAT[metal].env,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    })

    const stoneMaterial = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      transmission: 0.9,
      ior: 2.42,
      thickness: 0.36,
      roughness: 0,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
      envMapIntensity: 3.4,
      transparent: true,
      side: THREE.DoubleSide,
      attenuationDistance: 0.4,
      attenuationColor: "#ffffff",
    })

    clonedScene.traverse((obj) => {
      if (isStoneMesh(obj.name)) {
        obj.visible = STONE_NAMES[obj.name] === stone
      }

      if (!obj.isMesh) return

      if (isStoneMesh(obj.name)) {
        obj.material = stoneMaterial
        return
      }

      obj.material = metalMaterial
    })
  }, [applyMaterials, clonedScene, metal, stone])

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  )
}

useGLTF.preload("/ring_4.glb")
