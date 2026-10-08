"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Mic, PhoneOff, ShieldCheck } from "lucide-react";
import { VoiceOrb } from "@/components/three/scenes";
import { Waveform, simulateSpeech } from "@/components/voice/waveform";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

const script = [
  { who: "caller", text: "Hi, I'd like to book a teeth cleaning. Are you open tomorrow?" },
  { who: "ai", text: "Hi! Thanks for calling BrightSmile Dental. Yes, we have openings tomorrow at 10:30 AM and 4:15 PM. Which works better?" },
  { who: "caller", text: "4:15 would be perfect." },
  { who: "ai", text: "Done! You're booked for 4:15 PM tomorrow. I've sent a confirmation by WhatsApp. Anything else I can help with?" },
] as const;

export function VoiceSection() {
  const level = useMemo(() => ({ current: 0 }), []);
  const speaking = useRef(false);
  const [line, setLine] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => simulateSpeech(level, speaking), [level]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    speaking.current = script[line % script.length].who === "ai";
    const len = script[line % script.length].text.length;
    const t = window.setTimeout(() => setLine((l) => l + 1), 1400 + len * 38);
    return () => window.clearTimeout(t);
  }, [line, active]);

  useEffect(() => {
    if (!active) return;
    const i = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(i);
  }, [active]);

  const visible = script.slice(0, (line % script.length) + 1);
  const current = script[line % script.length];

  return (
    <section ref={containerRef} aria-labelledby="voice-title" className="relative overflow-hidden py-24">
      <div className="glow-orb left-1/2 top-1/3 size-[600px] -translate-x-1/2 bg-secondary/25" aria-hidden />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow="AI Voice Agents"
            title={<span id="voice-title">An AI receptionist that <span className="text-gradient">never misses a call</span></span>}
            description="Natural-sounding voice agents answer instantly, book appointments, qualify leads and send confirmations, 24 hours a day. Built to support your team during busy hours and after closing, not to replace them."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {["24/7 call answering", "Books into your calendar", "WhatsApp & SMS confirmations", "Warm transfer to your staff", "Call transcripts & summaries", "30+ languages incl. Hindi"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden /> {f}
              </li>
            ))}
          </ul>
          <p className="flex items-start gap-2.5 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-muted">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            Our voice agents handle missed calls, overflow and after-hours enquiries so your staff can focus on the customers in front of them.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/voice-agent-demo">
                <Mic /> Try the Live Demo
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/ai-voice-agents">How it works</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="glass-strong relative mx-auto max-w-md overflow-hidden rounded-[2rem] p-6 shadow-glow-violet">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
                </span>
                <span className="text-xs font-medium text-accent">Live call</span>
              </div>
              <span className="font-mono text-xs tabular-nums text-muted">
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
              </span>
            </div>
            <div className="relative mx-auto my-2 aspect-square w-full max-w-[300px]">
              <VoiceOrb level={level} className="absolute inset-0" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Aria · AI Receptionist</p>
              <p className="text-xs text-muted">BrightSmile Dental · {current.who === "ai" ? "Speaking…" : "Listening…"}</p>
            </div>
            <Waveform level={level} className="mt-4 h-14 w-full" />
            <div className="mt-4 flex h-44 flex-col justify-end gap-2 overflow-hidden" aria-live="polite">
              <AnimatePresence initial={false}>
                {visible.slice(-3).map((m) => (
                  <motion.div
                    key={m.text}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={m.who === "ai" ? "self-start rounded-2xl rounded-bl-sm bg-primary/10 px-3.5 py-2 text-xs text-foreground" : "self-end rounded-2xl rounded-br-sm bg-white/8 px-3.5 py-2 text-xs text-muted"}
                  >
                    {m.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="mt-5 flex justify-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted">
                <Mic className="size-5" aria-hidden />
              </span>
              <span className="flex size-12 items-center justify-center rounded-full bg-danger text-white">
                <PhoneOff className="size-5" aria-hidden />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
