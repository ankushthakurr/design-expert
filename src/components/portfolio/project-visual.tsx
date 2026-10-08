import type { MockupKind } from "@/content/portfolio";
import { cn } from "@/lib/utils";

/**
 * Generated device mockups (no stock images). Each project gets a distinct
 * UI composition from its mockup kind + brand colours.
 * TODO(owner): swap for real screenshots in /public/portfolio when available.
 */
export function ProjectVisual({ kind, colors, title, className, variant = 0 }: { kind: MockupKind; colors: [string, string]; title: string; className?: string; variant?: number }) {
  const [a, b] = colors;
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: `radial-gradient(circle at 20% 20%, ${a}33, transparent 55%), radial-gradient(circle at 80% 80%, ${b}40, transparent 55%), #0a0f24` }}
      role="img"
      aria-label={`Illustration of ${title}`}
    >
      <div className="grid-bg absolute inset-0 opacity-50" />
      {kind === "web" && <BrowserMock a={a} b={b} variant={variant} />}
      {kind === "voice" && <PhoneCallMock a={a} b={b} />}
      {kind === "dashboard" && <DashboardMock a={a} b={b} />}
      {kind === "chat" && <ChatMock a={a} b={b} />}
      {kind === "search" && <SearchMock a={a} b={b} />}
      {kind === "travel" && <TravelMock a={a} b={b} />}
      {kind === "commerce" && <CommerceMock a={a} b={b} />}
    </div>
  );
}

function Line({ w, c = "rgba(255,255,255,0.12)", h = 6 }: { w: string; c?: string; h?: number }) {
  return <div className="rounded-full" style={{ width: w, height: h, background: c }} />;
}

function BrowserMock({ a, b, variant }: { a: string; b: string; variant: number }) {
  return (
    <div className="absolute inset-x-[8%] top-[12%] bottom-[-6%] rounded-t-xl border border-white/15 bg-[#0d1430] shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <div className="ml-3 h-3 flex-1 rounded-full bg-white/5" />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <Line w="18%" c={a} />
          <div className="flex gap-2">
            <Line w="28px" />
            <Line w="28px" />
            <Line w="28px" />
          </div>
        </div>
        <div className="mt-2 grid grid-cols-[1.3fr_1fr] gap-3">
          <div className="flex flex-col gap-2">
            <Line w="90%" c="rgba(255,255,255,0.7)" h={10} />
            <Line w="70%" c="rgba(255,255,255,0.7)" h={10} />
            <Line w="80%" />
            <Line w="60%" />
            <div className="mt-2 flex gap-2">
              <div className="h-5 w-16 rounded-full" style={{ background: a }} />
              <div className="h-5 w-14 rounded-full border border-white/20" />
            </div>
          </div>
          <div className="aspect-[4/3] rounded-lg" style={{ background: `linear-gradient(135deg, ${a}, ${b})`, opacity: variant % 2 ? 0.8 : 0.6 }} />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-white/10 p-2">
              <div className="size-4 rounded" style={{ background: i === 1 ? b : a, opacity: 0.8 }} />
              <Line w="80%" />
              <Line w="60%" h={4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-1/2 top-[8%] bottom-[-10%] aspect-[9/19] -translate-x-1/2 rounded-[1.6rem] border border-white/20 bg-[#0d1430] p-2 shadow-2xl">
      <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-white/15" />
      {children}
    </div>
  );
}

function PhoneCallMock({ a, b }: { a: string; b: string }) {
  return (
    <>
      <PhoneFrame>
        <div className="flex h-full flex-col items-center gap-3 pt-4">
          <div className="relative size-16 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, ${a}, ${b})`, boxShadow: `0 0 30px ${a}` }} />
          <Line w="50%" c="rgba(255,255,255,0.7)" />
          <Line w="35%" c={a} h={4} />
          <div className="mt-2 flex h-8 items-center gap-0.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="w-1 rounded-full" style={{ height: `${8 + Math.abs(Math.sin(i)) * 22}px`, background: i % 2 ? a : b }} />
            ))}
          </div>
          <div className="mt-auto mb-4 flex gap-3">
            <span className="size-7 rounded-full bg-white/10" />
            <span className="size-7 rounded-full bg-[#ff5c7a]" />
          </div>
        </div>
      </PhoneFrame>
      <div className="glass absolute right-[6%] top-[22%] hidden w-[30%] rounded-xl p-2.5 sm:block">
        <Line w="60%" c={a} h={4} />
        <div className="mt-2 flex flex-col gap-1.5">
          <Line w="100%" h={4} />
          <Line w="80%" h={4} />
        </div>
      </div>
      <div className="glass absolute left-[6%] bottom-[18%] hidden w-[28%] rounded-xl p-2.5 sm:block">
        <div className="mb-1.5 size-3 rounded" style={{ background: b }} />
        <Line w="90%" h={4} />
        <div className="mt-1.5"><Line w="60%" h={4} /></div>
      </div>
    </>
  );
}

function DashboardMock({ a, b }: { a: string; b: string }) {
  return (
    <div className="absolute inset-[8%] rounded-xl border border-white/15 bg-[#0d1430] p-3 shadow-2xl">
      <div className="grid h-full grid-cols-[22%_1fr] gap-3">
        <div className="flex flex-col gap-2 border-r border-white/10 pr-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Line key={i} w={`${60 + (i % 3) * 12}%`} c={i === 1 ? a : undefined} />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            {[a, b, a].map((c, i) => (
              <div key={i} className="rounded-lg border border-white/10 p-2">
                <Line w="50%" h={4} />
                <div className="mt-1.5 h-3 w-2/3 rounded" style={{ background: c, opacity: 0.85 }} />
              </div>
            ))}
          </div>
          <div className="flex flex-1 items-end gap-1.5 rounded-lg border border-white/10 p-2">
            {[30, 45, 38, 60, 52, 70, 66, 85, 78, 95].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `linear-gradient(to top, ${b}, ${a})`, opacity: 0.85 }} />
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="size-3 rounded-full" style={{ background: i ? b : a }} />
                <Line w="40%" h={4} />
                <span className="ml-auto h-3 w-10 rounded-full" style={{ background: `${a}40` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMock({ a, b }: { a: string; b: string }) {
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col gap-2 p-1">
        <div className="self-start rounded-xl rounded-bl-sm px-2 py-1.5" style={{ background: `${a}30` }}>
          <Line w="70px" h={4} />
        </div>
        <div className="self-end rounded-xl rounded-br-sm bg-white/10 px-2 py-1.5">
          <Line w="50px" h={4} />
        </div>
        <div className="self-start rounded-xl rounded-bl-sm px-2 py-1.5" style={{ background: `${a}30` }}>
          <Line w="80px" h={4} />
          <div className="mt-1"><Line w="60px" h={4} /></div>
        </div>
        <div className="self-end rounded-xl rounded-br-sm px-2 py-1.5" style={{ background: `${b}40` }}>
          <Line w="40px" h={4} />
        </div>
      </div>
    </PhoneFrame>
  );
}

function SearchMock({ a, b }: { a: string; b: string }) {
  return (
    <div className="absolute inset-x-[10%] top-[14%] bottom-[-6%] rounded-t-xl border border-white/15 bg-[#0d1430] p-4 shadow-2xl">
      <div className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-2" style={{ boxShadow: `0 0 20px ${a}40` }}>
        <span className="size-3 rounded-full border-2" style={{ borderColor: a }} />
        <Line w="60%" c="rgba(255,255,255,0.5)" />
      </div>
      <div className="mt-4 rounded-lg border p-3" style={{ borderColor: `${a}50`, background: `${a}10` }}>
        <Line w="30%" c={a} h={5} />
        <div className="mt-2 flex flex-col gap-1.5">
          <Line w="95%" h={4} />
          <Line w="88%" h={4} />
          <Line w="70%" h={4} />
        </div>
        <div className="mt-3 flex gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-4 w-16 rounded-md" style={{ background: i === 0 ? `${b}50` : "rgba(255,255,255,0.08)" }} />
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 p-2">
            <span className="size-5 rounded" style={{ background: i ? b : a, opacity: 0.6 }} />
            <Line w="50%" h={4} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TravelMock({ a, b }: { a: string; b: string }) {
  return (
    <div className="absolute inset-x-[10%] top-[12%] bottom-[-6%] grid grid-cols-[1fr_1.2fr] gap-3 rounded-t-xl border border-white/15 bg-[#0d1430] p-3 shadow-2xl">
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={cn("rounded-xl px-2 py-1.5", i % 2 ? "self-end bg-white/10" : "self-start")} style={i % 2 ? {} : { background: `${a}25` }}>
            <Line w={`${50 + i * 10}px`} h={4} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {["Day 1", "Day 2", "Day 3"].map((d, i) => (
          <div key={d} className="rounded-lg border border-white/10 p-2">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-semibold" style={{ color: i === 1 ? b : a }}>{d}</span>
              <span className="h-2 w-8 rounded-full" style={{ background: `${a}40` }} />
            </div>
            <div className="mt-1.5 flex flex-col gap-1">
              <Line w="90%" h={3} />
              <Line w="65%" h={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommerceMock({ a, b }: { a: string; b: string }) {
  return (
    <div className="absolute inset-[8%] rounded-xl border border-white/15 bg-[#0d1430] p-3 shadow-2xl">
      <div className="grid h-full grid-cols-3 gap-2">
        {["Order", "Packed", "Shipped"].map((s, i) => (
          <div key={s} className="flex flex-col gap-2 rounded-lg border border-white/10 p-2">
            <span className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: i === 2 ? b : a }}>{s}</span>
            {[0, 1, 2].map((j) => (
              <div key={j} className="rounded-md border border-white/10 bg-white/[0.03] p-1.5">
                <div className="mb-1 flex items-center gap-1">
                  <span className="size-2.5 rounded-sm" style={{ background: j % 2 ? b : a, opacity: 0.8 }} />
                  <Line w="60%" h={3} />
                </div>
                <Line w="80%" h={3} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
