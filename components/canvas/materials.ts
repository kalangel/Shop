'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface FabricOptions {
  /** amplitude of the cloth micro-movement */
  wobble?: number;
  roughness?: number;
  sheen?: number;
  sheenColor?: string;
}

/**
 * A physically based fabric material with a GLSL vertex displacement
 * injected via onBeforeCompile — the surface breathes like cloth in
 * still air. One uTime uniform is shared through userData so the
 * caller can advance it every frame.
 */
export function createFabricMaterial(color: string, opts: FabricOptions = {}) {
  const { wobble = 0.012, roughness = 0.85, sheen = 0.35, sheenColor = '#6b6b6b' } = opts;

  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness: 0.02,
    sheen,
    sheenColor: new THREE.Color(sheenColor),
    sheenRoughness: 0.7,
  });

  const uniforms = { uTime: { value: 0 }, uAmp: { value: wobble } };
  mat.userData.uniforms = uniforms;

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uAmp = uniforms.uAmp;
    shader.vertexShader =
      `uniform float uTime;\nuniform float uAmp;\n` +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          float w1 = sin(position.y * 5.0 + uTime * 1.25);
          float w2 = cos(position.x * 4.0 + position.z * 3.0 + uTime * 0.85);
          transformed += normal * (w1 * w2) * uAmp;
        }`
      );
  };
  mat.customProgramCacheKey = () => 'mono-fabric';

  return mat;
}

/** Hook variant: memoized material whose time uniform is driven by the render loop. */
export function useFabric(color: string, opts: FabricOptions = {}) {
  const mat = useMemo(() => createFabricMaterial(color, opts), []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state) => {
    mat.userData.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return mat;
}

export function useMetal(color = '#b9b9bd') {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.9,
        roughness: 0.28,
        envMapIntensity: 1.4,
      }),
    [color]
  );
}
