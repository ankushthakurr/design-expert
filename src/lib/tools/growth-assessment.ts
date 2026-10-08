export type Pillar = "Website" | "Lead Capture" | "Follow-up" | "Marketing" | "Reputation" | "Operations";

export type Question = { id: string; pillar: Pillar; q: string; options: string[] };

/** Each option is scored 0–3 in order (worst to best). */
export const questions: Question[] = [
  { id: "w1", pillar: "Website", q: "How would you describe your website today?", options: ["We don't have one", "Outdated or slow", "Decent, but not built to convert", "Fast, modern and generating enquiries"] },
  { id: "w2", pillar: "Website", q: "How does your website look and work on mobile?", options: ["Not sure / never checked", "Hard to use", "Works, but feels basic", "Excellent, with click-to-call and WhatsApp"] },
  { id: "l1", pillar: "Lead Capture", q: "What happens when someone calls and you can't answer?", options: ["The call is lost", "Voicemail that we check later", "Someone calls back the same day", "AI answers or texts back within a minute"] },
  { id: "l2", pillar: "Lead Capture", q: "How do visitors enquire outside office hours?", options: ["They can't", "Contact form only", "Form plus WhatsApp", "24/7 chatbot or AI agent that books them in"] },
  { id: "f1", pillar: "Follow-up", q: "How fast do new leads get a reply?", options: ["Days, or not at all", "Within 24 hours", "Within an hour", "Within 5 minutes, automatically"] },
  { id: "f2", pillar: "Follow-up", q: "Where do you track leads and customers?", options: ["In our heads / WhatsApp chats", "Spreadsheets", "A CRM we rarely update", "A CRM that updates itself"] },
  { id: "m1", pillar: "Marketing", q: "How do new customers find you?", options: ["Mostly word of mouth", "Some social media posting", "Ads or SEO, but not tracked", "Several tracked channels with known cost per lead"] },
  { id: "m2", pillar: "Marketing", q: "Do you know which marketing activity brings in revenue?", options: ["No idea", "A rough feeling", "Partly, for some channels", "Yes, with conversion tracking and reports"] },
  { id: "r1", pillar: "Reputation", q: "How many Google reviews do you have?", options: ["Fewer than 10", "10 to 50", "50 to 150", "150+ with a 4.6+ rating"] },
  { id: "r2", pillar: "Reputation", q: "How do you ask customers for reviews?", options: ["We don't", "Occasionally, in person", "We send a link manually", "Automatically after every visit or job"] },
  { id: "o1", pillar: "Operations", q: "How much of your team's week goes on repetitive admin?", options: ["Most of it", "Around half", "A few hours each", "Very little, it's automated"] },
  { id: "o2", pillar: "Operations", q: "How are appointment reminders and confirmations sent?", options: ["They aren't", "We call people manually", "Some automatic messages", "Fully automated with self-rescheduling"] },
];

export const pillars: Pillar[] = ["Website", "Lead Capture", "Follow-up", "Marketing", "Reputation", "Operations"];

const advice: Record<Pillar, { low: string; mid: string; service: { label: string; href: string } }> = {
  Website: { low: "Your website is likely costing you enquiries. A fast, mobile-first site with clear calls to action is the foundation for everything else.", mid: "Tighten your website around one clear offer, add social proof above the fold and make calling or messaging one tap away.", service: { label: "Website design", href: "/website-design" } },
  "Lead Capture": { low: "You're losing callers and after-hours visitors. An AI receptionist and chatbot can capture them while your team is busy or off duty.", mid: "Close the remaining gaps with missed-call text-back and a 24/7 chatbot that books appointments.", service: { label: "AI voice agents", href: "/ai-voice-agents" } },
  "Follow-up": { low: "Slow follow-up is one of the biggest leaks in most businesses. Automated replies and a self-updating CRM fix this quickly.", mid: "Automate the first reply and the day 1, 3 and 7 follow-ups so no lead goes cold.", service: { label: "CRM automation", href: "/automation-solutions#crm" } },
  Marketing: { low: "Growth depends on word of mouth. Tracked Google and Meta campaigns can make new customers predictable.", mid: "Set up full conversion tracking so you can move budget to the channels that actually pay.", service: { label: "Digital marketing", href: "/digital-marketing" } },
  Reputation: { low: "Reviews are the first thing new customers check. An automatic review request after every visit builds trust fast.", mid: "Automate review requests and showcase your best reviews on your site and ads.", service: { label: "Google Business Profile", href: "/branding#gbp" } },
  Operations: { low: "Manual admin is eating your team's time. Reminders, data entry and reports can run on their own.", mid: "Automate the remaining routine tasks so your team can focus on customers.", service: { label: "Business automation", href: "/automation-solutions" } },
};

export function scoreAssessment(answers: Record<string, number>) {
  const byPillar = pillars.map((p) => {
    const qs = questions.filter((q) => q.pillar === p);
    const raw = qs.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
    const score = Math.round((raw / (qs.length * 3)) * 100);
    return { pillar: p, score };
  });
  const overall = Math.round(byPillar.reduce((s, x) => s + x.score, 0) / byPillar.length);
  const stage = overall >= 75 ? { name: "Scaling", desc: "Your growth engine is strong. AI agents and advanced automation can multiply what's already working." } : overall >= 50 ? { name: "Growing", desc: "You have solid foundations with a few leaks. Fixing your weakest pillars will unlock the next level." } : overall >= 25 ? { name: "Building", desc: "There are clear gaps letting leads and time slip away. The good news: the fixes are well understood and fast." } : { name: "Starting out", desc: "Your business relies heavily on manual effort and word of mouth. A few core systems will make a big difference quickly." };
  const recommendations = [...byPillar]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((p) => ({ ...p, text: p.score < 50 ? advice[p.pillar].low : advice[p.pillar].mid, service: advice[p.pillar].service }));
  return { byPillar, overall, stage, recommendations };
}
