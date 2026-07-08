'use client';

import { useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { createFabricMaterial, useMetal } from './materials';
import type { GarmentCategory } from '@/lib/products';

type Vec3 = [number, number, number];

interface XForm {
  p: Vec3;
  r?: Vec3;
  s?: Vec3;
}

const Z: Vec3 = [0, 0, 0];
const ONE: Vec3 = [1, 1, 1];

interface FoldPartProps {
  fold: MutableRefObject<number>;
  worn: XForm;
  folded: XForm;
  children: ReactNode;
}

/** Interpolates a part between its worn and folded presentation. */
function FoldPart({ fold, worn, folded, children }: FoldPartProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const f = fold.current;
    const wr = worn.r ?? Z;
    const fr = folded.r ?? Z;
    const ws = worn.s ?? ONE;
    const fs = folded.s ?? ONE;
    g.position.set(
      THREE.MathUtils.lerp(worn.p[0], folded.p[0], f),
      THREE.MathUtils.lerp(worn.p[1], folded.p[1], f),
      THREE.MathUtils.lerp(worn.p[2], folded.p[2], f)
    );
    g.rotation.set(
      THREE.MathUtils.lerp(wr[0], fr[0], f),
      THREE.MathUtils.lerp(wr[1], fr[1], f),
      THREE.MathUtils.lerp(wr[2], fr[2], f)
    );
    g.scale.set(
      THREE.MathUtils.lerp(ws[0], fs[0], f),
      THREE.MathUtils.lerp(ws[1], fs[1], f),
      THREE.MathUtils.lerp(ws[2], fs[2], f)
    );
  });

  return <group ref={ref}>{children}</group>;
}

interface GarmentProps {
  category: GarmentCategory;
  /** target color, animated toward on change */
  color: string;
  /** true = folded presentation, false = worn */
  folded: boolean;
}

/**
 * Parametric garment model for the product viewer. Every category is
 * assembled from primitives sharing one animated fabric material, so
 * color changes glide and the cloth keeps breathing.
 */
export default function Garment({ category, color, folded }: GarmentProps) {
  const fold = useRef(0);
  const target = useMemo(() => new THREE.Color(), []);
  const group = useRef<THREE.Group>(null);

  const fabric = useMemo(
    () => createFabricMaterial(color, { roughness: 0.85, sheen: 0.45, sheenColor: '#8a8a90' }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const trim = useMemo(
    () => createFabricMaterial('#1b1b1e', { roughness: 0.95, sheen: 0.15, wobble: 0.004 }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const metal = useMetal('#b9b9bd');

  useFrame((state, delta) => {
    fabric.userData.uniforms.uTime.value = state.clock.elapsedTime;
    trim.userData.uniforms.uTime.value = state.clock.elapsedTime;

    target.set(color);
    fabric.color.lerp(target, 1 - Math.pow(0.001, delta));

    fold.current = THREE.MathUtils.damp(fold.current, folded ? 1 : 0, 4, delta);

    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
    }
  });

  return (
    <group ref={group}>
      {category === 'hoodie' || category === 'zip-hoodie' ? (
        <HoodieModel fold={fold} fabric={fabric} trim={trim} metal={metal} zip={category === 'zip-hoodie'} />
      ) : category === 'tshirt' ? (
        <TeeModel fold={fold} fabric={fabric} trim={trim} />
      ) : category === 'crewneck' ? (
        <CrewModel fold={fold} fabric={fabric} trim={trim} />
      ) : category === 'pants' || category === 'shorts' ? (
        <PantsModel fold={fold} fabric={fabric} trim={trim} short={category === 'shorts'} />
      ) : category === 'jacket' ? (
        <JacketModel fold={fold} fabric={fabric} trim={trim} metal={metal} />
      ) : category === 'cap' ? (
        <CapModel fold={fold} fabric={fabric} trim={trim} metal={metal} />
      ) : (
        <ToteModel fold={fold} fabric={fabric} trim={trim} />
      )}
    </group>
  );
}

interface ModelProps {
  fold: MutableRefObject<number>;
  fabric: THREE.Material;
  trim: THREE.Material;
  metal?: THREE.Material;
  zip?: boolean;
  short?: boolean;
}

function HoodieModel({ fold, fabric, trim, metal, zip }: ModelProps) {
  const hoodGeo = useMemo(
    () => new THREE.SphereGeometry(0.52, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.62),
    []
  );
  return (
    <>
      <FoldPart fold={fold} worn={{ p: [0, -0.18, 0] }} folded={{ p: [0, -0.3, 0], s: [1.12, 0.42, 1.15] }}>
        <mesh material={fabric} scale={[1, 1, 0.68]} castShadow>
          <capsuleGeometry args={[0.72, 1.15, 12, 32]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [0, 0.98, -0.08], r: [-0.5, 0, 0] }}
        folded={{ p: [0, 0.02, -0.2], r: [-1.5, 0, 0], s: [0.95, 0.6, 0.9] }}
      >
        <mesh material={fabric} scale={[1, 0.92, 1]} castShadow>
          <primitive object={hoodGeo} attach="geometry" />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [-0.78, 0.02, 0], r: [0, 0, -0.29] }}
        folded={{ p: [-0.28, -0.12, 0.3], r: [0.2, 1.15, 1.5], s: [0.9, 0.8, 0.9] }}
      >
        <mesh material={fabric} scale={[1, 1, 0.85]} castShadow>
          <capsuleGeometry args={[0.23, 1.1, 8, 24]} />
        </mesh>
        <mesh material={trim} position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.85, 1]}>
          <torusGeometry args={[0.2, 0.055, 10, 32]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [0.78, 0.02, 0], r: [0, 0, 0.29] }}
        folded={{ p: [0.28, -0.12, 0.3], r: [0.2, -1.15, -1.5], s: [0.9, 0.8, 0.9] }}
      >
        <mesh material={fabric} scale={[1, 1, 0.85]} castShadow>
          <capsuleGeometry args={[0.23, 1.1, 8, 24]} />
        </mesh>
        <mesh material={trim} position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.85, 1]}>
          <torusGeometry args={[0.2, 0.055, 10, 32]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [0, -0.68, 0.42] }}
        folded={{ p: [0, -0.45, 0.32], s: [1, 0.5, 0.8] }}
      >
        <RoundedBox args={[0.82, 0.44, 0.16]} radius={0.08} smoothness={4} material={trim} castShadow />
      </FoldPart>
      <FoldPart fold={fold} worn={{ p: [0, -1.06, 0] }} folded={{ p: [0, -0.62, 0], s: [1.05, 0.5, 1.05] }}>
        <mesh material={trim} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}>
          <torusGeometry args={[0.7, 0.07, 12, 48]} />
        </mesh>
      </FoldPart>
      {zip && metal && (
        <FoldPart fold={fold} worn={{ p: [0, 0.05, 0.48] }} folded={{ p: [0, -0.2, 0.42], s: [1, 0.45, 1] }}>
          <mesh material={metal} position={[0, 0.1, 0.06]}>
            <boxGeometry args={[0.03, 1.35, 0.04]} />
          </mesh>
          <mesh material={metal} position={[0, 0.66, 0.09]}>
            <boxGeometry args={[0.06, 0.11, 0.045]} />
          </mesh>
        </FoldPart>
      )}
    </>
  );
}

function TeeModel({ fold, fabric, trim }: ModelProps) {
  return (
    <>
      <FoldPart fold={fold} worn={{ p: [0, -0.1, 0] }} folded={{ p: [0, -0.3, 0], s: [1.1, 0.4, 1.12] }}>
        <mesh material={fabric} scale={[1, 1, 0.66]} castShadow>
          <capsuleGeometry args={[0.68, 1.05, 12, 32]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [-0.74, 0.32, 0], r: [0, 0, -0.55] }}
        folded={{ p: [-0.25, -0.2, 0.2], r: [0, 1.2, 1.6], s: [0.9, 0.6, 0.9] }}
      >
        <mesh material={fabric} scale={[1, 1, 0.85]} castShadow>
          <capsuleGeometry args={[0.22, 0.45, 8, 20]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [0.74, 0.32, 0], r: [0, 0, 0.55] }}
        folded={{ p: [0.25, -0.2, 0.2], r: [0, -1.2, -1.6], s: [0.9, 0.6, 0.9] }}
      >
        <mesh material={fabric} scale={[1, 1, 0.85]} castShadow>
          <capsuleGeometry args={[0.22, 0.45, 8, 20]} />
        </mesh>
      </FoldPart>
      <FoldPart fold={fold} worn={{ p: [0, 0.62, 0.05], r: [1.35, 0, 0] }} folded={{ p: [0, -0.05, 0.05], r: [1.5, 0, 0], s: [0.9, 0.9, 0.6] }}>
        <mesh material={trim}>
          <torusGeometry args={[0.32, 0.045, 10, 36]} />
        </mesh>
      </FoldPart>
    </>
  );
}

function CrewModel({ fold, fabric, trim }: ModelProps) {
  return (
    <>
      <FoldPart fold={fold} worn={{ p: [0, -0.15, 0] }} folded={{ p: [0, -0.3, 0], s: [1.1, 0.42, 1.12] }}>
        <mesh material={fabric} scale={[1, 1, 0.68]} castShadow>
          <capsuleGeometry args={[0.7, 1.1, 12, 32]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [-0.76, 0.0, 0], r: [0, 0, -0.3] }}
        folded={{ p: [-0.28, -0.15, 0.28], r: [0.2, 1.15, 1.5], s: [0.9, 0.75, 0.9] }}
      >
        <mesh material={fabric} scale={[1, 1, 0.85]} castShadow>
          <capsuleGeometry args={[0.22, 1.05, 8, 24]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [0.76, 0.0, 0], r: [0, 0, 0.3] }}
        folded={{ p: [0.28, -0.15, 0.28], r: [0.2, -1.15, -1.5], s: [0.9, 0.75, 0.9] }}
      >
        <mesh material={fabric} scale={[1, 1, 0.85]} castShadow>
          <capsuleGeometry args={[0.22, 1.05, 8, 24]} />
        </mesh>
      </FoldPart>
      <FoldPart fold={fold} worn={{ p: [0, 0.68, 0.02], r: [1.4, 0, 0] }} folded={{ p: [0, -0.02, 0.02], r: [1.5, 0, 0], s: [0.9, 0.9, 0.6] }}>
        <mesh material={trim}>
          <torusGeometry args={[0.34, 0.06, 10, 36]} />
        </mesh>
      </FoldPart>
      <FoldPart fold={fold} worn={{ p: [0, -0.98, 0] }} folded={{ p: [0, -0.58, 0], s: [1.05, 0.5, 1.05] }}>
        <mesh material={trim} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.7, 1]}>
          <torusGeometry args={[0.68, 0.065, 12, 48]} />
        </mesh>
      </FoldPart>
    </>
  );
}

function PantsModel({ fold, fabric, trim, short }: ModelProps) {
  const legLen = short ? 0.55 : 1.35;
  const legY = short ? -0.55 : -0.95;
  return (
    <>
      <FoldPart fold={fold} worn={{ p: [0, 0.55, 0] }} folded={{ p: [0, -0.15, 0], s: [1.1, 0.5, 1.1] }}>
        <mesh material={fabric} castShadow>
          <capsuleGeometry args={[0.55, 0.45, 10, 28]} />
        </mesh>
        <mesh material={trim} position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.52, 0.05, 10, 40]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [-0.3, legY, 0], r: [0, 0, 0.06] }}
        folded={{ p: [-0.16, -0.35, 0.1], r: [1.45, 0, 0.03], s: [1, 0.55, 1] }}
      >
        <mesh material={fabric} castShadow>
          <capsuleGeometry args={[0.26, legLen, 8, 24]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [0.3, legY, 0], r: [0, 0, -0.06] }}
        folded={{ p: [0.16, -0.35, 0.1], r: [1.45, 0, -0.03], s: [1, 0.55, 1] }}
      >
        <mesh material={fabric} castShadow>
          <capsuleGeometry args={[0.26, legLen, 8, 24]} />
        </mesh>
      </FoldPart>
    </>
  );
}

function JacketModel({ fold, fabric, trim, metal }: ModelProps) {
  return (
    <>
      <FoldPart fold={fold} worn={{ p: [0, -0.12, 0] }} folded={{ p: [0, -0.28, 0], s: [1.12, 0.45, 1.15] }}>
        <mesh material={fabric} scale={[1, 1, 0.72]} castShadow>
          <capsuleGeometry args={[0.76, 1.1, 12, 32]} />
        </mesh>
      </FoldPart>
      <FoldPart fold={fold} worn={{ p: [0, 0.62, 0.02], r: [1.25, 0, 0] }} folded={{ p: [0, -0.02, 0.02], r: [1.5, 0, 0], s: [0.9, 0.9, 0.6] }}>
        <mesh material={trim}>
          <torusGeometry args={[0.38, 0.085, 10, 36]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [-0.84, 0.0, 0], r: [0, 0, -0.32] }}
        folded={{ p: [-0.3, -0.12, 0.3], r: [0.2, 1.15, 1.5], s: [0.9, 0.75, 0.9] }}
      >
        <mesh material={fabric} scale={[1, 1, 0.85]} castShadow>
          <capsuleGeometry args={[0.26, 1.05, 8, 24]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [0.84, 0.0, 0], r: [0, 0, 0.32] }}
        folded={{ p: [0.3, -0.12, 0.3], r: [0.2, -1.15, -1.5], s: [0.9, 0.75, 0.9] }}
      >
        <mesh material={fabric} scale={[1, 1, 0.85]} castShadow>
          <capsuleGeometry args={[0.26, 1.05, 8, 24]} />
        </mesh>
      </FoldPart>
      {metal && (
        <FoldPart fold={fold} worn={{ p: [0, 0.0, 0.62] }} folded={{ p: [0, -0.18, 0.45], s: [1, 0.45, 1] }}>
          <mesh material={metal}>
            <boxGeometry args={[0.04, 1.35, 0.05]} />
          </mesh>
        </FoldPart>
      )}
    </>
  );
}

function CapModel({ fold, fabric, trim, metal }: ModelProps) {
  const crown = useMemo(
    () => new THREE.SphereGeometry(0.62, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.52),
    []
  );
  return (
    <>
      <FoldPart fold={fold} worn={{ p: [0, -0.1, 0] }} folded={{ p: [0, -0.15, 0], s: [1, 0.72, 1] }}>
        <mesh material={fabric} castShadow>
          <primitive object={crown} attach="geometry" />
        </mesh>
        <mesh material={trim} position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.035, 10, 44]} />
        </mesh>
        {metal && (
          <mesh material={metal} position={[0, 0.62, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
          </mesh>
        )}
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [0, -0.02, 0.62], r: [0.14, 0, 0] }}
        folded={{ p: [0, -0.06, 0.55], r: [0.55, 0, 0] }}
      >
        <mesh material={fabric} scale={[1, 0.12, 1]} castShadow>
          <cylinderGeometry args={[0.52, 0.58, 0.5, 32, 1, false, -Math.PI / 2, Math.PI]} />
        </mesh>
      </FoldPart>
    </>
  );
}

function ToteModel({ fold, fabric, trim }: ModelProps) {
  return (
    <>
      <FoldPart fold={fold} worn={{ p: [0, -0.25, 0] }} folded={{ p: [0, -0.4, 0], s: [1.05, 0.45, 1.2] }}>
        <RoundedBox args={[1.3, 1.45, 0.4]} radius={0.08} smoothness={4} material={fabric} castShadow />
        <mesh material={trim} position={[0, 0.25, 0.21]}>
          <planeGeometry args={[0.7, 0.02]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [-0.4, 0.72, 0], r: [Math.PI / 2, 0, 0] }}
        folded={{ p: [-0.4, 0.1, 0.1], r: [Math.PI / 2, 0, 1.4], s: [0.8, 0.8, 0.8] }}
      >
        <mesh material={trim}>
          <torusGeometry args={[0.34, 0.035, 10, 36, Math.PI]} />
        </mesh>
      </FoldPart>
      <FoldPart
        fold={fold}
        worn={{ p: [0.4, 0.72, 0], r: [Math.PI / 2, 0, 0] }}
        folded={{ p: [0.4, 0.1, 0.1], r: [Math.PI / 2, 0, -1.4], s: [0.8, 0.8, 0.8] }}
      >
        <mesh material={trim}>
          <torusGeometry args={[0.34, 0.035, 10, 36, Math.PI]} />
        </mesh>
      </FoldPart>
    </>
  );
}
