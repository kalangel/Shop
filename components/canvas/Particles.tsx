'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 220;

const vertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aScale;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.12 * aSpeed + position.x * 2.0) * 0.5;
    p.x += cos(uTime * 0.09 * aSpeed + position.y * 1.5) * 0.35;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * (28.0 / -mv.z);
    vAlpha = smoothstep(9.0, 3.0, -mv.z) * 0.5 + 0.1;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vAlpha * 0.35;
    gl_FragColor = vec4(vec3(0.92, 0.9, 0.86), a);
  }
`;

/** Slow-drifting studio dust, rendered as soft additive sprites. */
export default function Particles() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, scales, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
      scales[i] = 0.4 + Math.random() * 1.4;
      speeds[i] = 0.5 + Math.random() * 1.6;
    }
    return { positions, scales, speeds };
  }, []);

  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
