/** Industry-specific recommendations used by the lead magnet, automation advisor and strategy generator. */
export type Playbook = {
  automations: string[];
  marketing: string[];
  leadGen: string[];
  voice: string;
};

const generic: Playbook = {
  automations: [
    "Instant WhatsApp/SMS reply to every new enquiry with a booking link",
    "CRM pipeline with automatic lead assignment and follow-up reminders",
    "AI chatbot on your website to answer FAQs and capture leads 24/7",
    "Automated review requests after every completed job or visit",
    "Weekly automated performance report to your inbox",
  ],
  marketing: [
    "Run Google Search ads on high-intent keywords to a dedicated landing page",
    "Retarget website visitors on Facebook and Instagram with testimonials",
    "Post weekly on your Google Business Profile with offers and photos",
  ],
  leadGen: [
    "Add a free lead magnet (guide, checklist or audit) to capture visitors not ready to buy",
    "Use click-to-WhatsApp ads for low-friction enquiries",
    "Follow up every lead within 5 minutes using automation",
  ],
  voice: "An AI receptionist on overflow and after-hours to capture every call.",
};

const map: Record<string, Partial<Playbook>> = {
  "Dental Clinic": {
    automations: [
      "AI receptionist for after-hours and overflow calls with live calendar booking",
      "Automated appointment confirmations and reminders by SMS/WhatsApp to reduce no-shows",
      "Recall automation for 6-month check-ups and cleanings",
      "Post-visit review requests to grow Google reviews",
      "New patient intake forms sent automatically before the first visit",
    ],
    marketing: ["Google Search ads for \"dentist near me\", implants, aligners and emergency dental", "Before/after and patient-story content on Instagram", "Treatment-specific landing pages with financing info"],
    leadGen: ["Free consultation or smile-assessment offer", "Online booking on every page", "WhatsApp chat for quick treatment questions"],
    voice: "A dental AI receptionist that books check-ups and handles rescheduling while your team is chairside.",
  },
  "Medical Clinic": {
    automations: [
      "AI receptionist for appointment booking and routine questions (no clinical advice)",
      "Automated reminders and pre-visit instructions",
      "Online intake forms synced to your records system",
      "Lab-result-ready and follow-up visit notifications",
      "Patient feedback and review requests",
    ],
    marketing: ["Local SEO for each speciality and location", "Google Search ads for high-demand services", "Educational content that answers patient questions"],
    leadGen: ["Online booking with real-time availability", "Health check-up packages as entry offers", "WhatsApp appointment requests"],
  },
  Restaurant: {
    automations: [
      "AI booking assistant on phone and WhatsApp during service hours",
      "Reservation confirmations and reminders",
      "Birthday and anniversary offers sent automatically",
      "Post-visit review requests",
      "Private dining and event enquiry routing to the manager",
    ],
    marketing: ["Instagram and Facebook ads showcasing signature dishes", "Google Business Profile posts with menus and events", "Influencer and local food-blogger collaborations"],
    leadGen: ["Online table reservations on your website", "Event and party booking landing page", "Loyalty sign-up via WhatsApp"],
    voice: "An AI booking assistant that takes reservations during the dinner rush.",
  },
  "Roofing Company": {
    automations: [
      "Missed-call text-back and AI call answering during storm season",
      "Instant quote-request reply with photo upload link",
      "Estimate follow-up sequence after inspections",
      "Job-complete review requests and referral asks",
      "Crew scheduling notifications",
    ],
    marketing: ["Google Local Services Ads and Search ads for roof repair and replacement", "Service-area landing pages for each city", "Before/after project galleries"],
    leadGen: ["Free roof inspection offer", "Multi-step quote form with urgency questions", "Financing calculator"],
  },
  Contractor: {
    automations: [
      "AI call answering while crews are on site",
      "Quote request intake with budget qualification",
      "Proposal follow-up reminders",
      "Project update messages to clients",
      "Review and referral requests on completion",
    ],
    marketing: ["Google Search ads by project type", "Portfolio-led website with project pages", "Facebook ads targeting homeowners in your area"],
    leadGen: ["Project cost estimator", "Free consultation booking", "Call tracking to measure every channel"],
  },
  "Real Estate Agency": {
    automations: [
      "Speed-to-lead AI call and WhatsApp within 60 seconds of every enquiry",
      "Lead qualification by budget, location and timeline",
      "Viewing booking synced to agent calendars",
      "New-listing alerts matched to buyer preferences",
      "Long-term nurture for buyers not ready yet",
    ],
    marketing: ["Meta lead ads for new projects", "Google Search ads for project and locality keywords", "Video walkthroughs and virtual tours"],
    leadGen: ["Gated brochures and price lists", "Home valuation tool for sellers", "Site-visit booking with pickup option"],
    voice: "A lead-qualification voice agent that calls new leads within a minute.",
  },
  "Law Firm": {
    automations: [
      "After-hours AI intake for new enquiries",
      "Consultation scheduling and reminders",
      "Document collection requests and reminders",
      "Case status updates to clients",
      "Conflict-check intake forms",
    ],
    marketing: ["Practice-area landing pages with FAQs", "Google Search ads for urgent legal needs", "Thought-leadership content and local SEO"],
    leadGen: ["Free case evaluation form", "Practice-area guides as lead magnets", "Click-to-call on every page"],
  },
  "Gym / Fitness": {
    automations: [
      "Trial sign-up nurture sequence over WhatsApp",
      "Class booking and reminders",
      "Membership renewal and win-back automation",
      "Birthday and milestone messages",
      "Review requests after the first month",
    ],
    marketing: ["Instagram Reels ads with transformations", "Local Google ads for \"gym near me\"", "Referral campaigns for members"],
    leadGen: ["Free 3-day trial pass", "Fitness challenge landing page", "WhatsApp chatbot for pricing questions"],
  },
  Consultant: {
    automations: [
      "Discovery call booking with qualification questions",
      "Proposal generation and follow-up",
      "Client onboarding workflow",
      "AI assistant for inbox triage and meeting notes",
      "Invoice and payment reminders",
    ],
    marketing: ["LinkedIn thought leadership", "Google Search ads for niche expertise", "Webinars and case studies"],
    leadGen: ["Free assessment or audit offer", "Downloadable frameworks", "Newsletter with nurture sequence"],
  },
  Coach: {
    automations: [
      "Discovery call booking with application form",
      "Nurture sequence for webinar and lead magnet sign-ups",
      "Client onboarding and session reminders",
      "Community and course access automation",
      "Testimonial collection after programmes",
    ],
    marketing: ["Instagram and YouTube content funnels", "Meta ads to a webinar or lead magnet", "Podcast guesting"],
    leadGen: ["Free masterclass or challenge", "Quiz funnel", "Application-based discovery calls"],
  },
  Ecommerce: {
    automations: [
      "AI support agent for order status, returns and sizing",
      "Abandoned cart recovery via email and WhatsApp",
      "Post-purchase review and cross-sell flows",
      "Order routing, courier booking and stock alerts",
      "Win-back campaigns for lapsed customers",
    ],
    marketing: ["Meta Advantage+ shopping campaigns", "Google Shopping and Performance Max", "UGC and influencer creatives"],
    leadGen: ["First-order discount pop-up", "Quiz-based product finder", "WhatsApp broadcast list"],
    voice: "An AI support line for order and delivery questions.",
  },
};

export function getPlaybook(industry: string): Playbook {
  const p = map[industry] ?? {};
  return {
    automations: p.automations ?? generic.automations,
    marketing: p.marketing ?? generic.marketing,
    leadGen: p.leadGen ?? generic.leadGen,
    voice: p.voice ?? generic.voice,
  };
}
