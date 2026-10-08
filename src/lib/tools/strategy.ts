import { getPlaybook } from "./industry-playbooks";

export const goalOptions = [
  { id: "more-leads", label: "Get more leads" },
  { id: "more-bookings", label: "More bookings & appointments" },
  { id: "save-time", label: "Save team time" },
  { id: "better-support", label: "Faster customer support" },
  { id: "brand", label: "Build a stronger brand" },
  { id: "scale", label: "Scale without chaos" },
] as const;

export const challengeOptions = [
  { id: "missed-calls", label: "Missed calls" },
  { id: "slow-followup", label: "Slow lead follow-up" },
  { id: "no-shows", label: "No-shows & cancellations" },
  { id: "low-traffic", label: "Low website traffic" },
  { id: "low-conversion", label: "Visitors don't convert" },
  { id: "manual-admin", label: "Too much manual admin" },
  { id: "few-reviews", label: "Few Google reviews" },
  { id: "ad-waste", label: "Ads not profitable" },
] as const;

export type StrategyInput = {
  businessName: string;
  industry: string;
  employees: number;
  monthlyLeads: number;
  goals: string[];
  challenges: string[];
};

export type StrategyPhase = { window: string; title: string; focus: string; items: string[] };

export type Strategy = {
  summary: string;
  maturity: { label: string; score: number };
  quickWins: string[];
  automations: string[];
  marketing: string[];
  support: string[];
  leadGen: string[];
  plan: StrategyPhase[];
  kpis: { label: string; target: string }[];
};

const challengeFixes: Record<string, { automation?: string; marketing?: string; support?: string; leadGen?: string; quickWin: string }> = {
  "missed-calls": {
    automation: "AI voice agent on overflow and after-hours lines, with missed-call text-back in under 60 seconds",
    support: "Route every call: AI answers routine questions and books, your team gets urgent calls with a summary",
    quickWin: "Turn on missed-call text-back so no caller is left without a reply",
  },
  "slow-followup": {
    automation: "Speed-to-lead workflow: instant WhatsApp + email reply and a CRM task for every new enquiry",
    leadGen: "Follow up every lead within 5 minutes, then on day 1, 3 and 7 automatically",
    quickWin: "Connect your website form to WhatsApp so every enquiry gets an instant reply",
  },
  "no-shows": {
    automation: "Confirmation and reminder sequence (24 hours and 2 hours before) with one-tap rescheduling",
    support: "Let customers reschedule themselves over WhatsApp or chat instead of calling",
    quickWin: "Add automated reminders to every booking",
  },
  "low-traffic": {
    marketing: "Local SEO sprint: service and location pages, Google Business Profile optimisation and weekly posts",
    leadGen: "Launch Google Search ads on your 10 highest-intent keywords",
    quickWin: "Complete every field of your Google Business Profile and add 10 fresh photos",
  },
  "low-conversion": {
    marketing: "Rebuild key pages around one clear offer, social proof above the fold and a sticky call-to-action",
    leadGen: "Add a lead magnet (free audit, checklist or estimate) for visitors not ready to buy",
    quickWin: "Add click-to-call and WhatsApp buttons to every page on mobile",
  },
  "manual-admin": {
    automation: "Automate data entry, invoicing reminders and weekly reports between your existing tools",
    quickWin: "List your 5 most repeated weekly tasks; most can be automated in days",
  },
  "few-reviews": {
    automation: "Automatic review request after every completed visit or job, with a private feedback route for unhappy customers",
    marketing: "Showcase reviews on your website, ads and Google profile",
    quickWin: "Send a review link to your last 50 happy customers this week",
  },
  "ad-waste": {
    marketing: "Ads audit: fix conversion tracking, cut wasted keywords and move budget to profitable campaigns",
    leadGen: "Send paid traffic to dedicated landing pages rather than your home page",
    quickWin: "Check that conversion tracking fires on every form and call",
  },
};

const goalKpis: Record<string, { label: string; target: string }> = {
  "more-leads": { label: "Qualified leads per month", target: "+30–60%" },
  "more-bookings": { label: "Booked appointments", target: "+20–40%" },
  "save-time": { label: "Admin hours saved", target: "10–25 hrs/week" },
  "better-support": { label: "First response time", target: "Under 1 minute" },
  brand: { label: "Google rating & reviews", target: "4.7+ and 2x reviews" },
  scale: { label: "Leads handled per team member", target: "2x capacity" },
};

const uniq = (arr: (string | undefined)[]) => Array.from(new Set(arr.filter(Boolean) as string[]));

export function generateStrategy(input: StrategyInput): Strategy {
  const pb = getPlaybook(input.industry);
  const fixes = input.challenges.map((c) => challengeFixes[c]).filter(Boolean);
  const name = input.businessName.trim() || "your business";

  const automations = uniq([...fixes.map((f) => f.automation), ...pb.automations]).slice(0, 6);
  const marketing = uniq([...fixes.map((f) => f.marketing), ...pb.marketing]).slice(0, 5);
  const leadGen = uniq([...fixes.map((f) => f.leadGen), ...pb.leadGen]).slice(0, 5);
  const support = uniq([
    ...fixes.map((f) => f.support),
    pb.voice,
    "AI chatbot on your website and WhatsApp trained on your FAQs, prices and policies, with hand-off to your team",
    "Shared inbox so calls, chats and messages land in one place with full history",
    input.employees > 10 ? "Weekly AI summary of customer questions to spot issues early" : "Saved replies and templates for your 20 most common questions",
  ]).slice(0, 5);
  const quickWins = uniq(fixes.map((f) => f.quickWin)).concat(["Add a booking link to your Google profile, website header and email signature"]).slice(0, 4);

  // Simple digital maturity score: more challenges and a smaller team usually means more upside.
  const score = Math.max(18, Math.min(85, 78 - input.challenges.length * 7 + Math.min(10, input.employees / 3)));
  const maturity = { score: Math.round(score), label: score >= 65 ? "Established: ready to scale with AI" : score >= 45 ? "Developing: strong upside from automation" : "Early: big quick wins available" };

  const wantsLeads = input.goals.includes("more-leads") || input.goals.includes("more-bookings");
  const plan: StrategyPhase[] = [
    {
      window: "Days 1–30",
      title: "Stop the leaks",
      focus: "Capture every enquiry you already get.",
      items: uniq([quickWins[0], automations[0], automations[1], "Set up a CRM pipeline with clear stages and owners", "Install analytics and conversion tracking"]).slice(0, 5),
    },
    {
      window: "Days 31–60",
      title: wantsLeads ? "Turn on growth" : "Automate the routine",
      focus: wantsLeads ? "Bring in more of the right customers." : "Give your team hours back every week.",
      items: uniq(wantsLeads ? [marketing[0], leadGen[0], support[0], automations[2]] : [automations[2], automations[3], support[0], marketing[0]]).slice(0, 4),
    },
    {
      window: "Days 61–90",
      title: "Optimise and scale",
      focus: "Double down on what works.",
      items: uniq([marketing[1], leadGen[1], automations[4], "Monthly review of call transcripts, chats and conversion data", "Document playbooks so the system runs without you"]).slice(0, 5),
    },
  ];

  const kpis = uniq(input.goals).map((g) => goalKpis[g]).filter(Boolean);
  if (kpis.length < 3) kpis.push({ label: "Lead response time", target: "Under 5 minutes" }, { label: "Missed calls", target: "Near zero" });

  const summary = `${name} has ${input.monthlyLeads.toLocaleString("en-IN")} leads a month and a team of ${input.employees}. The fastest gains come from ${
    input.challenges.length ? "fixing " + input.challenges.map((c) => challengeOptions.find((o) => o.id === c)?.label.toLowerCase()).filter(Boolean).slice(0, 2).join(" and ") : "capturing and following up every enquiry"
  } first, then layering AI agents and targeted marketing on top. AI handles the repetitive work so your team can focus on customers.`;

  return { summary, maturity, quickWins, automations, marketing, support, leadGen, plan, kpis: kpis.slice(0, 4) };
}
