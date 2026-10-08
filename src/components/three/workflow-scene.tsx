"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";
import { useGlobalPointer } from "./global-pointer";

type Node = { id: string; label: string; sub: string; pos: [number, number, number]; color: string };

const nodes: Node[] = [
  { id: "lead", label: "New Lead", sub: "Web · Ads · Call", pos: [-3.3, 0.9, 0], color: "#00F5FF" },
  { id: "ai", label: "AI Agent", sub: "Qualifies & replies", pos: [-1.1, 0, 0.6], color: "#7B61FF" },
  { id: "crm", label: "CRM", sub: "Scored & assigned", pos: [1.1, 1.1, 0], color: "#00F5FF" },
  { id: "wa", label: "WhatsApp", sub: "Instant follow-up", pos: [1.3, -1.15, 0.4], color: "#00FF9D" },
  { id: "cal", label: "Calendar", sub: "Meeting booked", pos: [3.3, 0.1, 0], color: "#7B61FF" },
];
const links: [string, string][] = [
  ["lead", "ai"],
  ["ai", "crm"],
  ["ai", "wa"],
  ["crm", "cal"],
  ["wa", "cal"],
];

function Flow({ curve, color, count = 14, speed = 0.22 }: { curve: THREE.CatmullRomCurve3; color: string; count?: number; speed?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [count]);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ clock }) => {
    const arr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const t = (clock.elapsedTime * speed + i / count) % 1;
      curve.getPointAt(t, v);
      arr.set([v.x, v.y, v.z], i * 3);
    }
    geo.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={color} size={0.09} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function WorkflowScene() {
  const group = useRef<THREE.Group>(null);
  const pointer = useGlobalPointer();
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), []);
  const curves = useMemo(
    () =>
      links.map(([a, b]) => {
        const pa = new THREE.Vector3(...byId[a].pos);
        const pb = new THREE.Vector3(...byId[b].pos);
        const mid = pa.clone().lerp(pb, 0.5).add(new THREE.Vector3(0, 0.25, 0.8));
        return { curve: new THREE.CatmullRomCurve3([pa, mid, pb]), color: byId[b].color };
      }),
    [byId],
  );

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += (pointer.x * 0.35 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-pointer.y * 0.18 - group.current.rotation.x) * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 4]} intensity={40} color="#00F5FF" />
      <pointLight position={[-3, -3, 2]} intensity={30} color="#7B61FF" />
      <group ref={group}>
        {curves.map(({ curve, color }, i) => (
          <group key={i}>
            <mesh>
              <tubeGeometry args={[curve, 64, 0.012, 8, false]} />
              <meshBasicMaterial color={color} transparent opacity={0.35} />
            </mesh>
            <Flow curve={curve} color={color} speed={0.18 + i * 0.03} />
          </group>
        ))}
        {nodes.map((n, i) => (
          <Float key={n.id} speed={1.5} rotationIntensity={0.2} floatIntensity={0.4} floatingRange={[-0.05, 0.05]}>
            <group position={n.pos}>
              <RoundedBox args={[1.25, 0.62, 0.18]} radius={0.12} smoothness={4}>
                <meshStandardMaterial color="#0d1430" metalness={0.5} roughness={0.3} emissive={n.color} emissiveIntensity={0.08} />
              </RoundedBox>
              <mesh position={[0, 0, -0.1]}>
                <planeGeometry args={[1.6, 0.95]} />
                <meshBasicMaterial color={n.color} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
              <Html center transform distanceFactor={3.2} position={[0, 0, 0.11]} zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
                <div className="w-[160px] select-none text-center">
                  <div className="text-[15px] font-semibold text-white">{n.label}</div>
                  <div className="text-[11px]" style={{ color: n.color }}>
                    {n.sub}
                  </div>
                </div>
              </Html>
              <mesh position={[-0.52, 0.2, 0.1]}>
                <circleGeometry args={[0.035, 16]} />
                <meshBasicMaterial color={i % 2 ? "#00FF9D" : n.color} />
              </mesh>
            </group>
          </Float>
        ))}
      </group>
    </>
  );
}
