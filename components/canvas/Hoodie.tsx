'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useFabric, useMetal } from './materials';
import { experienceProgress } from '@/lib/store';
import { computePhases, seg } from '@/lib/phases';

interface PartDef {
  /** where the piece flies when the garment is deconstructed */
  offset: [number, number, number];
  spin: [number, number, number];
  /** phase for the independent floating motion while exploded */
  drift: number;
}

const PARTS = {
  hood: { offset: [0, 1.55, -0.6], spin: [0.45, 0.1, 0], drift: 0.0 },
  innerHood: { offset: [0.1, 1.15, 0.85], spin: [-0.6, 0, 0.1], drift: 1.3 },
  torso: { offset: [0, -0.45, -0.15], spin: [0, 0.35, 0], drift: 2.1 },
  sleeveL: { offset: [-1.9, 0.5, 0.35], spin: [0, 0, 0.9], drift: 3.0 },
  sleeveR: { offset: [1.9, 0.15, -0.35], spin: [0, 0, -0.9], drift: 4.2 },
  pocket: { offset: [0, -1.15, 1.35], spin: [0.55, 0, 0], drift: 5.1 },
  zipper: { offset: [0.15, 0.35, 1.95], spin: [0, 0, 0.45], drift: 0.7 },
  stitchHem: { offset: [0, -1.9, 0.65], spin: [1.1, 0, 0], drift: 1.9 },
  hoodSeam: { offset: [0, 2.3, 0.55], spin: [1.4, 0, 0], drift: 4.9 },
  cords: { offset: [0.45, 0.75, 1.55], spin: [0, 0, 0.9], drift: 5.8 },
} satisfies Record<string, PartDef>;

function usePart(name: keyof typeof PARTS, base: [number, number, number]) {
  const ref = useRef<THREE.Group>(null);
  const def = PARTS[name];

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const { explode } = computePhases(experienceProgress.value);
    const t = state.clock.elapsedTime;
    // each layer floats on its own rhythm once separated
    const fx = Math.sin(t * 0.7 + def.drift) * 0.05 * explode;
    const fy = Math.cos(t * 0.55 + def.drift * 2.0) * 0.06 * explode;
    g.position.set(
      base[0] + def.offset[0] * explode + fx,
      base[1] + def.offset[1] * explode + fy,
      base[2] + def.offset[2] * explode
    );
    g.rotation.set(def.spin[0] * explode, def.spin[1] * explode, def.spin[2] * explode);
  });

  return ref;
}

const SLEEVE_TILT = 0.29;

/**
 * The hero garment — built procedurally from primitives so every
 * layer (hood, sleeves, torso, pocket, stitching, zipper, lining)
 * is a separate object that can fly apart during the scroll.
 */
export default function Hoodie() {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const outer = useFabric('#232326', { roughness: 0.82, sheen: 0.5, sheenColor: '#8a8a90' });

  // acid-wash fabric scanned from the campaign photography
  const wash = useTexture('/textures/acid-wash.jpg');
  useMemo(() => {
    wash.wrapS = wash.wrapT = THREE.RepeatWrapping;
    wash.repeat.set(1.7, 1.7);
    wash.colorSpace = THREE.SRGBColorSpace;
    outer.map = wash;
    outer.color.set('#96969b'); // map multiplies against a muted base to stay matte
    outer.needsUpdate = true;
  }, [wash, outer]);
  const inner = useFabric('#121214', { roughness: 1, sheen: 0.1, wobble: 0.008 });
  const rib = useFabric('#2c2c30', { roughness: 0.95, sheen: 0.2, wobble: 0.004 });
  const cord = useFabric('#cbbfa9', { roughness: 0.9, sheen: 0.1, wobble: 0.003 });
  const metal = useMetal('#b9b9bd');

  const hood = usePart('hood', [0, 0.98, -0.08]);
  const innerHood = usePart('innerHood', [0, 0.98, -0.06]);
  const torso = usePart('torso', [0, -0.18, 0]);
  const sleeveL = usePart('sleeveL', [-0.78, 0.02, 0]);
  const sleeveR = usePart('sleeveR', [0.78, 0.02, 0]);
  const pocket = usePart('pocket', [0, -0.68, 0.42]);
  const zipper = usePart('zipper', [0, 0.05, 0.48]);
  const stitchHem = usePart('stitchHem', [0, -1.06, 0]);
  const hoodSeam = usePart('hoodSeam', [0, 1.02, 0.32]);
  const cords = usePart('cords', [0, 0.68, 0.42]);

  const hoodGeo = useMemo(() => new THREE.SphereGeometry(0.52, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.62), []);
  const innerHoodGeo = useMemo(() => new THREE.SphereGeometry(0.46, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.6), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, state.pointer.x, 0.04);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, state.pointer.y, 0.04);

    // the model stays out of the hero — it materialises as the
    // scroll hands over from the campaign photography
    const presence = seg(experienceProgress.value, 0.1, 0.2);
    g.visible = presence > 0.02;
    g.scale.setScalar(0.7 + 0.3 * presence);

    // idle breath + subtle mouse parallax
    g.position.y = Math.sin(t * 0.55) * 0.05 - (1 - presence) * 0.7;
    g.rotation.y = pointer.current.x * 0.12 + Math.sin(t * 0.18) * 0.05;
    g.rotation.x = -pointer.current.y * 0.07;
  });

  return (
    <group ref={group}>
      {/* torso — flattened front-to-back so it drapes like cloth */}
      <group ref={torso}>
        <mesh material={outer} scale={[1, 1, 0.68]} castShadow receiveShadow>
          <capsuleGeometry args={[0.72, 1.15, 12, 32]} />
        </mesh>
      </group>

      {/* hood */}
      <group ref={hood}>
        <mesh material={outer} rotation={[-0.5, 0, 0]} scale={[1, 0.92, 1]} castShadow>
          <primitive object={hoodGeo} attach="geometry" />
        </mesh>
      </group>

      {/* inner lining */}
      <group ref={innerHood}>
        <mesh material={inner} rotation={[-0.5, 0, 0]} scale={[0.94, 0.86, 0.95]}>
          <primitive object={innerHoodGeo} attach="geometry" />
        </mesh>
      </group>

      {/* sleeves hang alongside the body, cuffs ride at their ends */}
      <group ref={sleeveL}>
        <group rotation={[0, 0, -SLEEVE_TILT]}>
          <mesh material={outer} scale={[1, 1, 0.85]} castShadow>
            <capsuleGeometry args={[0.23, 1.1, 8, 24]} />
          </mesh>
          <mesh material={rib} position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.85, 1]}>
            <torusGeometry args={[0.2, 0.055, 10, 32]} />
          </mesh>
        </group>
      </group>
      <group ref={sleeveR}>
        <group rotation={[0, 0, SLEEVE_TILT]}>
          <mesh material={outer} scale={[1, 1, 0.85]} castShadow>
            <capsuleGeometry args={[0.23, 1.1, 8, 24]} />
          </mesh>
          <mesh material={rib} position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.85, 1]}>
            <torusGeometry args={[0.2, 0.055, 10, 32]} />
          </mesh>
        </group>
      </group>

      {/* kangaroo pocket */}
      <group ref={pocket}>
        <RoundedBox args={[0.82, 0.44, 0.16]} radius={0.08} smoothness={4} material={rib} castShadow />
      </group>

      {/* zipper strip + pull */}
      <group ref={zipper}>
        <mesh material={metal} position={[0, 0.12, 0.06]}>
          <boxGeometry args={[0.03, 1.35, 0.04]} />
        </mesh>
        <mesh material={metal} position={[0, 0.72, 0.09]}>
          <boxGeometry args={[0.06, 0.11, 0.045]} />
        </mesh>
        <mesh material={metal} position={[0, 0.6, 0.1]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.04, 0.011, 8, 24]} />
        </mesh>
      </group>

      {/* stitching — hem rib and hood seam */}
      <group ref={stitchHem}>
        <mesh material={rib} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}>
          <torusGeometry args={[0.7, 0.07, 12, 48]} />
        </mesh>
      </group>
      <group ref={hoodSeam}>
        <mesh material={rib} rotation={[1.05, 0, 0]}>
          <torusGeometry args={[0.38, 0.028, 8, 40]} />
        </mesh>
      </group>

      {/* drawcords */}
      <group ref={cords}>
        <mesh material={cord} position={[-0.15, -0.18, 0.07]} rotation={[0.15, 0, 0.1]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
        </mesh>
        <mesh material={cord} position={[0.15, -0.2, 0.07]} rotation={[0.15, 0, -0.12]}>
          <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
        </mesh>
        <mesh material={cord} position={[-0.16, -0.4, 0.1]}>
          <sphereGeometry args={[0.03, 12, 12]} />
        </mesh>
        <mesh material={cord} position={[0.17, -0.44, 0.1]}>
          <sphereGeometry args={[0.03, 12, 12]} />
        </mesh>
      </group>
    </group>
  );
}
