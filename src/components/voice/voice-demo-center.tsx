"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Mic, MicOff, Phone, PhoneOff, RotateCcw, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { voiceDemos, matchReply, type DemoReply, type VoiceDemo } from "@/content/voice-demos";
import { VoiceOrb } from "@/components/three/scenes";
import { Waveform, simulateSpeech } from "./waveform";
import { Icon } from "@/components/shared/icon";
import { BookButton } from "@/components/shared/cta-buttons";
import { cn } from "@/lib/utils";

type Phase = "idle" | "ringing" | "agent" | "caller" | "ended";
type Line = { who: "agent" | "caller"; text: string; at: number };

// Minimal typing for the Web Speech API (not in TS's DOM lib everywhere).
type RecognitionResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> };
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecognitionCtor = new () => Recognition;

function getRecognition(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function pickVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /en-IN/i.test(v.lang) && /female|neerja|veena|heera/i.test(v.name)) ??
    voices.find((v) => /Google UK English Female|Samantha|Karen|Moira|Serena|Zira/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null
  );
}

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function VoiceDemoCenter() {
  const [demoId, setDemoId] = useState(voiceDemos[0].id);
  const demo = voiceDemos.find((d) => d.id === demoId) as VoiceDemo;

  const [phase, setPhase] = useState<Phase>("idle");
  const [nodeId, setNodeId] = useState(demo.start);
  const [lines, setLines] = useState<Line[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [micOn, setMicOn] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);

  const level = useMemo(() => ({ current: 0 }), []);
  const speaking = useRef(false);
  const runId = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const nodeRef = useRef(demo.start);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoTimer = useRef<number | null>(null);
  const recRef = useRef<Recognition | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const settings = useRef({ muted, autoplay, micOn });
  useEffect(() => {
    settings.current = { muted, autoplay, micOn };
  }, [muted, autoplay, micOn]);

  useEffect(() => simulateSpeech(level, speaking), [level]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase !== "agent" && phase !== "caller") return;
    const i = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(i);
  }, [phase]);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [lines, interim, phase]);

  // Voices load asynchronously in some browsers.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.getVoices();
    const h = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", h);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", h);
  }, []);

  const clearAuto = () => {
    if (autoTimer.current) window.clearTimeout(autoTimer.current);
    autoTimer.current = null;
  };

  const stopListening = useCallback(() => {
    try {
      recRef.current?.abort();
    } catch {}
    recRef.current = null;
    setListening(false);
    setInterim("");
  }, []);

  const stopAudio = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    audioRef.current?.pause();
    audioRef.current = null;
    speaking.current = false;
  }, []);

  /** Plays an agent line: real MP3 if provided, otherwise the browser voice, otherwise timed text. */
  const speak = useCallback(
    async (text: string, d: VoiceDemo, id: string, token: number) => {
      speaking.current = true;
      const fallbackMs = Math.min(14000, 900 + text.length * 55);
      try {
        if (settings.current.muted) {
          await wait(fallbackMs);
          return;
        }
        if (d.hasRecordings) {
          const ok = await new Promise<boolean>((resolve) => {
            const a = new Audio(`/audio/demos/${d.id}/${id}.mp3`);
            audioRef.current = a;
            a.onended = () => resolve(true);
            a.onerror = () => resolve(false);
            a.play().catch(() => resolve(false));
          });
          if (ok || token !== runId.current) return;
        }
        if ("speechSynthesis" in window) {
          await new Promise<void>((resolve) => {
            const u = new SpeechSynthesisUtterance(text);
            const v = pickVoice();
            if (v) u.voice = v;
            u.rate = 1.03;
            u.pitch = 1.05;
            const guard = window.setTimeout(resolve, fallbackMs + 6000);
            u.onend = () => {
              window.clearTimeout(guard);
              resolve();
            };
            u.onerror = () => {
              window.clearTimeout(guard);
              resolve();
            };
            window.speechSynthesis.speak(u);
          });
          return;
        }
        await wait(fallbackMs);
      } finally {
        if (token === runId.current) speaking.current = false;
      }
    },
    [],
  );

  const answerRef = useRef<(r: DemoReply, said?: string) => void>(() => {});

  const listen = useCallback(() => {
    const SR = getRecognition();
    const node = demo.nodes[nodeRef.current];
    if (!SR || !node.replies) return false;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText = text;
      }
      setInterim(text);
    };
    rec.onend = () => {
      setListening(false);
      if (finalText && phaseRef.current === "caller" && node.replies) answerRef.current(matchReply(finalText, node.replies), finalText);
    };
    rec.onerror = () => setListening(false);
    try {
      rec.start();
      recRef.current = rec;
      setListening(true);
      return true;
    } catch {
      return false;
    }
  }, [demo]);

  const goTo = useCallback(
    async (id: string, token: number) => {
      const node = demo.nodes[id];
      nodeRef.current = id;
      setNodeId(id);
      setPhase("agent");
      phaseRef.current = "agent";
      setLines((l) => [...l, { who: "agent", text: node.agent, at: Date.now() }]);
      await speak(node.agent, demo, id, token);
      if (token !== runId.current) return;
      if (!node.replies?.length) {
        await wait(1200);
        if (token !== runId.current) return;
        setPhase("ended");
        phaseRef.current = "ended";
        return;
      }
      setPhase("caller");
      phaseRef.current = "caller";
      const heard = settings.current.micOn && listen();
      if (!heard && settings.current.autoplay) {
        autoTimer.current = window.setTimeout(() => {
          if (token === runId.current && phaseRef.current === "caller") answerRef.current(node.replies![0]);
        }, 2200);
      }
    },
    [demo, speak, listen],
  );

  const answer = useCallback(
    (reply: DemoReply, said?: string) => {
      if (phaseRef.current !== "caller") return;
      clearAuto();
      stopListening();
      phaseRef.current = "agent";
      const token = runId.current;
      setLines((l) => [...l, { who: "caller", text: said?.trim() || reply.label, at: Date.now() }]);
      window.setTimeout(() => {
        if (token === runId.current) goTo(reply.next, token);
      }, 550);
    },
    [goTo, stopListening],
  );
  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  const startCall = async () => {
    // Unlock speech on iOS/Safari inside the click gesture.
    if ("speechSynthesis" in window && !muted) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
    }
    const token = ++runId.current;
    clearAuto();
    setLines([]);
    setSeconds(0);
    setPhase("ringing");
    phaseRef.current = "ringing";
    await wait(1500);
    if (token !== runId.current) return;
    goTo(demo.start, token);
  };

  const endCall = useCallback(() => {
    runId.current++;
    clearAuto();
    stopListening();
    stopAudio();
    setPhase((p) => (p === "idle" ? "idle" : "ended"));
    phaseRef.current = "ended";
  }, [stopAudio, stopListening]);

  const stopMic = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    setAnalyser(null);
    setMicOn(false);
  }, []);

  const toggleMic = async () => {
    if (micOn) {
      stopListening();
      stopMic();
      return;
    }
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 256;
      an.smoothingTimeConstant = 0.7;
      src.connect(an);
      streamRef.current = stream;
      ctxRef.current = ctx;
      setAnalyser(an);
      setMicOn(true);
      settings.current.micOn = true;
      if (!getRecognition()) setMicError("Your browser can't transcribe speech, so tap a reply to answer. Your microphone still drives the waveform.");
      if (phaseRef.current === "caller") {
        clearAuto();
        listen();
      }
    } catch {
      setMicError("Microphone access was blocked. You can still try the demo by tapping the suggested replies.");
    }
  };

  // Clean up on unmount.
  useEffect(
    () => () => {
      runId.current++;
      clearAuto();
      stopListening();
      stopAudio();
      stopMic();
    },
    [stopAudio, stopListening, stopMic],
  );

  const selectDemo = (id: string) => {
    if (id === demoId) return;
    endCall();
    setDemoId(id);
    setNodeId(voiceDemos.find((d) => d.id === id)!.start);
    setLines([]);
    setSeconds(0);
    setPhase("idle");
    phaseRef.current = "idle";
  };

  const inCall = phase === "ringing" || phase === "agent" || phase === "caller";
  const node = demo.nodes[nodeId];
  const status =
    phase === "idle" ? "Ready to call" : phase === "ringing" ? "Connecting…" : phase === "agent" ? `${demo.agentName} is speaking` : phase === "caller" ? (listening ? "Listening…" : "Your turn") : "Call ended";

  return (
    <div className="flex flex-col gap-8">
      {/* Demo picker */}
      <div role="tablist" aria-label="Choose a demo" className="grid gap-4 md:grid-cols-3">
        {voiceDemos.map((d) => {
          const on = d.id === demoId;
          return (
            <button
              key={d.id}
              role="tab"
              aria-selected={on}
              onClick={() => selectDemo(d.id)}
              className={cn("glass flex items-start gap-4 rounded-3xl p-5 text-left transition-all", on ? "border-primary/50 shadow-[0_0_40px_-12px_rgba(0,245,255,0.5)]" : "hover:border-white/20")}
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: `linear-gradient(135deg, ${d.colors[0]}30, ${d.colors[1]}30)`, color: d.colors[0] }}>
                <Icon name={d.icon} className="size-6" />
              </span>
              <span>
                <span className="block font-semibold text-foreground">{d.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{d.summary}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Call UI */}
        <div className="glass-strong border-gradient relative flex flex-col overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">{demo.business}</p>
              <p className="text-xs text-muted">AI assistant · {demo.agentName}</p>
            </div>
            <div className="text-right">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs", inCall ? "bg-accent/15 text-accent" : "bg-white/8 text-muted")} aria-live="polite">
                {inCall && <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden />}
                {status}
              </span>
              <p className="mt-1 font-mono text-xs tabular-nums text-subtle">{fmt(seconds)}</p>
            </div>
          </div>

          <div className="relative mx-auto my-2 aspect-square w-full max-w-[320px]">
            {phase === "ringing" && (
              <>
                <span className="absolute inset-[18%] animate-ping rounded-full border border-primary/40" aria-hidden />
                <span className="absolute inset-[10%] animate-pulse rounded-full border border-secondary/30" aria-hidden />
              </>
            )}
            <VoiceOrb level={level} className="absolute inset-0" />
          </div>

          <Waveform level={level} analyser={phase === "caller" && micOn ? analyser : null} className="h-14 w-full" />

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={toggleMic}
              aria-pressed={micOn}
              aria-label={micOn ? "Turn microphone off" : "Turn microphone on to talk"}
              className={cn("flex size-12 items-center justify-center rounded-full border transition-colors", micOn ? "border-accent bg-accent/15 text-accent" : "border-white/15 text-muted hover:text-foreground")}
            >
              {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            </button>
            {inCall ? (
              <button type="button" onClick={endCall} aria-label="End call" className="flex size-16 items-center justify-center rounded-full bg-[#FF5C7A] text-white shadow-[0_0_30px_-4px_#FF5C7A] transition-transform hover:scale-105">
                <PhoneOff className="size-6" />
              </button>
            ) : (
              <button type="button" onClick={startCall} aria-label={`Call ${demo.business}`} className="relative flex size-16 items-center justify-center rounded-full bg-accent text-background shadow-[0_0_30px_-4px_#00FF9D] transition-transform hover:scale-105">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" aria-hidden />
                <Phone className="relative size-6" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMuted((m) => !m);
                if (!muted) stopAudio();
              }}
              aria-pressed={muted}
              aria-label={muted ? "Unmute agent voice" : "Mute agent voice"}
              className={cn("flex size-12 items-center justify-center rounded-full border transition-colors", muted ? "border-warning/60 text-warning" : "border-white/15 text-muted hover:text-foreground")}
            >
              {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-subtle">{inCall ? "End call" : phase === "ended" ? "Call again" : "Start call"}</p>

          <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 text-xs text-muted">
            <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} className="size-4 accent-[#00F5FF]" />
            Auto-play caller replies (turn off to answer yourself)
          </label>
          {micError && <p className="mt-3 text-center text-xs text-warning">{micError}</p>}
        </div>

        {/* Transcript */}
        <div className="glass flex min-h-[520px] flex-col rounded-[2rem]">
          <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
            <h2 className="font-semibold text-foreground">Live transcript</h2>
            <span className="text-xs text-subtle">{demo.title}</span>
          </div>
          <div ref={transcriptRef} className="flex max-h-[460px] flex-1 flex-col gap-3 overflow-y-auto px-6 py-5" aria-live="polite">
            {lines.length === 0 && phase !== "ringing" && (
              <div className="m-auto max-w-sm text-center text-sm leading-relaxed text-muted">
                <p>
                  Press <span className="text-accent">Call</span> to ring {demo.business}. {demo.agentName} will pick up and handle the call like a real receptionist.
                </p>
                <p className="mt-3 text-xs text-subtle">Turn on your microphone to talk back, or tap the suggested replies. Nothing you say is recorded or stored.</p>
              </div>
            )}
            {phase === "ringing" && <p className="m-auto animate-pulse text-sm text-muted">Ringing {demo.business}…</p>}
            <AnimatePresence initial={false}>
              {lines.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex flex-col gap-1", l.who === "caller" ? "items-end" : "items-start")}>
                  <span className="text-[10px] uppercase tracking-wider text-subtle">{l.who === "agent" ? `${demo.agentName} · AI assistant` : "Caller"}</span>
                  <p className={cn("max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", l.who === "agent" ? "rounded-tl-sm bg-primary/10 text-foreground" : "rounded-tr-sm bg-secondary/20 text-foreground")}>{l.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {interim && <p className="self-end text-sm italic text-muted">{interim}…</p>}

            {phase === "ended" && lines.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-accent/25 bg-accent/5 p-5">
                <p className="text-sm font-semibold text-foreground">What happens automatically after this call</p>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-foreground/90">
                  {demo.outcomes.map((o) => (
                    <li key={o} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {o}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <BookButton booking="aiDemo" size="sm">Get this for my business</BookButton>
                  <button type="button" onClick={startCall} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <RotateCcw className="size-3.5" aria-hidden /> Replay demo
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {phase === "caller" && node.replies && (
            <div className="border-t border-white/8 px-6 py-4">
              <p className="mb-3 text-xs text-muted">{listening ? "Listening. Speak now, or tap a reply:" : "Your turn. Tap a reply:"}</p>
              <div className="flex flex-wrap gap-2">
                {micOn && !listening && getRecognition() && (
                  <button type="button" onClick={() => { clearAuto(); listen(); }} className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-accent hover:bg-accent/20">
                    <Mic className="size-3.5" aria-hidden /> Speak
                  </button>
                )}
                {node.replies.map((r) => (
                  <button key={r.label} type="button" onClick={() => answer(r)} className="rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/15">
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent/5 p-5 text-sm text-foreground">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
        <span>
          <strong className="font-semibold">Built to support your team, not replace it.</strong> {demo.helpsTeam} This demo uses your browser&apos;s built-in voice; production agents use natural, human-like voices in English, Hindi and Hinglish.
        </span>
      </p>
    </div>
  );
}
