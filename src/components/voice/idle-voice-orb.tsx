"use client";

import { useEffect, useMemo, useRef } from "react";
import { VoiceOrb } from "@/components/three/scenes";
import { simulateSpeech } from "./waveform";

/** Voice orb that "speaks" in a natural rhythm (for marketing pages). */
export function IdleVoiceOrb({ className }: { className?: string }) {
  const level = useMemo(() => ({ current: 0 }), []);
  const speaking = useRef(true);
  useEffect(() => {
    const stop = simulateSpeech(level, speaking);
    const i = setInterval(() => (speaking.current = !speaking.current), 2600);
    return () => {
      stop();
      clearInterval(i);
    };
  }, [level]);
  return <VoiceOrb level={level} className={className} />;
}
