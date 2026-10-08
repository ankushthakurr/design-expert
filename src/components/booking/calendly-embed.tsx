"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight Calendly inline embed. Uses a lazy iframe (no third-party script),
 * so it never blocks page load or hurts Core Web Vitals.
 */
export function CalendlyEmbed({ url, className, height = 680 }: { url: string; className?: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const src = `${url}${url.includes("?") ? "&" : "?"}embed_type=Inline&hide_gdpr_banner=1&background_color=0a0f24&text_color=eef2ff&primary_color=00f5ff`;

  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-2xl border border-white/10 bg-surface", className)} style={{ height }}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarCheck className="size-7" aria-hidden />
          </span>
          <p className="text-sm text-muted">Loading live calendar…</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline">
            Open the booking page in a new tab <ExternalLink className="size-3.5" aria-hidden />
          </a>
          <div className="shimmer absolute inset-0 -z-10 opacity-40" aria-hidden />
        </div>
      )}
      {visible && (
        <iframe
          src={src}
          title="Book a meeting with D Expert"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={cn("size-full transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
}
