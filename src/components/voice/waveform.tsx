"use client";

import { useEffect, useRef } from "react";
import type { LevelRef } from "@/components/three/voice-orb-scene";

/**
 * Canvas audio waveform. Reads either a live AnalyserNode (real audio)
 * or a LevelRef (simulated / averaged level) every frame.
 */
export function Waveform({
  level,
  analyser,
  className,
  bars = 56,
  colors = ["#7B61FF", "#00F5FF", "#00FF9D"],
}: {
  level?: LevelRef;
  analyser?: AnalyserNode | null;
  className?: string;
  bars?: number;
  colors?: string[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    const heights = new Array(bars).fill(0.05);
    const draw = (t: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (analyser && data) analyser.getByteFrequencyData(data);
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
      ctx.fillStyle = grad;
      const gap = 3;
      const bw = Math.max(2, (w - gap * (bars - 1)) / bars);
      for (let i = 0; i < bars; i++) {
        let target: number;
        if (analyser && data) {
          const idx = Math.floor((i / bars) * data.length * 0.6);
          target = data[idx] / 255;
        } else {
          const lv = level?.current ?? 0;
          const center = 1 - Math.abs(i - bars / 2) / (bars / 2);
          target = 0.06 + lv * (0.35 + 0.65 * center) * (0.55 + 0.45 * Math.sin(t / 90 + i * 0.9) * Math.cos(t / 140 + i * 0.37));
        }
        heights[i] += (Math.max(0.04, target) - heights[i]) * 0.25;
        const bh = Math.max(3, heights[i] * h);
        const x = i * (bw + gap);
        const y = (h - bh) / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, bw, bh, bw / 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [analyser, level, bars, colors]);
  return <canvas ref={ref} className={className} aria-hidden />;
}

/** Drives a LevelRef with speech-like amplitude while `speaking` is true. */
export function simulateSpeech(level: LevelRef, speakingRef: { current: boolean }) {
  let raf = 0;
  const loop = (t: number) => {
    const target = speakingRef.current
      ? 0.35 + 0.45 * Math.abs(Math.sin(t / 110)) * Math.abs(Math.sin(t / 47 + 1.3)) + Math.random() * 0.15
      : 0.02;
    level.current += (target - level.current) * 0.18;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}
