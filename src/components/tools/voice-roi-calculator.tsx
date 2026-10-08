"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { useUI } from "@/store/ui-store";
import { voiceROI, VOICE_ASSUMPTIONS, type VoiceInput } from "@/lib/tools/roi";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { BarChart, LineChart } from "@/components/charts/charts";
import { NumberField, StatTile } from "./tool-shell";
import { CurrencyToggle } from "@/components/pricing/pricing-cards";
import { BookButton } from "@/components/shared/cta-buttons";

export function VoiceRoiCalculator({ compact = false }: { compact?: boolean }) {
  const currency = useUI((s) => s.currency);
  const sym = currency === "INR" ? "₹" : "$";
  const [i, setI] = useState<VoiceInput>({ callsPerDay: 40, missedPerDay: 8, avgSale: currency === "INR" ? 4000 : 250, conversionRate: 35, staffCost: currency === "INR" ? 25000 : 2800, daysPerMonth: 26 });
  const set = (k: keyof VoiceInput) => (v: number) => setI((s) => ({ ...s, [k]: k === "missedPerDay" ? Math.min(v, s.callsPerDay) : v }));
  const r = useMemo(() => voiceROI(i), [i]);
  const money = (v: number) => formatCurrency(v, currency);

  return (
    <div className="flex flex-col gap-8">
      {!compact && (
        <div className="flex justify-end">
          <CurrencyToggle />
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="glass-strong border-gradient flex flex-col gap-6 rounded-[2rem] p-6 md:p-8">
          <h3 className="text-lg font-semibold text-foreground">Your call numbers</h3>
          <NumberField id="v-calls" label="Calls per day" value={i.callsPerDay} onChange={set("callsPerDay")} min={1} max={500} />
          <NumberField id="v-missed" label="Missed calls per day" value={i.missedPerDay} onChange={set("missedPerDay")} min={0} max={i.callsPerDay} hint={`That's ${r.missRate.toFixed(0)}% of calls going unanswered`} />
          <NumberField id="v-sale" label="Average sale / customer value" value={i.avgSale} onChange={set("avgSale")} min={10} max={currency === "INR" ? 500000 : 20000} step={currency === "INR" ? 500 : 10} prefix={sym} />
          <NumberField id="v-conv" label="Conversion rate (caller → customer)" value={i.conversionRate} onChange={set("conversionRate")} min={1} max={100} suffix="%" />
          <NumberField id="v-staff" label="Front-desk staff cost per month" value={i.staffCost} onChange={set("staffCost")} min={0} max={currency === "INR" ? 200000 : 10000} step={currency === "INR" ? 1000 : 100} prefix={sym} />
          <NumberField id="v-days" label="Business days per month" value={i.daysPerMonth} onChange={set("daysPerMonth")} min={1} max={31} />
        </div>
        <div className="flex flex-col gap-4" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatTile label="Monthly revenue opportunity" value={money(r.monthly)} sub="From recovered missed calls" accent="#00FF9D" />
            <StatTile label="Annual opportunity" value={money(r.annual)} sub="Over 12 months" accent="#00FF9D" />
            <StatTile label="Lead recovery potential" value={`${formatNumber(r.recoveredLeads)} leads/mo`} sub={`${formatNumber(r.newCustomers)} new customers per month`} />
            <StatTile label="Support hours covered" value={`${formatNumber(r.supportHours)} hrs/mo`} sub={`≈ ${money(r.staffTimeValue)} of staff time freed`} accent="#7B61FF" />
          </div>
          <div className="glass rounded-3xl p-6">
            <h4 className="mb-4 text-sm font-semibold text-foreground">Monthly call funnel</h4>
            <BarChart
              label="Missed calls, calls recovered by AI, new leads and new customers per month"
              height={200}
              data={[
                { label: "Missed calls", value: r.missedMonth, color: "#FF5C7A" },
                { label: "Answered by AI", value: r.recoveredCalls, color: "#00F5FF" },
                { label: "New leads", value: r.recoveredLeads, color: "#7B61FF" },
                { label: "New customers", value: r.newCustomers, color: "#00FF9D" },
              ]}
              format={(v) => formatNumber(v)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-3xl p-6">
          <h4 className="mb-4 text-sm font-semibold text-foreground">Cumulative revenue recovered (first 12 months)</h4>
          <LineChart label="Cumulative recovered revenue over 12 months" labels={["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"]} series={[{ name: "Recovered revenue", values: r.cumulative, color: "#00F5FF" }]} format={money} />
        </div>
        <div className="glass border-gradient rounded-3xl p-6">
          <h4 className="text-lg font-semibold text-foreground">What this means in plain English</h4>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            You&apos;re currently missing about <span className="text-foreground">{formatNumber(r.missedMonth)} calls a month</span>. If an AI voice agent answered those calls, around <span className="text-foreground">{formatNumber(r.recoveredLeads)} would likely be new enquiries</span>, and at your conversion rate that&apos;s roughly <span className="text-foreground">{formatNumber(r.newCustomers)} extra customers</span> worth <span className="text-accent">{money(r.monthly)} a month</span>.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The AI would also handle routine calls, freeing roughly <span className="text-foreground">{formatNumber(r.supportHours)} hours</span> of your team&apos;s time each month for in-person customers. It supports your staff; it doesn&apos;t replace them.
          </p>
          <BookButton booking="aiDemo" className="mt-5 w-full" size="lg">Hear an AI agent for your business</BookButton>
        </div>
      </div>
      <p className="flex items-start gap-2 text-xs text-subtle">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        Assumptions: AI answers {VOICE_ASSUMPTIONS.aiAnswerRate * 100}% of missed calls; {VOICE_ASSUMPTIONS.newBusinessShare * 100}% of missed calls are new-business enquiries; AI handles {VOICE_ASSUMPTIONS.aiHandledShare * 100}% of routine answered calls at ~{VOICE_ASSUMPTIONS.minutesPerCall} min each; recovery ramps up over the first 3 months. Estimates are directional, not guarantees.
      </p>
    </div>
  );
}
