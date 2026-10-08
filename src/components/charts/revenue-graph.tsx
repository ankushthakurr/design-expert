"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Animated revenue growth graph. GSAP ScrollTrigger draws the line as it scrolls into view. */
export function RevenueGraph({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);
  const points = [12, 14, 13, 18, 22, 21, 28, 34, 33, 42, 51, 58, 70];
  const w = 520;
  const h = 240;
  const max = 75;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - (p / max) * h] as const);
  const line = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const svg = root.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const path = svg.querySelector<SVGPathElement>("[data-line]");
    const fill = svg.querySelector<SVGPathElement>("[data-area]");
    const dots = svg.querySelectorAll("[data-dot]");
    if (!path || !fill) return;
    const len = path.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(fill, { opacity: 0 });
      gsap.set(dots, { scale: 0, transformOrigin: "center" });
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 80%", once: true } });
      tl.to(path, { strokeDashoffset: 0, duration: 2, ease: "power2.out" })
        .to(fill, { opacity: 1, duration: 1 }, "-=1.2")
        .to(dots, { scale: 1, stagger: 0.05, duration: 0.3, ease: "back.out(3)" }, "-=1.4");
    }, svg);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={root} viewBox={`-10 -10 ${w + 20} ${h + 30}`} className={className} role="img" aria-label="Illustrative chart: revenue growing steadily month over month after systems go live">
      <defs>
        <linearGradient id="rg-line" x1="0" x2="1">
          <stop offset="0" stopColor="#7B61FF" />
          <stop offset="0.6" stopColor="#00F5FF" />
          <stop offset="1" stopColor="#00FF9D" />
        </linearGradient>
        <linearGradient id="rg-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#00F5FF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#00F5FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2={w} y1={(h / 4) * i} y2={(h / 4) * i} stroke="rgba(255,255,255,0.06)" />
      ))}
      <path data-area d={area} fill="url(#rg-fill)" />
      <path data-line d={line} fill="none" stroke="url(#rg-line)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map(([x, y], i) => (
        <circle data-dot key={i} cx={x} cy={y} r={i === coords.length - 1 ? 6 : 3.5} fill={i === coords.length - 1 ? "#00FF9D" : "#0a0f24"} stroke="#00F5FF" strokeWidth="2" />
      ))}
      {["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Jan"].map((m, i) => (
        <text key={i} x={(w / 6) * i} y={h + 20} fill="#6b7399" fontSize="11" textAnchor="middle">
          {m}
        </text>
      ))}
    </svg>
  );
}
