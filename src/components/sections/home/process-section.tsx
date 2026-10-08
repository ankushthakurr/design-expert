"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/content/services";
import { SectionHeading } from "@/components/shared/section-heading";
import { Icon } from "@/components/shared/icon";

export function ProcessSection() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-progress]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
      );
      gsap.from("[data-step]", {
        opacity: 0,
        y: 28,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section aria-labelledby="process-title" className="py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="How we work"
          title={<span id="process-title">From strategy call to <span className="text-gradient">live AI systems</span></span>}
          description="A clear five-step process with you in control at every stage. Most clients see their first automations live within two weeks."
        />
        <div ref={root} className="relative mt-16">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-white/10 lg:block" aria-hidden>
            <div data-progress className="h-full origin-left bg-gradient-to-r from-primary via-secondary to-accent" />
          </div>
          <ol className="grid gap-6 lg:grid-cols-5">
            {processSteps.map((s) => (
              <li key={s.step} data-step className="relative flex flex-col gap-4">
                <span className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-surface text-primary shadow-glow">
                  <Icon name={s.icon} className="size-6" />
                </span>
                <div>
                  <span className="font-mono text-xs text-subtle">{s.step}</span>
                  <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
