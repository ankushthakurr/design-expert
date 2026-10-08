"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useUI } from "@/store/ui-store";
import { savingsCalc } from "@/lib/tools/roi";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { DonutChart } from "@/components/charts/charts";
import { NumberField, StatTile } from "./tool-shell";
import { CurrencyToggle } from "@/components/pricing/pricing-cards";
import { BookButton } from "@/components/shared/cta-buttons";
import { Button } from "@/components/ui/button";

type Task = { name: string; hoursPerWeek: number; people: number; automatable: number };
const presets: Task[] = [
  { name: "Lead follow-up & data entry", hoursPerWeek: 6, people: 2, automatable: 70 },
  { name: "Scheduling & reminders", hoursPerWeek: 5, people: 1, automatable: 80 },
  { name: "Answering repetitive questions", hoursPerWeek: 8, people: 2, automatable: 60 },
  { name: "Reporting & spreadsheets", hoursPerWeek: 3, people: 1, automatable: 85 },
];
const palette = ["#00F5FF", "#7B61FF", "#00FF9D", "#FFC75F", "#FF8A5C", "#9AA3C7"];

export function SavingsCalculator() {
  const currency = useUI((s) => s.currency);
  const [tasks, setTasks] = useState<Task[]>(presets);
  const [hourly, setHourly] = useState(currency === "INR" ? 350 : 22);
  const r = useMemo(() => savingsCalc({ tasks, hourlyCost: hourly }), [tasks, hourly]);
  const upd = (idx: number, patch: Partial<Task>) => setTasks((ts) => ts.map((t, i) => (i === idx ? { ...t, ...patch } : t)));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="w-full max-w-xs">
          <NumberField id="s-hourly" label="Average hourly staff cost" value={hourly} onChange={setHourly} min={1} max={currency === "INR" ? 3000 : 150} prefix={currency === "INR" ? "₹" : "$"} />
        </div>
        <CurrencyToggle />
      </div>
      <div className="grid gap-4">
        {tasks.map((t, idx) => (
          <div key={idx} className="glass grid gap-4 rounded-2xl p-5 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-end">
            <div>
              <label htmlFor={`t-name-${idx}`} className="mb-1.5 block text-xs font-medium text-muted">Task</label>
              <input id={`t-name-${idx}`} value={t.name} onChange={(e) => upd(idx, { name: e.target.value })} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-foreground focus:border-primary/60 focus:outline-none" />
            </div>
            <NumberField id={`t-h-${idx}`} label="Hours/week each" value={t.hoursPerWeek} onChange={(v) => upd(idx, { hoursPerWeek: v })} min={0} max={40} />
            <NumberField id={`t-p-${idx}`} label="People" value={t.people} onChange={(v) => upd(idx, { people: v })} min={1} max={50} />
            <NumberField id={`t-a-${idx}`} label="Automatable" value={t.automatable} onChange={(v) => upd(idx, { automatable: v })} min={0} max={100} suffix="%" />
            <Button variant="ghost" size="icon" aria-label={`Remove ${t.name}`} onClick={() => setTasks((ts) => ts.filter((_, i) => i !== idx))} disabled={tasks.length <= 1}>
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button variant="secondary" className="w-fit" onClick={() => setTasks((ts) => [...ts, { name: "New task", hoursPerWeek: 3, people: 1, automatable: 60 }])} disabled={tasks.length >= 6}>
          <Plus /> Add task
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
        <StatTile label="Time saved" value={`${formatNumber(r.totalHours)} hrs/mo`} />
        <StatTile label="Money saved" value={formatCurrency(r.monthlySavings, currency)} sub={`${formatCurrency(r.annualSavings, currency)} per year`} accent="#00FF9D" />
        <StatTile label="Employee productivity" value={`+${r.productivity.toFixed(0)}%`} sub="More time for high-value work" accent="#7B61FF" />
        <StatTile label="Efficiency gain" value={`${r.efficiency.toFixed(0)}%`} sub="Of manual task time removed" accent="#FFC75F" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h3 className="mb-5 text-sm font-semibold text-foreground">Where the hours come from</h3>
          <DonutChart segments={r.rows.map((row, i) => ({ label: row.name, value: Math.max(0.01, row.hoursSaved), color: palette[i % palette.length] }))} centerValue={`${formatNumber(r.totalHours)}h`} centerLabel="per month" />
        </div>
        <div className="glass border-gradient rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-foreground">In plain English</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Automating these tasks could give your team back about <span className="text-foreground">{formatNumber(r.totalHours)} hours every month</span>, roughly <span className="text-foreground">{(r.totalHours / 173).toFixed(1)} full-time people&apos;s worth of time</span>, worth around <span className="text-accent">{formatCurrency(r.monthlySavings, currency)}</span>. Most businesses reinvest that time in sales, service quality and growth rather than cutting staff.
          </p>
          <BookButton booking="automation" className="mt-5" size="lg">Plan my automations</BookButton>
        </div>
      </div>
    </div>
  );
}
