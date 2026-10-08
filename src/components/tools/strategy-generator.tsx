"use client";

import { useState } from "react";
import { BrainCircuit, Headphones, Loader2, Megaphone, Printer, Target, Workflow, Zap } from "lucide-react";
import { industryOptions } from "@/lib/validation";
import { challengeOptions, generateStrategy, goalOptions, type Strategy, type StrategyInput } from "@/lib/tools/strategy";
import { submitLead } from "@/lib/submit-lead";
import { cn } from "@/lib/utils";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookButton } from "@/components/shared/cta-buttons";
import { ScoreRing } from "@/components/charts/score-ring";
import { NumberField } from "./tool-shell";

function Chips({ legend, options, value, onChange }: { legend: string; options: readonly { id: string; label: string }[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset className="md:col-span-2">
      <legend className="mb-3 text-xs font-medium tracking-wide text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o.id);
          return (
            <button
              type="button"
              key={o.id}
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((v) => v !== o.id) : [...value, o.id])}
              className={cn("rounded-full border px-4 py-2 text-sm transition-colors", on ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-muted hover:text-foreground")}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ListCard({ title, icon: IconCmp, items, color }: { title: string; icon: typeof Zap; items: string[]; color: string }) {
  return (
    <article className="glass rounded-3xl p-6">
      <h3 className="flex items-center gap-3 font-semibold text-foreground">
        <span className="flex size-10 items-center justify-center rounded-xl" style={{ background: `${color}1a`, color }}>
          <IconCmp className="size-5" aria-hidden />
        </span>
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5 text-sm leading-relaxed text-foreground/90">
        {items.map((i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ background: color }} />
            {i}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function StrategyGenerator() {
  const [input, setInput] = useState<StrategyInput>({ businessName: "", industry: "Dental Clinic", employees: 6, monthlyLeads: 120, goals: ["more-leads", "save-time"], challenges: ["missed-calls", "slow-followup"] });
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Strategy | null>(null);
  const set = <K extends keyof StrategyInput>(k: K, v: StrategyInput[K]) => setInput((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (/^\S+@\S+\.\S+$/.test(email)) submitLead("ai-strategy-generator", { ...input, email }).catch(() => {});
    await new Promise((r) => setTimeout(r, 900));
    setResult(generateStrategy(input));
    setBusy(false);
    setTimeout(() => document.getElementById("strategy-results")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={submit} className="glass-strong border-gradient grid gap-6 rounded-[2rem] p-6 md:grid-cols-2 md:p-8 print:hidden">
        <div>
          <Label htmlFor="sg-name">Business name</Label>
          <Input id="sg-name" value={input.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="e.g. Smile Studio Dental" maxLength={120} />
        </div>
        <div>
          <Label htmlFor="sg-ind">Industry</Label>
          <Select id="sg-ind" value={input.industry} onChange={(e) => set("industry", e.target.value)}>
            {industryOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </div>
        <NumberField id="sg-emp" label="Employees" value={input.employees} onChange={(v) => set("employees", v)} min={1} max={500} />
        <NumberField id="sg-leads" label="New leads per month" value={input.monthlyLeads} onChange={(v) => set("monthlyLeads", v)} min={0} max={5000} step={10} />
        <Chips legend="Your goals for the next 90 days" options={goalOptions} value={input.goals} onChange={(v) => set("goals", v)} />
        <Chips legend="Biggest challenges right now" options={challengeOptions} value={input.challenges} onChange={(v) => set("challenges", v)} />
        <div className="md:col-span-2">
          <Label htmlFor="sg-email">Email (optional, to receive a copy of your plan)</Label>
          <Input id="sg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
        </div>
        <Button type="submit" variant="gradient" size="lg" className="md:col-span-2" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <BrainCircuit />} {busy ? "Generating your plan…" : "Generate my 90-day AI growth plan"}
        </Button>
      </form>

      {result && (
        <div id="strategy-results" className="flex scroll-mt-28 flex-col gap-8" aria-live="polite">
          <div className="glass-strong border-gradient flex flex-col gap-6 rounded-[2rem] p-6 md:flex-row md:items-center md:p-8">
            <ScoreRing score={result.maturity.score} size={130} label="AI readiness" />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-primary">{result.maturity.label}</p>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">Your AI growth strategy{input.businessName ? ` for ${input.businessName}` : ""}</h2>
              <p className="mt-3 leading-relaxed text-muted">{result.summary}</p>
            </div>
            <Button variant="secondary" onClick={() => window.print()} className="print:hidden">
              <Printer /> Save as PDF
            </Button>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Zap className="size-5 text-accent" aria-hidden /> Quick wins for this week
            </h3>
            <ol className="mt-4 grid gap-3 md:grid-cols-2">
              {result.quickWins.map((q, i) => (
                <li key={q} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-sm text-foreground/90">
                  <span className="font-mono text-accent">0{i + 1}</span>
                  {q}
                </li>
              ))}
            </ol>
          </div>

          <div className="glass border-gradient rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-foreground">90-day AI growth plan</h3>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {result.plan.map((p, i) => (
                <li key={p.window} className="relative rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <span className="absolute -top-px left-5 right-5 h-px" style={{ background: ["#00F5FF", "#7B61FF", "#00FF9D"][i] }} aria-hidden />
                  <p className="font-mono text-xs text-primary">{p.window}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{p.title}</p>
                  <p className="mt-1 text-xs text-muted">{p.focus}</p>
                  <ul className="mt-4 flex flex-col gap-2 text-sm text-foreground/90">
                    {p.items.map((it) => (
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

          <div className="grid gap-4 md:grid-cols-2">
            <ListCard title="Automation opportunities" icon={Workflow} items={result.automations} color="#00F5FF" />
            <ListCard title="Marketing improvements" icon={Megaphone} items={result.marketing} color="#7B61FF" />
            <ListCard title="Support improvements" icon={Headphones} items={result.support} color="#00FF9D" />
            <ListCard title="Lead generation plan" icon={Target} items={result.leadGen} color="#00F5FF" />
          </div>

          <div className="glass rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground">What to measure</h3>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {result.kpis.map((k) => (
                <div key={k.label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                  <dt className="text-xs text-muted">{k.label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-gradient">{k.target}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs text-subtle">Targets are typical ranges we aim for with similar businesses, not guarantees. Your results depend on your market, offer and execution.</p>
            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <BookButton booking="consultation" size="lg">Build this plan with D Expert</BookButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
