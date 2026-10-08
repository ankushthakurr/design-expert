import { CalendarCheck, PhoneIncoming, TrendingUp, Sparkles } from "lucide-react";
import { HeroBrain } from "@/components/three/scenes";
import { HeroActions } from "@/components/shared/cta-buttons";

export function Hero() {
  return (
    <section className="noise relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 md:pt-32" aria-labelledby="hero-title">
      {/* Background */}
      <div className="grid-bg absolute inset-0 -z-20" aria-hidden />
      <div className="glow-orb -z-10 left-[-10%] top-[10%] size-[480px] bg-secondary/40" aria-hidden />
      <div className="glow-orb -z-10 right-[-5%] top-[30%] size-[520px] bg-primary/25" aria-hidden />

      <div className="container-x grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 flex flex-col gap-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 text-xs text-muted backdrop-blur">
            <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-primary">
              <Sparkles className="size-3" aria-hidden /> AI Agency
            </span>
            AI Voice Agents · Automation · Digital Growth
          </span>
          <h1 id="hero-title" className="text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl xl:text-7xl">
            Scale Your Business With <span className="text-gradient-animated">AI Automation</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            We build AI systems that answer calls, support customers, automate operations, generate leads, book appointments and help businesses grow faster.
          </p>
          <HeroActions />
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2" aria-hidden>
              {["#00F5FF", "#7B61FF", "#00FF9D", "#FFC75F"].map((c, i) => (
                <span key={c} className="flex size-9 items-center justify-center rounded-full border-2 border-background text-[10px] font-semibold text-background" style={{ background: c }}>
                  {["DR", "AS", "MD", "RK"][i]}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted">
              <span className="font-semibold text-foreground">50+ projects</span> delivered for clinics, local businesses &amp; startups
            </p>
          </div>
        </div>

        <div className="relative h-[420px] sm:h-[520px] lg:h-[640px]">
          <HeroBrain className="absolute inset-0 -m-10 lg:-m-20" />
          {/* Floating glass cards */}
          <div className="glass absolute left-0 top-[12%] hidden animate-float items-center gap-3 rounded-2xl px-4 py-3 sm:flex" style={{ animationDelay: "0s" }}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <PhoneIncoming className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-xs text-muted">Incoming call · 11:42 PM</p>
              <p className="text-sm font-medium text-foreground">Answered by AI in 0.8s</p>
            </div>
          </div>
          <div className="glass absolute bottom-[18%] right-0 hidden animate-float items-center gap-3 rounded-2xl px-4 py-3 sm:flex" style={{ animationDelay: "1.5s" }}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <CalendarCheck className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-xs text-muted">New appointment</p>
              <p className="text-sm font-medium text-foreground">Booked · Tue 10:30 AM</p>
            </div>
          </div>
          <div className="glass absolute bottom-[4%] left-[8%] hidden animate-float items-center gap-3 rounded-2xl px-4 py-3 md:flex" style={{ animationDelay: "3s" }}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary/20 text-[#b5a8ff]">
              <TrendingUp className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-xs text-muted">Leads followed up</p>
              <p className="text-sm font-medium text-foreground">100% within 60 seconds</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-subtle md:flex" aria-hidden>
        Scroll
        <span className="h-10 w-px bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
}
