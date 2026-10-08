"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useGlobalPointer } from "./global-pointer";

/* Deterministic PRNG so the brain looks identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Samples points on a brain-like surface: two folded hemispheres with a central fissure. */
function buildBrain(count: number) {
  const rand = mulberry32(7);
  const pts: THREE.Vector3[] = [];
  while (pts.length < count) {
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    let x = r * Math.cos(theta);
    let y = u;
    let z = r * Math.sin(theta);
    // Gyri: folded surface detail
    const fold = 1 + 0.07 * Math.sin(7 * x + 3 * y) * Math.cos(6 * z - 2 * y) + 0.04 * Math.sin(13 * y + 5 * z);
    x *= 1.25 * fold;
    y *= 0.95 * fold;
    z *= 1.05 * fold;
    // Flatten bottom slightly, separate hemispheres
    if (y < -0.4) y = -0.4 + (y + 0.4) * 0.6;
    x += Math.sign(x) * 0.12;
    if (Math.abs(x) < 0.16) continue;
    // Some interior points for depth
    const inner = rand() < 0.18 ? 0.55 + rand() * 0.35 : 1;
    pts.push(new THREE.Vector3(x * inner, y * inner + 0.05, z * inner));
  }
  return pts;
}

function buildEdges(pts: THREE.Vector3[], maxDist: number, maxPerNode: number) {
  const edges: [number, number][] = [];
  const degree = new Array(pts.length).fill(0);
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (degree[i] >= maxPerNode) break;
      if (degree[j] >= maxPerNode) continue;
      if (pts[i].distanceToSquared(pts[j]) < maxDist * maxDist) {
        edges.push([i, j]);
        degree[i]++;
        degree[j]++;
      }
    }
  }
  return edges;
}

const pointVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p += normalize(position) * sin(uTime * 1.2 + aSeed * 6.283) * 0.015;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 0.55 + 0.45 * sin(uTime * 2.0 + aSeed * 40.0);
    gl_PointSize = uSize * (0.6 + tw * 0.8) * (1.0 / -mv.z);
    float t = clamp((position.x + 1.5) / 3.0, 0.0, 1.0);
    vColor = mix(vec3(0.0, 0.96, 1.0), vec3(0.48, 0.38, 1.0), t);
    vColor = mix(vColor, vec3(0.0, 1.0, 0.62), smoothstep(0.75, 1.0, aSeed));
    vAlpha = tw;
  }
`;
const pointFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

function NeuralBrain() {
  const group = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Points>(null);
  const pointsMat = useRef<THREE.ShaderMaterial>(null);
  const pointer = useGlobalPointer();

  const { pointGeo, lineGeo, pts, edges, adjacency } = useMemo(() => {
    const pts = buildBrain(820);
    const edges = buildEdges(pts, 0.32, 4);
    const pos = new Float32Array(pts.length * 3);
    const seeds = new Float32Array(pts.length);
    pts.forEach((p, i) => {
      pos.set([p.x, p.y, p.z], i * 3);
      seeds[i] = (i * 0.618034) % 1;
    });
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pointGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const lpos = new Float32Array(edges.length * 6);
    const lcol = new Float32Array(edges.length * 6);
    const cA = new THREE.Color("#00F5FF");
    const cB = new THREE.Color("#7B61FF");
    edges.forEach(([a, b], i) => {
      lpos.set([pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z], i * 6);
      const ca = cA.clone().lerp(cB, (pts[a].x + 1.5) / 3);
      const cb = cA.clone().lerp(cB, (pts[b].x + 1.5) / 3);
      lcol.set([ca.r, ca.g, ca.b, cb.r, cb.g, cb.b], i * 6);
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(lpos, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lcol, 3));

    const adjacency: number[][] = pts.map(() => []);
    edges.forEach(([a, b]) => {
      adjacency[a].push(b);
      adjacency[b].push(a);
    });
    return { pointGeo, lineGeo, pts, edges, adjacency };
  }, []);

  // Signals travelling along synapses
  const PULSES = 70;
  const pulses = useMemo(() => {
    const rand = mulberry32(42);
    return Array.from({ length: PULSES }, () => {
      const e = edges[Math.floor(rand() * edges.length)];
      return { from: e[0], to: e[1], t: rand(), speed: 0.6 + rand() * 1.2 };
    });
  }, [edges]);
  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (pointsMat.current) pointsMat.current.uniforms.uTime.value = t;
    if (group.current) {
      const targetY = pointer.x * 0.5 + t * 0.08;
      const targetX = -pointer.y * 0.25;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
    }
    const arr = pulseGeo.attributes.position.array as Float32Array;
    pulses.forEach((p, i) => {
      p.t += delta * p.speed;
      if (p.t >= 1) {
        const next = adjacency[p.to];
        p.from = p.to;
        p.to = next.length ? next[Math.floor(Math.random() * next.length)] : p.from;
        p.t = 0;
      }
      const a = pts[p.from];
      const b = pts[p.to];
      arr[i * 3] = a.x + (b.x - a.x) * p.t;
      arr[i * 3 + 1] = a.y + (b.y - a.y) * p.t;
      arr[i * 3 + 2] = a.z + (b.z - a.z) * p.t;
    });
    pulseGeo.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={group} scale={1.25}>
      <points geometry={pointGeo}>
        <shaderMaterial
          ref={pointsMat}
          vertexShader={pointVertex}
          fragmentShader={pointFragment}
          uniforms={{ uTime: { value: 0 }, uSize: { value: 22 } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial vertexColors transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <points ref={pulseRef} geometry={pulseGeo}>
        <pointsMaterial color="#ffffff" size={0.06} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
      <CoreGlow />
    </group>
  );
}

function CoreGlow() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh scale={[1.1, 0.85, 0.95]}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={/* glsl */ `
          varying vec3 vN; varying vec3 vV;
          void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime; varying vec3 vN; varying vec3 vV;
          void main(){
            float f = 1.0 - max(dot(vN, vV), 0.0);
            float inner = pow(1.0 - f, 3.0) * (0.18 + 0.06*sin(uTime*1.5));
            vec3 col = mix(vec3(0.0,0.96,1.0), vec3(0.48,0.38,1.0), f);
            gl_FragColor = vec4(col, inner + pow(f, 4.0)*0.12);
          }
        `}
      />
    </mesh>
  );
}

function ParticleField({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const rand = mulberry32(99);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + rand() * 9;
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.6, r * Math.cos(ph) - 3], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.015;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#9bdcff" size={0.025} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function FloatingShapes() {
  const shapes: { pos: [number, number, number]; color: string; kind: "ico" | "torus" | "oct" | "box"; scale: number }[] = [
    { pos: [-3.1, 1.4, -0.6], color: "#00F5FF", kind: "ico", scale: 0.32 },
    { pos: [3.2, 1.1, -1], color: "#7B61FF", kind: "torus", scale: 0.3 },
    { pos: [2.7, -1.6, 0.2], color: "#00FF9D", kind: "oct", scale: 0.26 },
    { pos: [-2.6, -1.5, 0.4], color: "#7B61FF", kind: "box", scale: 0.22 },
    { pos: [0.4, 2.3, -1.6], color: "#00FF9D", kind: "ico", scale: 0.18 },
  ];
  return (
    <>
      {shapes.map((s, i) => (
        <Float key={i} speed={1.2 + i * 0.2} rotationIntensity={1.2} floatIntensity={1.4}>
          <mesh position={s.pos} scale={s.scale}>
            {s.kind === "ico" && <icosahedronGeometry args={[1, 0]} />}
            {s.kind === "torus" && <torusGeometry args={[1, 0.32, 16, 48]} />}
            {s.kind === "oct" && <octahedronGeometry args={[1, 0]} />}
            {s.kind === "box" && <boxGeometry args={[1.2, 1.2, 1.2]} />}
            <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.35} metalness={0.6} roughness={0.25} wireframe={i % 2 === 1} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function HeroBrainScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={30} color="#00F5FF" />
      <pointLight position={[-4, -2, 3]} intensity={25} color="#7B61FF" />
      <NeuralBrain />
      <FloatingShapes />
      <ParticleField />
    </>
  );
}
