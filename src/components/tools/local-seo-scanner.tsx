"use client";

import { useState } from "react";
import { Loader2, MapPin, Star } from "lucide-react";
import type { AuditReport } from "@/lib/audit/types";
import { submitLead } from "@/lib/submit-lead";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScoreRing, ScoreBar } from "@/components/charts/score-ring";
import { NumberField } from "./tool-shell";
import { BookButton } from "@/components/shared/cta-buttons";

type S = {
  business: string;
  city: string;
  website: string;
  email: string;
  claimed: "yes" | "no" | "unsure";
  category: "yes" | "no" | "unsure";
  rating: number;
  reviews: number;
  newReviews: number;
  responds: "always" | "sometimes" | "never";
  photos: number;
  posts: "weekly" | "monthly" | "rarely" | "never";
  services: "yes" | "no";
  hours: "yes" | "no";
  nap: "yes" | "no" | "unsure";
  rank: "top3" | "4-10" | "11-20" | "none" | "unknown";
  competitorReviews: number;
};

function score(s: S, site: AuditReport | null) {
  let gbp = 0;
  gbp += s.claimed === "yes" ? 30 : 0;
  gbp += s.category === "yes" ? 15 : s.category === "unsure" ? 5 : 0;
  gbp += Math.min(20, (s.photos / 30) * 20);
  gbp += { weekly: 15, monthly: 9, rarely: 3, never: 0 }[s.posts];
  gbp += s.services === "yes" ? 10 : 0;
  gbp += s.hours === "yes" ? 10 : 0;

  let rev = 0;
  rev += Math.max(0, ((s.rating - 3) / 2) * 30);
  rev += Math.min(30, (s.reviews / Math.max(40, s.competitorReviews || 40)) * 30);
  rev += Math.min(20, (s.newReviews / 8) * 20);
  rev += { always: 20, sometimes: 10, never: 0 }[s.responds];

  const rank = { top3: 95, "4-10": 65, "11-20": 35, none: 10, unknown: 40 }[s.rank];
  let web = s.nap === "yes" ? 40 : s.nap === "unsure" ? 20 : 0;
  if (site) web = Math.round(web * 0.4 + (site.categories.find((c) => c.key === "gbp")?.score ?? 0) * 0.6);
  else web += 20;

  const parts = { gbp: Math.round(gbp), reviews: Math.round(Math.min(100, rev)), rankings: rank, website: Math.min(100, Math.round(web)) };
  const overall = Math.round(parts.gbp * 0.35 + parts.reviews * 0.3 + parts.rankings * 0.2 + parts.website * 0.15);

  const opps: string[] = [];
  if (s.claimed !== "yes") opps.push("Claim and verify your Google Business Profile. Without it you can't control what customers see or appear reliably in the map pack.");
  if (s.category !== "yes") opps.push("Set the most specific primary category (e.g. \"Cosmetic dentist\" not just \"Dentist\") and add relevant secondary categories.");
  if (s.photos < 30) opps.push(`Upload at least ${30 - s.photos} more real photos: team, premises, work and happy customers. Profiles with more photos get more engagement.`);
  if (s.posts !== "weekly") opps.push("Post weekly on your profile with offers, updates and project photos to signal an active business.");
  if (s.reviews < Math.max(50, s.competitorReviews)) opps.push(`Close the review gap: you have ${s.reviews} reviews${s.competitorReviews ? ` vs ${s.competitorReviews} for your top competitor` : ""}. Automate WhatsApp/SMS review requests after every job.`);
  if (s.newReviews < 6) opps.push("Aim for at least 6 fresh reviews a month; recency matters as much as total count.");
  if (s.responds !== "always") opps.push("Reply to every review within 48 hours, positive or negative. It builds trust and keeps your profile active.");
  if (s.nap !== "yes") opps.push("Make your name, address and phone identical on your website, Google profile and directories (Justdial, Sulekha, Yelp, Bing, Apple).");
  if (site && !site.signals.hasLocalBusinessSchema) opps.push("Add LocalBusiness schema to your website so Google can match it to your profile.");
  if (site && !site.signals.hasMapEmbed) opps.push("Embed your Google Map on the contact page.");
  if (s.rank !== "top3") opps.push(`Create dedicated service and location pages for "${s.city || "your city"}" to strengthen relevance for local searches.`);

  return { parts, overall, opps };
}

export function LocalSeoScanner() {
  const [s, setS] = useState<S>({ business: "", city: "", website: "", email: "", claimed: "yes", category: "unsure", rating: 4.3, reviews: 25, newReviews: 2, responds: "sometimes", photos: 10, posts: "rarely", services: "no", hours: "yes", nap: "unsure", rank: "unknown", competitorReviews: 80 });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof score> | null>(null);
  const [siteErr, setSiteErr] = useState<string | null>(null);
  const set = <K extends keyof S>(k: K, v: S[K]) => setS((x) => ({ ...x, [k]: v }));

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setSiteErr(null);
    if (/^\S+@\S+\.\S+$/.test(s.email)) submitLead("local-seo-scanner", s).catch(() => {});
    let site: AuditReport | null = null;
    if (s.website.trim()) {
      const j = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: s.website }) }).then((r) => r.json()).catch(() => null);
      if (j?.ok) site = j.report;
      else setSiteErr(j?.error ?? "Couldn't scan the website; scored without it.");
    }
    setResult(score(s, site));
    setBusy(false);
    setTimeout(() => document.getElementById("local-results")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const sel = (id: keyof S, label: string, opts: [string, string][]) => (
    <div>
      <Label htmlFor={`ls-${id}`}>{label}</Label>
      <Select id={`ls-${id}`} value={s[id] as string} onChange={(e) => set(id, e.target.value as never)}>
        {opts.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </Select>
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={run} className="glass-strong border-gradient grid gap-5 rounded-[2rem] p-6 md:grid-cols-3 md:p-8">
        <div>
          <Label htmlFor="ls-b">Business name</Label>
          <Input id="ls-b" value={s.business} onChange={(e) => set("business", e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="ls-c">City / area</Label>
          <Input id="ls-c" value={s.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. South Delhi" required />
        </div>
        <div>
          <Label htmlFor="ls-w">Website (optional, we&apos;ll scan it)</Label>
          <Input id="ls-w" inputMode="url" value={s.website} onChange={(e) => set("website", e.target.value)} placeholder="yourbusiness.com" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary md:col-span-3">Google Business Profile</p>
        {sel("claimed", "Profile claimed & verified?", [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]])}
        {sel("category", "Specific primary category set?", [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]])}
        {sel("posts", "How often do you post updates?", [["weekly", "Weekly"], ["monthly", "Monthly"], ["rarely", "Rarely"], ["never", "Never"]])}
        {sel("services", "Services/products listed?", [["yes", "Yes"], ["no", "No"]])}
        {sel("hours", "Hours (incl. holidays) up to date?", [["yes", "Yes"], ["no", "No"]])}
        <NumberField id="ls-photos" label="Photos on profile" value={s.photos} onChange={(v) => set("photos", v)} min={0} max={200} />
        <p className="text-xs font-semibold uppercase tracking-wider text-primary md:col-span-3">Reviews & rankings</p>
        <NumberField id="ls-rating" label="Average rating" value={s.rating} onChange={(v) => set("rating", v)} min={1} max={5} step={0.1} suffix="★" />
        <NumberField id="ls-reviews" label="Total reviews" value={s.reviews} onChange={(v) => set("reviews", v)} min={0} max={2000} />
        <NumberField id="ls-new" label="New reviews per month" value={s.newReviews} onChange={(v) => set("newReviews", v)} min={0} max={100} />
        {sel("responds", "Do you reply to reviews?", [["always", "Always"], ["sometimes", "Sometimes"], ["never", "Never"]])}
        <NumberField id="ls-comp" label="Top competitor's review count" value={s.competitorReviews} onChange={(v) => set("competitorReviews", v)} min={0} max={5000} />
        {sel("rank", "Map ranking for your main service", [["top3", "Top 3 (map pack)"], ["4-10", "Positions 4–10"], ["11-20", "Positions 11–20"], ["none", "Not found"], ["unknown", "Don't know"]])}
        {sel("nap", "Name/address/phone identical everywhere?", [["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]])}
        <div className="md:col-span-2">
          <Label htmlFor="ls-e">Email (optional, for your report)</Label>
          <Input id="ls-e" type="email" value={s.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <Button type="submit" variant="gradient" size="lg" className="md:col-span-3" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <MapPin />} Scan my local SEO
        </Button>
      </form>

      {result && (
        <div id="local-results" className="flex scroll-mt-28 flex-col gap-6" aria-live="polite">
          {siteErr && <p className="text-sm text-warning">{siteErr}</p>}
          <div className="glass border-gradient grid items-center gap-8 rounded-3xl p-6 md:grid-cols-[auto_1fr] md:p-10">
            <ScoreRing score={result.overall} size={160} stroke={13} label="Local SEO" />
            <div className="grid gap-4">
              <ScoreBar label="Google Business Profile" score={result.parts.gbp} />
              <ScoreBar label="Reviews" score={result.parts.reviews} />
              <ScoreBar label="Local Rankings" score={result.parts.rankings} />
              <ScoreBar label="Website Local Signals" score={result.parts.website} />
            </div>
          </div>
          <div className="glass rounded-3xl p-6 md:p-8">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Star className="size-5 text-warning" aria-hidden /> Growth opportunities{s.business ? ` for ${s.business}` : ""}
            </h3>
            <ol className="mt-5 flex flex-col gap-3">
              {result.opps.map((o, i) => (
                <li key={o} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-sm text-muted">
                  <span className="font-mono text-primary">{String(i + 1).padStart(2, "0")}</span> {o}
                </li>
              ))}
            </ol>
            <BookButton className="mt-6" size="lg">Get help ranking in the map pack</BookButton>
          </div>
        </div>
      )}
    </div>
  );
}
