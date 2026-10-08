"use client";

import { useState } from "react";
import { Bot, Clock, Loader2, Wallet, Users } from "lucide-react";
import { industryOptions } from "@/lib/validation";
import { painPointOptions, runAdvisor, type AdvisorInput } from "@/lib/tools/automation-advisor";
import { submitLead } from "@/lib/submit-lead";
import { formatCurrency, cn } from "@/lib/utils";
import { useUI } from "@/store/ui-store";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { BarChart } from "@/components/charts/charts";
import { NumberField, StatTile } from "./tool-shell";
import { BookButton } from "@/components/shared/cta-buttons";

export function AutomationAdvisor() {
  const currency = useUI((s) => s.currency);
  const [input, setInput] = useState<AdvisorInput>({ industry: "Dental Clinic", employees: 8, leads: 150, customers: 300, hourlyCost: currency === "INR" ? 350 : 20, painPoints: ["missed-calls", "slow-followup"] });
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ReturnType<typeof runAdvisor> | null>(null);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof AdvisorInput>(k: K, v: AdvisorInput[K]) => setInput((s) => ({ ...s, [k]: v }));
  const toggle = (id: string) => set("painPoints", input.painPoints.includes(id) ? input.painPoints.filter((p) => p !== id) : [...input.painPoints, id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (/^\S+@\S+\.\S+$/.test(email)) submitLead("automation-advisor", { ...input, email }).catch(() => {});
    await new Promise((r) => setTimeout(r, 700));
    setResult(runAdvisor(input));
    setBusy(false);
    setTimeout(() => document.getElementById("advisor-results")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={submit} className="glass-strong border-gradient grid gap-6 rounded-[2rem] p-6 md:grid-cols-2 md:p-8">
        <div>
          <Label htmlFor="aa-ind">Industry</Label>
          <Select id="aa-ind" value={input.industry} onChange={(e) => set("industry", e.target.value)}>
            {industryOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </div>
        <NumberField id="aa-emp" label="Employees" value={input.employees} onChange={(v) => set("employees", v)} min={1} max={200} />
        <NumberField id="aa-leads" label="New leads per month" value={input.leads} onChange={(v) => set("leads", v)} min={0} max={3000} step={10} />
        <NumberField id="aa-cust" label="Customers served per month" value={input.customers} onChange={(v) => set("customers", v)} min={0} max={5000} step={10} />
        <NumberField id="aa-cost" label={`Average staff cost per hour (${currency})`} value={input.hourlyCost} onChange={(v) => set("hourlyCost", v)} min={1} max={currency === "INR" ? 3000 : 150} prefix={currency === "INR" ? "₹" : "$"} />
        <div>
          <Label htmlFor="aa-email">Email (optional, to receive your roadmap)</Label>
          <Input id="aa-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
        </div>
        <fieldset className="md:col-span-2">
          <legend className="mb-3 text-xs font-medium tracking-wide text-muted">Biggest pain points (choose all that apply)</legend>
          <div className="flex flex-wrap gap-2">
            {painPointOptions.map((p) => {
              const on = input.painPoints.includes(p.id);
              return (
                <button
                  type="button"
                  key={p.id}
                  aria-pressed={on}
                  onClick={() => toggle(p.id)}
                  className={cn("rounded-full border px-4 py-2 text-sm transition-colors", on ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-muted hover:text-foreground")}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <Button type="submit" variant="gradient" size="lg" className="md:col-span-2" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <Bot />} Find my automation opportunities
        </Button>
      </form>

      {result && (
        <div id="advisor-results" className="flex scroll-mt-28 flex-col gap-8" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Time savings" value={`${result.totalHours.toLocaleString("en-IN")} hrs/mo`} sub="Estimated hours freed up" />
            <StatTile label="Cost savings" value={formatCurrency(result.monthlySavings, currency)} sub="per month" accent="#00FF9D" />
            <StatTile label="Annual savings" value={formatCurrency(result.annualSavings, currency)} sub="per year" accent="#00FF9D" />
            <StatTile label="Capacity unlocked" value={`${result.fteEquivalent.toFixed(1)} FTE`} sub="Full-time equivalent" accent="#7B61FF" />
          </div>
          <div className="glass rounded-3xl p-6 md:p-8">
            <h3 className="mb-6 text-xl font-semibold text-foreground">Hours saved per month by area</h3>
            <BarChart label="Hours saved per month by automation area" data={result.opportunities.map((o, i) => ({ label: o.title.replace(" Automation", ""), value: o.hours, color: ["#00F5FF", "#7B61FF", "#00FF9D", "#00F5FF", "#7B61FF", "#00FF9D"][i] }))} format={(v) => `${v}h`} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {result.opportunities.map((o) => (
              <article key={o.key} className="glass rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon name={o.icon} className="size-5" />
                    </span>
                    <h3 className="font-semibold text-foreground">{o.title}</h3>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs", o.priority === "High" ? "bg-accent/15 text-accent" : o.priority === "Medium" ? "bg-primary/15 text-primary" : "bg-white/10 text-muted")}>{o.priority} priority</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{o.what}</p>
                <ul className="mt-3 flex flex-col gap-1.5 text-sm text-foreground/90">
                  {o.how.map((h) => (
                    <li key={h} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />{h}</li>
                  ))}
                </ul>
                <p className="mt-4 flex items-center gap-4 border-t border-white/8 pt-3 text-xs text-muted">
                  <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-primary" aria-hidden /> ~{o.hours} hrs/month</span>
                  <span className="flex items-center gap-1.5"><Wallet className="size-3.5 text-accent" aria-hidden /> {formatCurrency(o.hours * input.hourlyCost, currency)}/month</span>
                </p>
              </article>
            ))}
          </div>
          <div className="glass border-gradient rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-foreground">Your 90-day automation roadmap</h3>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {result.roadmap.map((r) => (
                <li key={r.window} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <p className="font-mono text-xs text-primary">{r.window}</p>
                  <p className="mt-1 font-semibold text-foreground">{r.title}</p>
                  <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                    {r.items.map((i) => (
                      <li key={i} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />{i}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex items-start gap-2 text-xs text-subtle">
              <Users className="mt-0.5 size-3.5 shrink-0" aria-hidden /> Estimates are directional, based on typical task times. Automation frees your team for higher-value work; it isn&apos;t about cutting staff.
            </p>
            <BookButton booking="automation" className="mt-5" size="lg">Book an automation call</BookButton>
          </div>
        </div>
      )}
    </div>
  );
}
