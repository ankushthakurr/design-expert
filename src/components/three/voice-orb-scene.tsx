"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Talking AI avatar: an audio-reactive orb.
 * `level` is a mutable ref (0..1) fed by a Web Audio analyser or a simulated voice,
 * so it updates every frame without React re-renders.
 */
export type LevelRef = { current: number };

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uLevel;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDisp;
  // Simplex-ish smooth noise
  vec3 hash(vec3 p){ p = vec3(dot(p,vec3(127.1,311.7,74.7)), dot(p,vec3(269.5,183.3,246.1)), dot(p,vec3(113.5,271.9,124.6))); return -1.0 + 2.0*fract(sin(p)*43758.5453123); }
  float noise(vec3 p){
    vec3 i = floor(p); vec3 f = fract(p); vec3 u = f*f*(3.0-2.0*f);
    return mix(mix(mix(dot(hash(i+vec3(0,0,0)),f-vec3(0,0,0)), dot(hash(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
                   mix(dot(hash(i+vec3(0,1,0)),f-vec3(0,1,0)), dot(hash(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
               mix(mix(dot(hash(i+vec3(0,0,1)),f-vec3(0,0,1)), dot(hash(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
                   mix(dot(hash(i+vec3(0,1,1)),f-vec3(0,1,1)), dot(hash(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
  }
  void main(){
    float n = noise(normal * 2.2 + uTime * 0.6);
    float n2 = noise(normal * 5.0 - uTime * 1.4);
    float d = n * (0.08 + uLevel * 0.35) + n2 * uLevel * 0.12;
    vDisp = d;
    vec3 p = position + normal * d;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uLevel;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDisp;
  void main(){
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
    vec3 a = vec3(0.0, 0.96, 1.0);
    vec3 b = vec3(0.48, 0.38, 1.0);
    vec3 c = vec3(0.0, 1.0, 0.62);
    vec3 col = mix(b, a, smoothstep(-0.1, 0.25, vDisp));
    col = mix(col, c, smoothstep(0.2, 0.45, vDisp) * uLevel);
    float glow = 0.25 + f * 1.2 + uLevel * 0.4;
    gl_FragColor = vec4(col * glow, 0.85);
  }
`;

function Orb({ level }: { level: LevelRef }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const smooth = useRef(0);
  useFrame(({ clock }) => {
    smooth.current += (level.current - smooth.current) * 0.2;
    if (mat.current) {
      mat.current.uniforms.uTime.value = clock.elapsedTime;
      mat.current.uniforms.uLevel.value = smooth.current;
    }
    if (mesh.current) {
      const s = 1 + smooth.current * 0.08;
      mesh.current.scale.setScalar(s);
      mesh.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 48]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={{ uTime: { value: 0 }, uLevel: { value: 0 } }} transparent />
    </mesh>
  );
}

function Rings({ level }: { level: LevelRef }) {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(() => [1.45, 1.7, 1.98], []);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((c, i) => {
      c.rotation.z = clock.elapsedTime * (0.2 + i * 0.1) * (i % 2 ? -1 : 1);
      const s = 1 + level.current * (0.05 + i * 0.04);
      c.scale.setScalar(s);
      const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = 0.18 + level.current * 0.35 - i * 0.04;
    });
  });
  return (
    <group ref={group} rotation={[Math.PI / 2.4, 0, 0]}>
      {rings.map((r, i) => (
        <mesh key={r}>
          <torusGeometry args={[r, 0.006 + i * 0.002, 8, 160]} />
          <meshBasicMaterial color={i === 1 ? "#7B61FF" : "#00F5FF"} transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Sparks({ level }: { level: LevelRef }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 380;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 1.6 + Math.random() * 1.4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * (0.05 + level.current * 0.6);
    (ref.current.material as THREE.PointsMaterial).opacity = 0.35 + level.current * 0.5;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#00F5FF" size={0.03} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function VoiceOrbScene({ level }: { level: LevelRef }) {
  return (
    <>
      <Orb level={level} />
      <Rings level={level} />
      <Sparks level={level} />
    </>
  );
}
