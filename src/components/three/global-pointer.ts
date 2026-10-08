"use client";

import { useEffect } from "react";

/** Window-level normalized pointer (-1..1), so scenes react even when UI overlays the canvas. */
export const globalPointer = { x: 0, y: 0 };
let listeners = 0;

function onMove(e: PointerEvent) {
  globalPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  globalPointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
}

export function useGlobalPointer() {
  useEffect(() => {
    if (listeners++ === 0) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (--listeners === 0) window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return globalPointer;
}
