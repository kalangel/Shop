'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  PerformanceMonitor,
  SpotLight,
} from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import Hoodie from './Hoodie';
import Particles from './Particles';
import { experienceProgress } from '@/lib/store';
import { computePhases } from '@/lib/phases';

/** Drives the camera along the scroll-mapped cinematic path. */
function CameraRig() {
  const look = useRef(new THREE.Vector3());

  useFrame((state) => {
    const { camX, camY, camZ, lookY, fov } = computePhases(experienceProgress.value);
    const cam = state.camera as THREE.PerspectiveCamera;

    // subtle hand-held parallax layered over the path
    const px = state.pointer.x * 0.16;
    const py = state.pointer.y * 0.1;

    cam.position.set(camX + px, camY + py, camZ);
    look.current.set(0, lookY, 0);
    cam.lookAt(look.current);

    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, fov, 0.12);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

function Studio() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[3.5, 5, 2.5]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#cfd4de" />

      {/* soft volumetric key from above */}
      <SpotLight
        position={[0, 5.5, 1.5]}
        angle={0.5}
        distance={9}
        attenuation={6}
        anglePower={5}
        intensity={0.7}
        opacity={0.14}
        color="#e8e6e1"
        castShadow={false}
      />

      {/* procedural studio environment — no external HDR */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
        <Lightformer intensity={1} position={[-5, 1, 1]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} color="#e8e2d6" />
        <Lightformer intensity={0.8} position={[5, 0, -1]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 3, 1]} color="#d7dae0" />
        <Lightformer intensity={0.5} position={[0, 1, -6]} scale={[10, 4, 1]} color="#b9b3a6" />
      </Environment>

      {/* reflective studio floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]}>
        <planeGeometry args={[26, 26]} />
        <MeshReflectorMaterial
          blur={[280, 90]}
          resolution={512}
          mixBlur={0.9}
          mixStrength={9}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#0a0a0b"
          metalness={0.4}
          mirror={0.6}
        />
      </mesh>
      <ContactShadows position={[0, -1.7, 0]} opacity={0.55} scale={9} blur={2.6} far={3.4} />
    </>
  );
}

function Effects({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField focusDistance={0.02} focalLength={0.16} bokehScale={2.2} />
      <Bloom intensity={0.28} luminanceThreshold={0.75} luminanceSmoothing={0.3} mipmapBlur />
      <Noise opacity={0.028} />
      <Vignette eskil={false} offset={0.18} darkness={0.78} />
    </EffectComposer>
  );
}

/**
 * The single WebGL scene behind the hero / deconstruction / reveal
 * scroll journey. Rendering degrades gracefully: the performance
 * monitor lowers DPR and, below a threshold, drops post-processing.
 */
export default function ExperienceCanvas() {
  const [dpr, setDpr] = useState(1.5);
  const [effects, setEffects] = useState(true);

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: [0.6, 0.4, 5.6], fov: 38 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={['#0c0c0c']} />
      <fog attach="fog" args={['#0c0c0c', 8, 16]} />
      <PerformanceMonitor
        onIncline={() => setDpr(1.75)}
        onDecline={() => {
          setDpr(1);
          setEffects(false);
        }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <Studio />
          <Hoodie />
          <Particles />
          <Effects enabled={effects} />
        </Suspense>
      </PerformanceMonitor>
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
