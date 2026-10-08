"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { founderTimeline } from "@/content/founder";

export function FounderTimeline() {
  const root = useRef<HTMLOListElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-tl-line]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 70%", scrub: 0.5 } });
      gsap.utils.toArray<HTMLElement>("[data-tl-item]").forEach((el) => {
        gsap.from(el, { opacity: 0, x: -24, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <ol ref={root} className="relative ml-4 flex flex-col gap-10 border-l border-white/10 pl-10">
      <span data-tl-line className="absolute -left-px top-0 h-full w-px origin-top bg-gradient-to-b from-primary via-secondary to-accent" aria-hidden />
      {founderTimeline.map((t) => (
        <li key={t.title} data-tl-item className="relative">
          <span className="absolute -left-[3.05rem] top-1 flex size-5 items-center justify-center rounded-full border border-primary bg-background" aria-hidden>
            <span className="size-2 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-primary">{t.year}</span>
          <h3 className="mt-1 text-xl font-semibold text-foreground">{t.title}</h3>
          <p className="mt-1.5 max-w-xl text-muted">{t.desc}</p>
        </li>
      ))}
    </ol>
  );
}
