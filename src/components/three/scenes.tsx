"use client";

import dynamic from "next/dynamic";
import { SceneCanvas, GlowFallback } from "./scene-canvas";
import type { LevelRef } from "./voice-orb-scene";

const HeroBrainScene = dynamic(() => import("./hero-brain-scene"), { ssr: false });
const VoiceOrbScene = dynamic(() => import("./voice-orb-scene"), { ssr: false });
const WorkflowScene = dynamic(() => import("./workflow-scene"), { ssr: false });
const RocketScene = dynamic(() => import("./rocket-scene"), { ssr: false });
const GlobeScene = dynamic(() => import("./globe-scene"), { ssr: false });

export function HeroBrain({ className }: { className?: string }) {
  return (
    <SceneCanvas idle className={className} camera={{ position: [0, 0, 6.2], fov: 45 }} fallback={<GlowFallback />}>
      <HeroBrainScene />
    </SceneCanvas>
  );
}

export function VoiceOrb({ className, level }: { className?: string; level: LevelRef }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, 5.2], fov: 45 }} fallback={<GlowFallback />}>
      <VoiceOrbScene level={level} />
    </SceneCanvas>
  );
}

export function Workflow3D({ className }: { className?: string }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, 6.4], fov: 45 }} fallback={<GlowFallback />}>
      <WorkflowScene />
    </SceneCanvas>
  );
}

export function Rocket3D({ className }: { className?: string }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0.2, 6], fov: 45 }} fallback={<GlowFallback />}>
      <RocketScene />
    </SceneCanvas>
  );
}

export function Globe3D({ className }: { className?: string }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0, 5.2], fov: 45 }} fallback={<GlowFallback />}>
      <GlobeScene />
    </SceneCanvas>
  );
}
