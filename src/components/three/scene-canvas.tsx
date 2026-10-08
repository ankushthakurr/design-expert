"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { cn } from "@/lib/utils";

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

type SceneCanvasProps = Omit<CanvasProps, "children"> & {
  children: React.ReactNode;
  className?: string;
  /** Rendered until the 3D scene mounts, and permanently when WebGL/motion is unavailable. */
  fallback?: React.ReactNode;
  /** Delay mounting until the browser is idle (use for above-the-fold scenes to protect LCP). */
  idle?: boolean;
};

/**
 * Performance-first wrapper around R3F's <Canvas>:
 * - mounts only when near the viewport (and after idle for hero scenes)
 * - pauses rendering when scrolled offscreen
 * - respects prefers-reduced-motion and missing WebGL with a static fallback
 * - clamps device pixel ratio for mobile GPUs
 */
export function SceneCanvas({ children, className, fallback, idle = false, camera, ...props }: SceneCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [inView, setInView] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !supportsWebGL()) {
      setDisabled(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let idleHandle: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && !mount) {
          if (idle && "requestIdleCallback" in window) {
            idleHandle = window.requestIdleCallback(() => setMount(true), { timeout: 1200 });
          } else {
            setMount(true);
          }
        }
      },
      { rootMargin: "250px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (idleHandle && "cancelIdleCallback" in window) window.cancelIdleCallback(idleHandle);
    };
  }, [idle, mount]);

  return (
    <div ref={ref} className={cn("relative", className)} aria-hidden>
      {(!mount || disabled) && fallback}
      {mount && !disabled && (
        <Canvas
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={camera ?? { position: [0, 0, 6], fov: 45 }}
          frameloop={inView ? "always" : "never"}
          className="!absolute inset-0 animate-[fadeIn_1s_ease_forwards]"
          {...props}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}

/** CSS-only stand-in shown before / instead of WebGL. */
export function GlowFallback({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center", className)}>
      <div className="relative size-[60%] max-w-[420px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(0,245,255,0.55),rgba(123,97,255,0.35)_45%,transparent_70%)] blur-2xl" />
        <div className="absolute inset-[18%] rounded-full border border-primary/30" />
        <div className="absolute inset-[30%] animate-spin-slow rounded-full border border-dashed border-secondary/40" />
      </div>
    </div>
  );
}
