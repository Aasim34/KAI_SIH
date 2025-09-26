"use client"

import * as THREE from 'three'
import { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Float, PerspectiveCamera } from '@react-three/drei'

function Model(props: any) {
  const { scene } = useGLTF('/kai-robot.glb')

  useFrame((state) => {
    // Make the model gently look towards the mouse
    const x = (state.mouse.x * -0.2) 
    const y = (state.mouse.y * -0.2)
    const head = scene.getObjectByName('Head')
    if (head) {
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, x, THREE.MathUtils.damp(0, 1, 8, 0.1))
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, y, THREE.MathUtils.damp(0, 1, 8, 0.1))
    }
  })

  return <primitive object={scene} {...props} />
}

export function KaiAvatar3D() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0.5, 5]} fov={30} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[1, 2, 3]} intensity={4} />
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
            <Model scale={2} />
        </Float>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.5} />
    </Canvas>
  )
}

useGLTF.preload('/kai-robot.glb')