"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Megaphone, XCircle } from "lucide-react";
import type { AuditReport } from "@/lib/audit/types";
import { submitLead } from "@/lib/submit-lead";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/charts/score-ring";
import { BarChart } from "@/components/charts/charts";
import { BookButton } from "@/components/shared/cta-buttons";

type A = {
  website: string;
  email: string;
  googleAds: "yes" | "no";
  gStructure: "tight" | "few" | "unsure";
  negatives: "weekly" | "sometimes" | "never";
  metaAds: "yes" | "no";
  creatives: "monthly" | "quarterly" | "rarely";
  audiences: "lookalike" | "interests" | "broad";
  landing: "dedicated" | "service" | "homepage";
  tracking: "full" | "forms" | "none" | "unsure";
  offline: "yes" | "no";
  remarketing: "both" | "one" | "none";
  followUp: "5min" | "1hr" | "sameday" | "nextday";
};

type Finding = { area: string; ok: boolean; text: string };

function evaluate(a: A, site: AuditReport | null) {
  const f: Finding[] = [];
  const add = (area: string, ok: boolean, good: string, bad: string) => f.push({ area, ok, text: ok ? good : bad });
  const detectedTracking = site ? site.signals.analytics.ga || site.signals.analytics.gtm : false;
  const detectedPixel = site ? site.signals.analytics.metaPixel : false;

  let g = 0;
  if (a.googleAds === "yes") {
    g = 30 + (a.gStructure === "tight" ? 35 : a.gStructure === "few" ? 10 : 15) + (a.negatives === "weekly" ? 35 : a.negatives === "sometimes" ? 18 : 0);
    add("Google Ads", a.gStructure === "tight", "Campaigns are organised into tight, intent-based ad groups.", "Group keywords into tight, intent-based ad groups with matching ads and landing pages.");
    add("Google Ads", a.negatives === "weekly", "Negative keywords are managed regularly.", "Review search terms weekly and add negative keywords to stop paying for irrelevant clicks.");
  } else {
    g = 20;
    add("Google Ads", false, "", "You're not capturing people actively searching for your services. Start with high-intent Search campaigns.");
  }

  let m = 0;
  if (a.metaAds === "yes") {
    m = 30 + (a.creatives === "monthly" ? 35 : a.creatives === "quarterly" ? 18 : 5) + (a.audiences === "lookalike" ? 35 : a.audiences === "interests" ? 22 : 15);
    add("Meta Ads", a.creatives === "monthly", "Creatives are refreshed regularly to avoid ad fatigue.", "Refresh ad creatives at least monthly; fatigue quietly raises your cost per lead.");
    add("Meta Ads", a.audiences === "lookalike", "Lookalike audiences built from customers.", "Build lookalike audiences from your customer list for better lead quality.");
  } else {
    m = 25;
    add("Meta Ads", false, "", "Facebook & Instagram could build demand and retarget visitors, especially for visual or new offers.");
  }

  let lp = a.landing === "dedicated" ? 70 : a.landing === "service" ? 45 : 15;
  if (site) {
    const conv = site.categories.find((c) => c.key === "conversion")?.score ?? 50;
    const spd = site.categories.find((c) => c.key === "speed")?.score ?? 50;
    lp = Math.round(lp * 0.5 + conv * 0.3 + spd * 0.2);
  }
  add("Landing Pages", a.landing === "dedicated", "Ads point to dedicated landing pages.", "Send each campaign to a dedicated landing page with one clear offer, not your homepage.");

  let t = { full: 70, forms: 45, none: 5, unsure: 25 }[a.tracking] + (a.offline === "yes" ? 30 : 0);
  if (site && !detectedTracking) t = Math.min(t, 35);
  add("Conversion Tracking", a.tracking === "full", "Calls, forms and chats are tracked as conversions.", "Track every conversion type (calls, forms, WhatsApp clicks, bookings) so ad platforms optimise for real leads.");
  add("Conversion Tracking", a.offline === "yes", "Sales outcomes are sent back to ad platforms.", "Import offline conversions (qualified leads and sales) from your CRM to improve lead quality.");
  if (site) add("Conversion Tracking", detectedTracking, "Google Analytics / Tag Manager detected on your site.", "We couldn't detect Google Analytics or Tag Manager on your homepage.");

  let r = { both: 90, one: 55, none: 10 }[a.remarketing];
  if (site && a.remarketing !== "none" && !detectedPixel) r = Math.min(r, 50);
  add("Remarketing", a.remarketing === "both", "Remarketing runs on both Google and Meta.", "Retarget website visitors who didn't enquire; they're often your cheapest conversions.");
  if (site) add("Remarketing", detectedPixel, "Meta Pixel detected on your site.", "No Meta Pixel detected, so you can't retarget or optimise Meta campaigns properly.");

  const followOk = a.followUp === "5min";
  add("Lead Follow-up", followOk, "Leads are contacted within 5 minutes.", "Reply to leads within 5 minutes with automated WhatsApp/SMS. Slow follow-up wastes ad spend.");

  const scores = { "Google Ads": Math.min(100, g), "Meta Ads": Math.min(100, m), "Landing Pages": Math.min(100, lp), "Conversion Tracking": Math.min(100, t), Remarketing: Math.min(100, r) };
  const overall = Math.round(Object.values(scores).reduce((s, v) => s + v, 0) / 5 * 0.85 + (followOk ? 15 : a.followUp === "1hr" ? 9 : 3));
  return { scores, overall: Math.min(100, overall), findings: f };
}

export function MarketingAudit() {
  const [a, setA] = useState<A>({ website: "", email: "", googleAds: "yes", gStructure: "unsure", negatives: "sometimes", metaAds: "yes", creatives: "quarterly", audiences: "interests", landing: "homepage", tracking: "unsure", offline: "no", remarketing: "none", followUp: "sameday" });
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<ReturnType<typeof evaluate> | null>(null);
  const set = <K extends keyof A>(k: K, v: A[K]) => setA((x) => ({ ...x, [k]: v }));
  const sel = (id: keyof A, label: string, opts: [string, string][], disabled = false) => (
    <div className={disabled ? "opacity-40" : ""}>
      <Label htmlFor={`ma-${id}`}>{label}</Label>
      <Select id={`ma-${id}`} value={a[id]} disabled={disabled} onChange={(e) => set(id, e.target.value as never)}>
        {opts.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </Select>
    </div>
  );

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (/^\S+@\S+\.\S+$/.test(a.email)) submitLead("digital-marketing-audit", a).catch(() => {});
    let site: AuditReport | null = null;
    if (a.website.trim()) {
      const j = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: a.website }) }).then((r) => r.json()).catch(() => null);
      if (j?.ok) site = j.report;
    }
    setRes(evaluate(a, site));
    setBusy(false);
    setTimeout(() => document.getElementById("ma-results")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const areas = res ? Array.from(new Set(res.findings.map((f) => f.area))) : [];

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={run} className="glass-strong border-gradient grid gap-5 rounded-[2rem] p-6 md:grid-cols-3 md:p-8">
        <div className="md:col-span-2">
          <Label htmlFor="ma-w">Website (we&apos;ll check for tracking pixels)</Label>
          <Input id="ma-w" inputMode="url" value={a.website} onChange={(e) => set("website", e.target.value)} placeholder="yourbusiness.com" />
        </div>
        <div>
          <Label htmlFor="ma-e">Email (optional)</Label>
          <Input id="ma-e" type="email" value={a.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary md:col-span-3">Google Ads</p>
        {sel("googleAds", "Running Google Ads?", [["yes", "Yes"], ["no", "No"]])}
        {sel("gStructure", "Campaign structure", [["tight", "Tight ad groups by intent"], ["few", "One or two broad campaigns"], ["unsure", "Not sure"]], a.googleAds === "no")}
        {sel("negatives", "Negative keyword reviews", [["weekly", "Weekly"], ["sometimes", "Occasionally"], ["never", "Never"]], a.googleAds === "no")}
        <p className="text-xs font-semibold uppercase tracking-wider text-primary md:col-span-3">Meta Ads</p>
        {sel("metaAds", "Running Meta (FB/IG) Ads?", [["yes", "Yes"], ["no", "No"]])}
        {sel("creatives", "Creative refresh", [["monthly", "Monthly or more"], ["quarterly", "Every few months"], ["rarely", "Rarely"]], a.metaAds === "no")}
        {sel("audiences", "Audience targeting", [["lookalike", "Lookalikes from customers"], ["interests", "Interests"], ["broad", "Broad / boosted posts"]], a.metaAds === "no")}
        <p className="text-xs font-semibold uppercase tracking-wider text-primary md:col-span-3">Funnel & tracking</p>
        {sel("landing", "Where do ads send people?", [["dedicated", "Dedicated landing pages"], ["service", "Service pages"], ["homepage", "Homepage"]])}
        {sel("tracking", "Conversion tracking", [["full", "Calls, forms & chats tracked"], ["forms", "Forms only"], ["none", "None"], ["unsure", "Not sure"]])}
        {sel("offline", "Sales data sent back to ad platforms?", [["yes", "Yes"], ["no", "No / not sure"]])}
        {sel("remarketing", "Remarketing", [["both", "Google & Meta"], ["one", "One platform"], ["none", "None"]])}
        {sel("followUp", "Typical lead response time", [["5min", "Under 5 minutes"], ["1hr", "Within an hour"], ["sameday", "Same day"], ["nextday", "Next day or later"]])}
        <div className="flex items-end">
          <Button type="submit" variant="gradient" size="lg" className="h-12 w-full" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <Megaphone />} Run my audit
          </Button>
        </div>
      </form>

      {res && (
        <div id="ma-results" className="flex scroll-mt-28 flex-col gap-6" aria-live="polite">
          <div className="glass border-gradient grid items-center gap-8 rounded-3xl p-6 md:grid-cols-[auto_1fr] md:p-10">
            <ScoreRing score={res.overall} size={160} stroke={13} label="Marketing" />
            <BarChart label="Marketing audit scores by area" height={200} data={Object.entries(res.scores).map(([k, v], i) => ({ label: k, value: v, color: ["#00F5FF", "#7B61FF", "#00FF9D", "#FFC75F", "#00F5FF"][i] }))} />
          </div>
          <div className="glass rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-foreground">Audit report</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {areas.map((area) => (
                <section key={area}>
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">{area}</h4>
                  <ul className="flex flex-col gap-2.5">
                    {res.findings.filter((f) => f.area === area).map((f) => (
                      <li key={f.text} className="flex gap-2.5 text-sm">
                        {f.ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-label="Good" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-label="Fix" />}
                        <span className={f.ok ? "text-muted" : "text-foreground/90"}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <BookButton booking="marketing" className="mt-8" size="lg">Book a marketing strategy session</BookButton>
          </div>
        </div>
      )}
    </div>
  );
}
