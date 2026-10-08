"use client";

import { useMemo, useState } from "react";
import { useUI } from "@/store/ui-store";
import { websiteROI, marketingROI, automationROI, leadGenROI } from "@/lib/tools/roi";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import { BarChart } from "@/components/charts/charts";
import { NumberField, StatTile } from "./tool-shell";
import { CurrencyToggle } from "@/components/pricing/pricing-cards";
import { VoiceRoiCalculator } from "./voice-roi-calculator";
import { Icon } from "@/components/shared/icon";

const tabs = [
  { id: "website", label: "Website ROI", icon: "MonitorSmartphone" },
  { id: "marketing", label: "Marketing ROI", icon: "Megaphone" },
  { id: "automation", label: "AI Automation ROI", icon: "Workflow" },
  { id: "voice", label: "AI Voice Agent ROI", icon: "AudioLines" },
  { id: "leadgen", label: "Lead Generation ROI", icon: "Users" },
] as const;
type Tab = (typeof tabs)[number]["id"];

function Panel({ inputs, outputs, chart, explain }: { inputs: React.ReactNode; outputs: React.ReactNode; chart: React.ReactNode; explain: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="glass-strong border-gradient flex flex-col gap-6 rounded-[2rem] p-6 md:p-8">{inputs}</div>
      <div className="flex flex-col gap-4" aria-live="polite">
        <div className="grid gap-4 sm:grid-cols-2">{outputs}</div>
        <div className="glass rounded-3xl p-6">{chart}</div>
        <div className="glass rounded-3xl p-6 text-sm leading-relaxed text-muted">{explain}</div>
      </div>
    </div>
  );
}

function WebsiteTab() {
  const c = useUI((s) => s.currency);
  const sym = c === "INR" ? "₹" : "$";
  const [i, setI] = useState({ visitors: 2000, currentCR: 1.5, improvedCR: 3.5, leadToCustomer: 25, avgSale: c === "INR" ? 8000 : 400, investment: c === "INR" ? 150000 : 4000 });
  const r = useMemo(() => websiteROI(i), [i]);
  const set = (k: keyof typeof i) => (v: number) => setI((s) => ({ ...s, [k]: v }));
  return (
    <Panel
      inputs={
        <>
          <NumberField id="w-v" label="Monthly website visitors" value={i.visitors} onChange={set("visitors")} min={100} max={100000} step={100} />
          <NumberField id="w-c" label="Current conversion rate" value={i.currentCR} onChange={set("currentCR")} min={0.1} max={20} step={0.1} suffix="%" />
          <NumberField id="w-i" label="Improved conversion rate" value={i.improvedCR} onChange={set("improvedCR")} min={0.1} max={30} step={0.1} suffix="%" />
          <NumberField id="w-l" label="Lead → customer rate" value={i.leadToCustomer} onChange={set("leadToCustomer")} min={1} max={100} suffix="%" />
          <NumberField id="w-s" label="Average sale value" value={i.avgSale} onChange={set("avgSale")} min={10} max={c === "INR" ? 500000 : 20000} step={c === "INR" ? 500 : 10} prefix={sym} />
          <NumberField id="w-inv" label="Website investment" value={i.investment} onChange={set("investment")} min={0} max={c === "INR" ? 2000000 : 50000} step={c === "INR" ? 5000 : 100} prefix={sym} />
        </>
      }
      outputs={
        <>
          <StatTile label="Extra leads / month" value={formatNumber(r.extraLeads)} />
          <StatTile label="Extra revenue / month" value={formatCurrency(r.extraRevenueMonthly, c)} accent="#00FF9D" />
          <StatTile label="First-year ROI" value={`${formatNumber(r.roi)}%`} accent="#7B61FF" />
          <StatTile label="Payback period" value={Number.isFinite(r.paybackMonths) ? `${r.paybackMonths.toFixed(1)} months` : "—"} accent="#FFC75F" />
        </>
      }
      chart={<BarChart label="Leads per month before and after" data={[{ label: "Leads now", value: r.currentLeads, color: "#9AA3C7" }, { label: "Leads after redesign", value: r.newLeads, color: "#00FF9D" }]} format={formatNumber} height={180} />}
      explain={<>Improving your conversion rate from {i.currentCR}% to {i.improvedCR}% turns the same traffic into <span className="text-foreground">{formatNumber(r.extraLeads)} more leads a month</span>, without spending more on ads. At your numbers the website pays for itself in about <span className="text-accent">{Number.isFinite(r.paybackMonths) ? r.paybackMonths.toFixed(1) : "—"} months</span>.</>}
    />
  );
}

function MarketingTab() {
  const c = useUI((s) => s.currency);
  const sym = c === "INR" ? "₹" : "$";
  const [i, setI] = useState({ adSpend: c === "INR" ? 60000 : 1500, cpc: c === "INR" ? 35 : 3, landingCR: 8, closeRate: 20, avgSale: c === "INR" ? 12000 : 600, mgmtFee: c === "INR" ? 25000 : 500 });
  const r = useMemo(() => marketingROI(i), [i]);
  const set = (k: keyof typeof i) => (v: number) => setI((s) => ({ ...s, [k]: v }));
  return (
    <Panel
      inputs={
        <>
          <NumberField id="m-s" label="Monthly ad spend" value={i.adSpend} onChange={set("adSpend")} min={0} max={c === "INR" ? 1000000 : 50000} step={c === "INR" ? 5000 : 100} prefix={sym} />
          <NumberField id="m-c" label="Cost per click" value={i.cpc} onChange={set("cpc")} min={1} max={c === "INR" ? 500 : 50} prefix={sym} />
          <NumberField id="m-l" label="Landing page conversion" value={i.landingCR} onChange={set("landingCR")} min={0.5} max={40} step={0.5} suffix="%" />
          <NumberField id="m-cl" label="Lead → customer rate" value={i.closeRate} onChange={set("closeRate")} min={1} max={100} suffix="%" />
          <NumberField id="m-a" label="Average sale value" value={i.avgSale} onChange={set("avgSale")} min={10} max={c === "INR" ? 500000 : 20000} step={c === "INR" ? 500 : 10} prefix={sym} />
          <NumberField id="m-f" label="Management fee" value={i.mgmtFee} onChange={set("mgmtFee")} min={0} max={c === "INR" ? 300000 : 10000} step={c === "INR" ? 1000 : 50} prefix={sym} />
        </>
      }
      outputs={
        <>
          <StatTile label="Leads / month" value={formatNumber(r.leads)} sub={`Cost per lead ${formatCurrency(r.cpl, c)}`} />
          <StatTile label="New customers" value={formatNumber(r.customers)} sub={`CAC ${formatCurrency(r.cac, c)}`} />
          <StatTile label="Revenue / month" value={formatCurrency(r.revenue, c)} accent="#00FF9D" />
          <StatTile label="ROAS · ROI" value={`${r.roas.toFixed(1)}x · ${formatNumber(r.roi)}%`} accent="#7B61FF" />
        </>
      }
      chart={<BarChart label="Monthly cost vs revenue" data={[{ label: "Total cost", value: r.cost, color: "#FF5C7A" }, { label: "Revenue", value: r.revenue, color: "#00FF9D" }]} format={(v) => formatCurrency(v, c)} height={180} />}
      explain={<>Spending {formatCurrency(i.adSpend, c)} a month at {sym}{i.cpc} per click brings about {formatNumber(r.clicks)} visitors. With a {i.landingCR}% landing page, that&apos;s <span className="text-foreground">{formatNumber(r.leads)} leads</span> and roughly <span className="text-foreground">{formatNumber(r.customers)} customers</span>. Every 1% improvement in landing page conversion lowers your cost per lead, which is why we build dedicated pages for every campaign.</>}
    />
  );
}

function AutomationTab() {
  const c = useUI((s) => s.currency);
  const sym = c === "INR" ? "₹" : "$";
  const [i, setI] = useState({ staff: 5, hoursPerWeek: 12, automatablePct: 50, hourlyCost: c === "INR" ? 350 : 22, investment: c === "INR" ? 120000 : 3000 });
  const r = useMemo(() => automationROI(i), [i]);
  const set = (k: keyof typeof i) => (v: number) => setI((s) => ({ ...s, [k]: v }));
  return (
    <Panel
      inputs={
        <>
          <NumberField id="a-s" label="Team members doing manual work" value={i.staff} onChange={set("staff")} min={1} max={200} />
          <NumberField id="a-h" label="Manual hours per person per week" value={i.hoursPerWeek} onChange={set("hoursPerWeek")} min={1} max={40} />
          <NumberField id="a-p" label="Share that can be automated" value={i.automatablePct} onChange={set("automatablePct")} min={5} max={95} suffix="%" />
          <NumberField id="a-c" label="Hourly staff cost" value={i.hourlyCost} onChange={set("hourlyCost")} min={1} max={c === "INR" ? 3000 : 150} prefix={sym} />
          <NumberField id="a-i" label="Automation investment" value={i.investment} onChange={set("investment")} min={0} max={c === "INR" ? 2000000 : 50000} step={c === "INR" ? 5000 : 100} prefix={sym} />
        </>
      }
      outputs={
        <>
          <StatTile label="Hours saved / month" value={formatNumber(r.hoursSavedMonth)} />
          <StatTile label="Savings / month" value={formatCurrency(r.monthlySavings, c)} accent="#00FF9D" />
          <StatTile label="First-year ROI" value={`${formatNumber(r.roi)}%`} accent="#7B61FF" />
          <StatTile label="Payback" value={Number.isFinite(r.paybackMonths) ? `${r.paybackMonths.toFixed(1)} months` : "—"} accent="#FFC75F" />
        </>
      }
      chart={<BarChart label="Annual savings vs investment" data={[{ label: "Investment", value: i.investment, color: "#9AA3C7" }, { label: "Year-1 savings", value: r.annual, color: "#00FF9D" }]} format={(v) => formatCurrency(v, c)} height={180} />}
      explain={<>Automating {i.automatablePct}% of the manual work frees about <span className="text-foreground">{formatNumber(r.hoursSavedMonth)} hours a month</span> across your team, worth <span className="text-accent">{formatCurrency(r.annual, c)} a year</span>. That&apos;s time your people can spend on customers and growth.</>}
    />
  );
}

function LeadGenTab() {
  const c = useUI((s) => s.currency);
  const sym = c === "INR" ? "₹" : "$";
  const [i, setI] = useState({ leads: 120, responseNowMins: 180, contactRateNow: 40, closeRate: 25, avgSale: c === "INR" ? 10000 : 500 });
  const r = useMemo(() => leadGenROI(i), [i]);
  const set = (k: keyof typeof i) => (v: number) => setI((s) => ({ ...s, [k]: v }));
  return (
    <Panel
      inputs={
        <>
          <NumberField id="l-l" label="Leads per month" value={i.leads} onChange={set("leads")} min={1} max={5000} step={5} />
          <NumberField id="l-r" label="Current average response time" value={i.responseNowMins} onChange={set("responseNowMins")} min={1} max={2880} step={5} suffix=" min" />
          <NumberField id="l-c" label="Leads you currently reach" value={i.contactRateNow} onChange={set("contactRateNow")} min={5} max={90} suffix="%" />
          <NumberField id="l-cl" label="Close rate once contacted" value={i.closeRate} onChange={set("closeRate")} min={1} max={100} suffix="%" />
          <NumberField id="l-a" label="Average sale value" value={i.avgSale} onChange={set("avgSale")} min={10} max={c === "INR" ? 500000 : 20000} step={c === "INR" ? 500 : 10} prefix={sym} />
        </>
      }
      outputs={
        <>
          <StatTile label="Contact rate after" value={`${r.contactAfter.toFixed(0)}%`} sub={`from ${i.contactRateNow}% today`} />
          <StatTile label="Extra customers / month" value={formatNumber(r.extraCustomers)} />
          <StatTile label="Extra revenue / month" value={formatCurrency(r.extraRevenueMonthly, c)} accent="#00FF9D" />
          <StatTile label="Extra revenue / year" value={formatCurrency(r.annual, c)} accent="#00FF9D" />
        </>
      }
      chart={<BarChart label="Customers per month now vs with instant follow-up" data={[{ label: "Customers now", value: r.customersNow, color: "#9AA3C7" }, { label: "With instant follow-up", value: r.customersAfter, color: "#00FF9D" }]} format={formatNumber} height={180} />}
      explain={<>Leads contacted within five minutes are far more likely to respond than leads contacted hours later. Automated instant replies and AI qualification could lift your contact rate to around <span className="text-foreground">{r.contactAfter.toFixed(0)}%</span>, adding about <span className="text-accent">{formatNumber(r.extraCustomers)} customers a month</span> from the leads you already pay for. (Conservative model; uplift is capped.)</>}
    />
  );
}

export function RoiSuite() {
  const [tab, setTab] = useState<Tab>("website");
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="ROI calculators" className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={cn("flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all", tab === t.id ? "border-primary bg-primary text-background shadow-glow" : "border-white/10 bg-white/5 text-muted hover:text-foreground")}
            >
              <Icon name={t.icon} className="size-4" /> {t.label}
            </button>
          ))}
        </div>
        {tab !== "voice" && <CurrencyToggle />}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "website" && <WebsiteTab />}
        {tab === "marketing" && <MarketingTab />}
        {tab === "automation" && <AutomationTab />}
        {tab === "voice" && <VoiceRoiCalculator />}
        {tab === "leadgen" && <LeadGenTab />}
      </div>
    </div>
  );
}
