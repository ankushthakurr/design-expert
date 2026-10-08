"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGlobalPointer } from "./global-pointer";

function Rocket() {
  const group = useRef<THREE.Group>(null);
  const flame = useRef<THREE.Mesh>(null);
  const flameMat = useRef<THREE.ShaderMaterial>(null);

  const bodyGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    // Profile from tail to nose
    pts.push(new THREE.Vector2(0, -1.1));
    pts.push(new THREE.Vector2(0.32, -1.1));
    pts.push(new THREE.Vector2(0.4, -0.8));
    pts.push(new THREE.Vector2(0.44, -0.2));
    pts.push(new THREE.Vector2(0.42, 0.4));
    pts.push(new THREE.Vector2(0.34, 0.85));
    pts.push(new THREE.Vector2(0.2, 1.2));
    pts.push(new THREE.Vector2(0.06, 1.42));
    pts.push(new THREE.Vector2(0, 1.48));
    return new THREE.LatheGeometry(pts, 48);
  }, []);

  const finShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.42, -0.45);
    s.lineTo(0.42, -0.75);
    s.lineTo(0, -0.45);
    s.lineTo(0, 0);
    return new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: false });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.6) * 0.08;
      group.current.rotation.z = Math.sin(t * 0.8) * 0.04;
      group.current.rotation.y = t * 0.4;
    }
    if (flame.current) {
      const s = 1 + Math.sin(t * 30) * 0.08 + Math.sin(t * 17) * 0.06;
      flame.current.scale.set(1, s, 1);
    }
    if (flameMat.current) flameMat.current.uniforms.uTime.value = t;
  });

  return (
    <group ref={group}>
      <mesh geometry={bodyGeo}>
        <meshStandardMaterial color="#e8ecff" metalness={0.65} roughness={0.22} />
      </mesh>
      {/* Accent band */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.405, 0.42, 0.08, 48]} />
        <meshStandardMaterial color="#7B61FF" emissive="#7B61FF" emissiveIntensity={0.6} />
      </mesh>
      {/* Window */}
      <mesh position={[0, 0.2, 0.41]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#00F5FF" emissive="#00F5FF" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.2, 0.4]}>
        <torusGeometry args={[0.16, 0.025, 12, 40]} />
        <meshStandardMaterial color="#9aa3c7" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Fins */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} geometry={finShape} rotation={[0, (i * Math.PI * 2) / 3, 0]} position={[0, -0.45, 0]}>
          <meshStandardMaterial color="#7B61FF" metalness={0.5} roughness={0.3} emissive="#3b2a99" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* Flame */}
      <mesh ref={flame} position={[0, -1.55, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.26, 0.95, 32, 1, true]} />
        <shaderMaterial
          ref={flameMat}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          uniforms={{ uTime: { value: 0 } }}
          vertexShader={/* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
          fragmentShader={/* glsl */ `
            uniform float uTime; varying vec2 vUv;
            void main(){
              float y = vUv.y;
              float flick = 0.85 + 0.15*sin(uTime*40.0 + vUv.x*20.0);
              vec3 col = mix(vec3(0.0,1.0,0.62), vec3(0.0,0.96,1.0), y);
              col = mix(col, vec3(1.0), smoothstep(0.75,1.0,y));
              gl_FragColor = vec4(col, pow(y, 1.4) * flick);
            }`}
        />
      </mesh>
      <pointLight position={[0, -1.6, 0]} color="#00FF9D" intensity={6} distance={3} />
      <Exhaust />
    </group>
  );
}

function Exhaust() {
  const ref = useRef<THREE.Points>(null);
  const n = 160;
  const data = useMemo(() => Array.from({ length: n }, () => ({ t: Math.random(), x: (Math.random() - 0.5) * 0.3, z: (Math.random() - 0.5) * 0.3 })), []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    return g;
  }, []);
  useFrame((_, d) => {
    const arr = geo.attributes.position.array as Float32Array;
    data.forEach((p, i) => {
      p.t = (p.t + d * 0.9) % 1;
      const spread = 1 + p.t * 3;
      arr.set([p.x * spread, -1.6 - p.t * 2.2, p.z * spread], i * 3);
    });
    geo.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#9bf6ff" size={0.05} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function StarStreaks() {
  const ref = useRef<THREE.LineSegments>(null);
  const n = 140;
  const seeds = useMemo(() => Array.from({ length: n }, () => ({ x: (Math.random() - 0.5) * 12, y: (Math.random() - 0.5) * 10, z: -2 - Math.random() * 6, s: 2 + Math.random() * 4 })), []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 6), 3));
    return g;
  }, []);
  useFrame((_, d) => {
    const arr = geo.attributes.position.array as Float32Array;
    seeds.forEach((p, i) => {
      p.y -= d * p.s;
      if (p.y < -5) p.y = 5;
      arr.set([p.x, p.y, p.z, p.x, p.y + 0.25 + p.s * 0.06, p.z], i * 6);
    });
    geo.attributes.position.needsUpdate = true;
  });
  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color="#7B61FF" transparent opacity={0.45} />
    </lineSegments>
  );
}

function RevenueBars() {
  const group = useRef<THREE.Group>(null);
  const values = [0.35, 0.5, 0.48, 0.7, 0.85, 1.05, 1.3, 1.6];
  const start = useRef<number | null>(null);
  useFrame(({ clock }) => {
    if (start.current === null) start.current = clock.elapsedTime;
    const p = Math.min(1, (clock.elapsedTime - start.current) / 2.2);
    const ease = 1 - Math.pow(1 - p, 3);
    group.current?.children.forEach((c, i) => {
      if (c.userData.bar) {
        const h = values[i] * 2 * Math.min(1, Math.max(0, ease * 1.4 - i * 0.05));
        c.scale.y = Math.max(0.001, h);
        c.position.y = h / 2 - 1.2;
      }
    });
  });
  return (
    <group ref={group} position={[2.6, 0, -0.5]} rotation={[0, -0.35, 0]}>
      {values.map((_, i) => (
        <mesh key={i} position={[i * 0.3 - 1.05, -1.2, 0]} userData={{ bar: true }}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial
            color={i > 5 ? "#00FF9D" : i > 2 ? "#00F5FF" : "#7B61FF"}
            emissive={i > 5 ? "#00FF9D" : i > 2 ? "#00F5FF" : "#7B61FF"}
            emissiveIntensity={0.45}
            metalness={0.4}
            roughness={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
      <mesh position={[0, -1.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 0.8]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

export default function RocketScene() {
  const root = useRef<THREE.Group>(null);
  const pointer = useGlobalPointer();
  useFrame(() => {
    if (!root.current) return;
    root.current.rotation.y += (pointer.x * 0.25 - root.current.rotation.y) * 0.04;
  });
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-3, 1, 2]} intensity={20} color="#7B61FF" />
      <StarStreaks />
      <group ref={root}>
        <group position={[-0.9, 0.2, 0]} rotation={[0, 0, -0.18]}>
          <Rocket />
        </group>
        <RevenueBars />
      </group>
    </>
  );
}
