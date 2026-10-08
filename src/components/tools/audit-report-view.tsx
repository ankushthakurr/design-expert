"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, LogOut, Map, Wrench, XCircle } from "lucide-react";
import type { AuditReport } from "@/lib/audit/types";
import { ScoreRing, scoreColor } from "@/components/charts/score-ring";
import { Button } from "@/components/ui/button";
import { useUI } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export function AuditReportView({ report, businessName }: { report: AuditReport; businessName?: string }) {
  const { openBooking } = useUI();
  const [openCat, setOpenCat] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-8">
      <div className="glass border-gradient grid items-center gap-8 rounded-3xl p-6 md:grid-cols-[auto_1fr] md:p-10">
        <div className="flex flex-col items-center gap-2">
          <ScoreRing score={report.overall} size={170} stroke={14} label="Growth score" />
          <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ color: scoreColor(report.overall), background: `${scoreColor(report.overall)}1a` }}>
            Grade {report.grade}
          </span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Overall Growth Score</p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">{businessName ? `${businessName}: ` : ""}{report.headline}</h3>
          <p className="mt-3 break-all text-sm text-subtle">
            Scanned {report.signals.url} · server response {report.signals.ttfbMs}ms · {report.signals.htmlKb} KB HTML
            {report.signals.pageSpeed ? ` · Lighthouse performance ${report.signals.pageSpeed.performance}` : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {report.categories.map((c) => (
          <div key={c.key} className="glass flex flex-col items-center gap-2 rounded-2xl p-4 text-center">
            <ScoreRing score={c.score} size={84} stroke={7} />
            <span className="text-xs font-medium text-muted">{c.label} Score</span>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InsightCard icon={<AlertTriangle className="size-5" />} title="Why you're losing leads" items={report.losingLeads} tone="#FFC75F" />
        <InsightCard icon={<LogOut className="size-5" />} title="Why customers leave" items={report.customersLeave} tone="#FF5C7A" />
        <InsightCard icon={<Wrench className="size-5" />} title="What needs improvement" items={report.improvements.slice(0, 5)} tone="#00F5FF" />
      </div>

      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <Map className="size-5 text-accent" aria-hidden />
          <h3 className="text-xl font-semibold text-foreground">Your priority roadmap</h3>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {report.roadmap.map((r, i) => (
            <li key={r.phase} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                Step {i + 1} · {r.window}
              </span>
              <p className="mt-1 font-semibold text-foreground">{r.phase}</p>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                {r.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-foreground">Detailed findings in plain English</h3>
        {report.categories.map((c) => {
          const open = openCat === c.key;
          return (
            <div key={c.key} className="glass rounded-2xl">
              <button
                className="flex w-full items-center gap-4 p-5 text-left"
                aria-expanded={open}
                onClick={() => setOpenCat(open ? null : c.key)}
              >
                <span className="w-12 text-lg font-semibold tabular-nums" style={{ color: scoreColor(c.score) }}>
                  {c.score}
                </span>
                <span className="flex-1">
                  <span className="block font-medium text-foreground">{c.label}</span>
                  <span className="block text-sm text-muted">{c.summary}</span>
                </span>
                <ChevronDown className={cn("size-5 shrink-0 text-muted transition-transform", open && "rotate-180")} aria-hidden />
              </button>
              {open && (
                <ul className="grid gap-2 border-t border-white/8 p-5 md:grid-cols-2">
                  {c.checks.map((k) => (
                    <li key={k.label} className="flex gap-3 text-sm">
                      {k.pass ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-label="Pass" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-label="Needs work" />}
                      <span>
                        <span className="text-foreground">{k.label}</span>
                        {!k.pass && <span className="block text-muted">{k.tip}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="glass border-gradient flex flex-col items-start justify-between gap-4 rounded-3xl p-6 md:flex-row md:items-center md:p-8">
        <div>
          <p className="text-lg font-semibold text-foreground">Want us to fix these for you?</p>
          <p className="text-sm text-muted">Book a free strategy call and Pankaj will walk you through the top 3 fixes for your business.</p>
        </div>
        <Button size="lg" onClick={() => openBooking("consultation")}>Book Free Strategy Call</Button>
      </div>
    </div>
  );
}

function InsightCard({ icon, title, items, tone }: { icon: React.ReactNode; title: string; items: string[]; tone: string }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl" style={{ color: tone, background: `${tone}1a` }}>
          {icon}
        </span>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <ul className="flex flex-col gap-3 text-sm leading-relaxed text-muted">
        {items.map((t) => (
          <li key={t} className="flex gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: tone }} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
