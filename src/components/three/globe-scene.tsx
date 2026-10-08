"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const R = 1.6;

function latLng(lat: number, lng: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

const HQ = { name: "New Delhi", lat: 28.6139, lng: 77.209 };
const cities = [
  { name: "New York", lat: 40.71, lng: -74.0 },
  { name: "London", lat: 51.5, lng: -0.12 },
  { name: "Dubai", lat: 25.2, lng: 55.27 },
  { name: "Sydney", lat: -33.86, lng: 151.2 },
  { name: "Toronto", lat: 43.65, lng: -79.38 },
  { name: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Mumbai", lat: 19.07, lng: 72.87 },
  { name: "Bengaluru", lat: 12.97, lng: 77.59 },
];

function DotSphere() {
  const geo = useMemo(() => {
    const n = 2600;
    const pos = new Float32Array(n * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      pos.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#00F5FF" size={0.018} transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function Atmosphere() {
  return (
    <mesh scale={1.18}>
      <sphereGeometry args={[R, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={/* glsl */ `varying vec3 vN; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(0.25,0.55,1.0,1.0) * i; }`}
      />
    </mesh>
  );
}

function Arc({ to, delay }: { to: { lat: number; lng: number }; delay: number }) {
  const { curve, geo } = useMemo(() => {
    const a = latLng(HQ.lat, HQ.lng);
    const b = latLng(to.lat, to.lng);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const dist = a.distanceTo(b);
    mid.normalize().multiplyScalar(R + dist * 0.45);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const geo = new THREE.TubeGeometry(curve, 64, 0.006, 6, false);
    return { curve, geo };
  }, [to]);
  const dot = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = ((clock.elapsedTime * 0.35 + delay) % 1.4) / 1.4;
    if (dot.current) {
      dot.current.position.copy(curve.getPoint(Math.min(t * 1.15, 1)));
      dot.current.visible = t < 0.87;
    }
  });
  return (
    <group>
      <mesh geometry={geo}>
        <meshBasicMaterial color="#7B61FF" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={dot}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color="#00FF9D" />
      </mesh>
    </group>
  );
}

function Marker({ lat, lng, hq }: { lat: number; lng: number; hq?: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => latLng(lat, lng, R + 0.005), [lat, lng]);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = (clock.elapsedTime * 0.8 + (hq ? 0 : lat)) % 1;
    ring.current.scale.setScalar(1 + t * (hq ? 3 : 2));
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.8;
  });
  return (
    <group position={pos} quaternion={quat}>
      <mesh>
        <circleGeometry args={[hq ? 0.045 : 0.025, 24]} />
        <meshBasicMaterial color={hq ? "#00FF9D" : "#00F5FF"} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[hq ? 0.05 : 0.03, hq ? 0.065 : 0.04, 32]} />
        <meshBasicMaterial color={hq ? "#00FF9D" : "#00F5FF"} transparent side={THREE.DoubleSide} />
      </mesh>
      {hq && (
        <mesh position={[0, 0, 0.18]}>
          <cylinderGeometry args={[0.004, 0.004, 0.36, 6]} />
          <meshBasicMaterial color="#00FF9D" />
        </mesh>
      )}
    </group>
  );
}

export default function GlobeScene() {
  const group = useRef<THREE.Group>(null);
  // On touch devices, keep vertical page scrolling: disable drag-rotate.
  const coarse = useMemo(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches, []);
  // Start with India facing the camera.
  const initialY = useMemo(() => Math.PI / 2 - ((HQ.lng + 180) * Math.PI) / 180, []);
  return (
    <>
      <group ref={group} rotation={[0.35, initialY, 0]}>
        <mesh>
          <sphereGeometry args={[R * 0.995, 64, 64]} />
          <meshBasicMaterial color="#050816" transparent opacity={0.92} />
        </mesh>
        <mesh>
          <sphereGeometry args={[R * 1.001, 36, 18]} />
          <meshBasicMaterial color="#00F5FF" wireframe transparent opacity={0.06} />
        </mesh>
        <DotSphere />
        <Marker lat={HQ.lat} lng={HQ.lng} hq />
        {cities.map((c, i) => (
          <group key={c.name}>
            <Marker lat={c.lat} lng={c.lng} />
            <Arc to={c} delay={i * 0.17} />
          </group>
        ))}
      </group>
      <Atmosphere />
      <OrbitControls enableRotate={!coarse} enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} rotateSpeed={0.5} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI / 1.6} />
    </>
  );
}
