import { getPlaybook } from "./industry-playbooks";

export const painPointOptions = [
  { id: "missed-calls", label: "Missed calls" },
  { id: "slow-followup", label: "Slow lead follow-up" },
  { id: "data-entry", label: "Manual data entry" },
  { id: "scheduling", label: "Appointment scheduling" },
  { id: "support-questions", label: "Repetitive support questions" },
  { id: "no-shows", label: "No-shows & cancellations" },
  { id: "whatsapp-overload", label: "WhatsApp overload" },
  { id: "email-marketing", label: "No email follow-up" },
  { id: "reporting", label: "Manual reporting" },
  { id: "reviews", label: "Not enough reviews" },
] as const;

export type AdvisorInput = {
  industry: string;
  employees: number;
  leads: number;
  customers: number;
  hourlyCost: number;
  painPoints: string[];
};

export type Opportunity = {
  key: string;
  title: string;
  icon: string;
  priority: "High" | "Medium" | "Low";
  hours: number;
  what: string;
  how: string[];
};

export function runAdvisor(input: AdvisorInput) {
  const { leads, customers, employees, painPoints } = input;
  const has = (id: string) => painPoints.includes(id);
  const w = (...ids: string[]) => (ids.some(has) ? 1 : 0.45);

  const raw: Omit<Opportunity, "priority">[] = [
    {
      key: "support",
      title: "Customer Support Automation",
      icon: "Headphones",
      hours: customers * 0.2 * 0.55 * w("support-questions", "missed-calls"),
      what: "An AI support agent on your website and WhatsApp (plus an AI receptionist for calls) answers routine questions instantly and hands complex cases to your team.",
      how: ["Train an AI assistant on your FAQs and policies", "Add an AI receptionist for overflow & after-hours calls", "Route complex issues to staff with full context"],
    },
    {
      key: "lead",
      title: "Lead Automation",
      icon: "UserCheck",
      hours: leads * 0.2 * 0.7 * w("slow-followup", "missed-calls"),
      what: "Every new lead gets an instant personalised reply, is qualified and scored automatically, and hot leads are routed to the right person.",
      how: ["Instant WhatsApp/SMS/email reply to every enquiry", "AI qualification questions & lead scoring", "Missed-call text-back"],
    },
    {
      key: "appointment",
      title: "Appointment Automation",
      icon: "CalendarCheck",
      hours: (leads * 0.4 + customers) * 0.1 * 0.6 * w("scheduling", "no-shows"),
      what: "Self-serve booking with calendar sync, confirmations, reminders and automatic no-show follow-up.",
      how: ["Online booking links in every channel", "Automated reminders 24h and 1h before", "Rescheduling & no-show recovery flows"],
    },
    {
      key: "crm",
      title: "CRM Automation",
      icon: "Database",
      hours: (leads * 0.08 + employees * 2) * w("data-entry", "reporting", "slow-followup"),
      what: "A CRM that updates itself: leads created from every channel, stages moved automatically, tasks and reminders assigned without manual entry.",
      how: ["Auto-create contacts from forms, calls & chats", "Pipeline stage automation & task rules", "Weekly automated pipeline report"],
    },
    {
      key: "email",
      title: "Email Automation",
      icon: "Mail",
      hours: (customers * 0.05 + 4) * w("email-marketing", "reviews"),
      what: "Nurture, onboarding, review-request and win-back sequences that send themselves at the right moment.",
      how: ["Welcome & nurture sequence for new leads", "Post-service review requests", "Win-back campaign for past customers"],
    },
    {
      key: "whatsapp",
      title: "WhatsApp Automation",
      icon: "MessageCircle",
      hours: (leads + customers) * 0.05 * w("whatsapp-overload", "slow-followup", "no-shows"),
      what: "Official WhatsApp Business API flows for instant replies, reminders, updates and a shared team inbox with an AI first responder.",
      how: ["AI first responder on WhatsApp", "Templates for reminders, updates & payments", "Shared inbox with assignment rules"],
    },
  ];

  const opportunities: Opportunity[] = raw
    .map((o) => ({ ...o, hours: Math.max(2, Math.round(o.hours)) }))
    .sort((a, b) => b.hours - a.hours)
    .map((o, i) => ({ ...o, priority: i < 2 ? "High" : i < 4 ? "Medium" : "Low" }));

  const totalHours = opportunities.reduce((s, o) => s + o.hours, 0);
  const monthlySavings = totalHours * input.hourlyCost;
  const fteEquivalent = totalHours / 160;
  const pb = getPlaybook(input.industry);

  const roadmap = [
    { window: "Days 1–30", title: "Quick wins", items: opportunities.slice(0, 2).flatMap((o) => o.how.slice(0, 2)) },
    { window: "Days 31–60", title: "Connect the system", items: opportunities.slice(2, 4).flatMap((o) => o.how.slice(0, 2)) },
    { window: "Days 61–90", title: "Optimise & scale", items: [...opportunities.slice(4).map((o) => o.how[0]), "Review transcripts & conversion data, refine scripts", pb.automations[pb.automations.length - 1]] },
  ];

  return { opportunities, totalHours, monthlySavings, annualSavings: monthlySavings * 12, fteEquivalent, roadmap, industryIdeas: pb.automations };
}
