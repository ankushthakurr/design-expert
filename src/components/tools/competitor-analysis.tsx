"use client";

import { useState } from "react";
import { Loader2, Scale, Swords, TrendingUp, ListChecks } from "lucide-react";
import type { AuditReport } from "@/lib/audit/types";
import { submitLead } from "@/lib/submit-lead";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScoreRing, scoreColor } from "@/components/charts/score-ring";
import { BookButton } from "@/components/shared/cta-buttons";

type Dim = { key: string; label: string; you: number; them: number };

function contentScore(r: AuditReport) {
  const s = r.signals;
  let v = 0;
  v += Math.min(40, (s.wordCount / 900) * 40);
  v += Math.min(20, s.h2Count * 4);
  v += s.hasFaqSchema ? 10 : 0;
  v += s.internalLinks >= 15 ? 15 : (s.internalLinks / 15) * 15;
  v += s.imgCount >= 4 ? 15 : (s.imgCount / 4) * 15;
  return Math.round(Math.min(100, v));
}
const cat = (r: AuditReport, k: string) => r.categories.find((c) => c.key === k)?.score ?? 0;

function compare(you: AuditReport, them: AuditReport): Dim[] {
  return [
    { key: "seo", label: "SEO", you: cat(you, "seo"), them: cat(them, "seo") },
    { key: "speed", label: "Speed", you: cat(you, "speed"), them: cat(them, "speed") },
    { key: "content", label: "Content", you: contentScore(you), them: contentScore(them) },
    { key: "trust", label: "Trust", you: cat(you, "trust"), them: cat(them, "trust") },
    { key: "leadGen", label: "Lead Generation", you: Math.round((cat(you, "leadGen") + cat(you, "conversion")) / 2), them: Math.round((cat(them, "leadGen") + cat(them, "conversion")) / 2) },
  ];
}

const advice: Record<string, string> = {
  seo: "Strengthen titles, meta descriptions, headings and schema on your key service pages, and add location pages.",
  speed: "Compress images to WebP/AVIF, defer scripts and move to faster hosting or a CDN to beat their load time.",
  content: "Publish deeper service pages and FAQs that answer buyer questions better than their site does.",
  trust: "Showcase reviews, certifications, guarantees and real project photos near your calls-to-action.",
  leadGen: "Add instant-response channels (AI chatbot, WhatsApp, online booking) and clearer calls-to-action on every page.",
};

export function CompetitorAnalysis() {
  const [you, setYou] = useState("");
  const [them, setThem] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ you: AuditReport; them: AuditReport } | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (you.trim().length < 4 || them.trim().length < 4) return setError("Enter both website addresses.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email to receive your report.");
    setBusy(true);
    submitLead("competitor-analysis", { website: you, competitor: them, email }).catch(() => {});
    try {
      const call = (url: string) => fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) }).then((r) => r.json());
      const [a, b] = await Promise.all([call(you), call(them)]);
      if (!a.ok) throw new Error(`Your site: ${a.error}`);
      if (!b.ok) throw new Error(`Competitor: ${b.error}`);
      setResult({ you: a.report, them: b.report });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const dims = result ? compare(result.you, result.them) : [];
  const youTotal = dims.length ? Math.round(dims.reduce((s, d) => s + d.you, 0) / dims.length) : 0;
  const themTotal = dims.length ? Math.round(dims.reduce((s, d) => s + d.them, 0) / dims.length) : 0;
  const gaps = dims.filter((d) => d.them > d.you).sort((a, b) => b.them - b.you - (a.them - a.you));
  const weakBoth = dims.filter((d) => d.you < 70 && d.them < 70 && !gaps.includes(d));
  const potential = Math.min(100, Math.round(youTotal + dims.reduce((s, d) => s + Math.max(0, 85 - d.you), 0) / dims.length || 0));
  const potentialLabel = potential >= 85 ? "High" : potential >= 70 ? "Good" : "Moderate";

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={run} noValidate className="glass-strong border-gradient grid gap-4 rounded-[2rem] p-6 md:grid-cols-[1fr_auto_1fr] md:items-end md:p-8">
        <div>
          <Label htmlFor="ca-you">Your website</Label>
          <Input id="ca-you" inputMode="url" placeholder="yourbusiness.com" value={you} onChange={(e) => setYou(e.target.value)} />
        </div>
        <span className="hidden size-12 items-center justify-center self-end rounded-full border border-white/10 bg-white/5 text-primary md:flex">
          <Swords className="size-5" aria-hidden />
        </span>
        <div>
          <Label htmlFor="ca-them">Competitor website</Label>
          <Input id="ca-them" inputMode="url" placeholder="competitor.com" value={them} onChange={(e) => setThem(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="ca-email">Email</Label>
          <Input id="ca-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button type="submit" variant="gradient" size="lg" className="h-12" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <Scale />} {busy ? "Comparing both sites…" : "Compare websites"}
        </Button>
        {error && <p role="alert" className="text-sm text-danger md:col-span-3">{error}</p>}
      </form>

      {result && (
        <div className="flex flex-col gap-8" aria-live="polite">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "You", host: result.you.signals.host, score: youTotal },
              { name: "Competitor", host: result.them.signals.host, score: themTotal },
            ].map((s) => (
              <div key={s.name} className="glass flex items-center gap-6 rounded-3xl p-6">
                <ScoreRing score={s.score} size={110} />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">{s.name}</p>
                  <p className="break-all text-lg font-semibold text-foreground">{s.host}</p>
                  <p className="text-sm text-muted">{s.score >= (s.name === "You" ? themTotal : youTotal) ? "Leading overall" : "Behind overall"}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass rounded-3xl p-6 md:p-8">
            <h3 className="mb-6 text-xl font-semibold text-foreground">Head-to-head</h3>
            <div className="flex flex-col gap-5">
              {dims.map((d) => (
                <div key={d.key}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-foreground">{d.label}</span>
                    <span className="text-muted">
                      You <span style={{ color: scoreColor(d.you) }}>{d.you}</span> · Them <span style={{ color: scoreColor(d.them) }}>{d.them}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex h-3 justify-end overflow-hidden rounded-l-full bg-white/5">
                      <div className="h-full rounded-l-full bg-gradient-to-l from-primary to-primary/40" style={{ width: `${d.you}%` }} />
                    </div>
                    <div className="h-3 overflow-hidden rounded-r-full bg-white/5">
                      <div className="h-full rounded-r-full bg-gradient-to-r from-secondary to-secondary/40" style={{ width: `${d.them}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-xs text-subtle">
                <span>◀ You</span>
                <span>Competitor ▶</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass rounded-3xl p-6">
              <TrendingUp className="size-6 text-accent" aria-hidden />
              <h3 className="mt-3 font-semibold text-foreground">Ranking potential: {potentialLabel}</h3>
              <p className="mt-2 text-sm text-muted">
                If you close the gaps below, your site could reach an average score of around <span className="text-foreground">{potential}</span>, {potential > themTotal ? "putting you ahead of this competitor." : "closing most of the gap with this competitor."}
              </p>
            </div>
            <div className="glass rounded-3xl p-6 md:col-span-2">
              <Swords className="size-6 text-warning" aria-hidden />
              <h3 className="mt-3 font-semibold text-foreground">Opportunities</h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                {gaps.map((g) => (
                  <li key={g.key}>
                    <span className="text-foreground">{g.label}:</span> they lead by {g.them - g.you} points. {advice[g.key]}
                  </li>
                ))}
                {weakBoth.map((g) => (
                  <li key={g.key}>
                    <span className="text-foreground">{g.label}:</span> neither site is strong here. Win it first. {advice[g.key]}
                  </li>
                ))}
                {!gaps.length && !weakBoth.length && <li>You lead in every area. Protect your position with fresh content, reviews and automation.</li>}
              </ul>
            </div>
          </div>

          <div className="glass border-gradient rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3">
              <ListChecks className="size-6 text-primary" aria-hidden />
              <h3 className="text-xl font-semibold text-foreground">Your action plan</h3>
            </div>
            <ol className="mt-5 grid gap-3 md:grid-cols-2">
              {[...gaps, ...weakBoth, ...dims.filter((d) => !gaps.includes(d) && !weakBoth.includes(d))].slice(0, 4).map((d, i) => (
                <li key={d.key} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-sm text-muted">
                  <span className="font-mono text-primary">0{i + 1}</span>
                  <span>
                    <span className="block font-medium text-foreground">Improve {d.label}</span>
                    {advice[d.key]}
                  </span>
                </li>
              ))}
            </ol>
            <BookButton className="mt-6" size="lg">Get help winning this market</BookButton>
          </div>
        </div>
      )}
    </div>
  );
}
