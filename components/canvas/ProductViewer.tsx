'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Html,
  Lightformer,
  OrbitControls,
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import Garment from './Garment';
import type { Product } from '@/lib/products';

interface Props {
  product: Product;
  colorHex: string;
  folded: boolean;
  showHotspots: boolean;
}

function Hotspot({ position, title, note }: { position: [number, number, number]; title: string; note: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Html position={position} center distanceFactor={5} zIndexRange={[30, 0]}>
      <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <button
          className="flex h-5 w-5 items-center justify-center rounded-full border border-bone/50 bg-ink/60 backdrop-blur-sm transition-transform duration-500 hover:scale-125"
          data-cursor
          aria-label={title}
        >
          <span className="h-1 w-1 animate-pulse rounded-full bg-bone" />
        </button>
        <div
          className={`absolute left-7 top-1/2 w-40 -translate-y-1/2 rounded-sm border border-bone/10 bg-ink/85 p-3 backdrop-blur-md transition-all duration-500 ease-luxe ${
            open ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0'
          }`}
        >
          <p className="font-sans text-[0.55rem] tracking-wider2 uppercase text-bone">{title}</p>
          <p className="mt-1 font-sans text-[0.6rem] leading-relaxed text-warmgray">{note}</p>
        </div>
      </div>
    </Html>
  );
}

/**
 * Fullscreen interactive viewer — rotate, zoom, recolor and inspect
 * the garment, or flip it between worn and folded presentation.
 */
export default function ProductViewer({ product, colorHex, folded, showHotspots }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [1.8, 0.55, 4.4], fov: 40 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#0e0e0f']} />
      <fog attach="fog" args={['#0e0e0f', 7, 14]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4.5, 2.5]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -3]} intensity={0.45} color="#cfd4de" />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
        <Lightformer intensity={0.9} position={[-5, 1, 1]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} color="#e8e2d6" />
        <Lightformer intensity={0.7} position={[5, 0, -1]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 3, 1]} color="#d7dae0" />
      </Environment>

      <Suspense fallback={null}>
        <Garment category={product.category} color={colorHex} folded={folded} />
        {showHotspots &&
          !folded &&
          product.hotspots.map((h) => (
            <Hotspot key={h.title} position={h.position} title={h.title} note={h.note} />
          ))}
      </Suspense>

      <ContactShadows position={[0, -1.65, 0]} opacity={0.5} scale={8} blur={2.4} far={3} />

      <OrbitControls
        enablePan={false}
        minDistance={2.6}
        maxDistance={7}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.72}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.06}
      />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.22} luminanceThreshold={0.8} mipmapBlur />
        <Noise opacity={0.025} />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
