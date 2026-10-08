/**
 * Central brand + business configuration.
 * Anything marked TODO(owner) should be confirmed by D Expert before launch.
 */
export const site = {
  name: "D Expert",
  legalName: "D Expert",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://dexpert.in").replace(/\/$/, ""), // TODO(owner): confirm the production domain
  tagline: "Helping Businesses Scale With AI Automation, AI Agents & Digital Growth",
  description:
    "D Expert builds AI voice agents, AI receptionists, chatbots, CRM and WhatsApp automation, high-converting websites and performance marketing systems that help businesses capture more leads and grow faster.",
  mission:
    "We help businesses automate operations, improve customer support, generate leads, increase conversions, reduce manual work, and scale faster using AI, Automation and Digital Marketing.",
  founder: {
    name: "Pankaj Thakur",
    role: "Automation & Digital Marketing Expert",
    shortBio:
      "Pankaj Thakur is the founder of D Expert, an AI automation and digital marketing specialist who helps clinics, local service businesses, agencies and startups turn missed calls, slow follow-ups and manual work into automated growth systems.",
  },
  phone: "+91 98737 63204",
  phoneRaw: "+919873763204",
  whatsapp: "919873763204",
  email: "hello@dexpert.in", // TODO(owner): confirm the business email address
  address: {
    locality: "New Delhi",
    region: "Delhi",
    country: "IN",
    countryName: "India",
    postalCode: "110001", // TODO(owner): confirm postal code for Local Business schema
  },
  geo: { latitude: 28.6139, longitude: 77.209 },
  hours: "Mo-Sa 09:30-19:30",
  hoursLabel: "Mon–Sat, 9:30 AM – 7:30 PM IST",
  social: {
    linkedin: "https://www.linkedin.com/", // TODO(owner): add real profile URLs
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    x: "https://x.com/",
  },
  twitterHandle: "@dexpert", // TODO(owner)
  calendly: {
    default: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/dexpert/strategy-call",
    aiDemo: process.env.NEXT_PUBLIC_CALENDLY_AI_DEMO_URL || "",
    automation: process.env.NEXT_PUBLIC_CALENDLY_AUTOMATION_URL || "",
    marketing: process.env.NEXT_PUBLIC_CALENDLY_MARKETING_URL || "",
  },
  /** Founder intro video. type: "youtube" | "vimeo" | "file". Leave id empty to show the designed poster with a booking CTA. */
  introVideo: {
    type: "youtube" as "youtube" | "vimeo" | "file",
    id: "", // e.g. "dQw4w9WgXcQ" for YouTube, "76979871" for Vimeo, "/videos/intro.mp4" for file
    poster: "",
  },
  keywords: [
    "AI Automation Services",
    "AI Voice Agent",
    "AI Receptionist",
    "Business Automation",
    "AI Chatbot Development",
    "Digital Marketing Agency",
    "Website Design Company",
    "Google Ads Services",
    "Meta Ads Services",
    "Lead Generation Agency",
    "CRM Automation",
    "WhatsApp Automation",
    "AI agency New Delhi",
  ],
} as const;

export type BookingType = "consultation" | "aiDemo" | "automation" | "marketing";

export const bookingTypes: Record<BookingType, { label: string; description: string; duration: string; url: string }> = {
  consultation: {
    label: "Free Strategy Call",
    description: "A 30-minute growth consultation to map where AI and automation can add revenue and save time.",
    duration: "30 min",
    url: site.calendly.default,
  },
  aiDemo: {
    label: "Book AI Demo",
    description: "See an AI voice agent or chatbot live, configured for a business like yours.",
    duration: "20 min",
    url: site.calendly.aiDemo || site.calendly.default,
  },
  automation: {
    label: "Book Automation Call",
    description: "Walk through your workflows and leave with a prioritized automation plan.",
    duration: "45 min",
    url: site.calendly.automation || site.calendly.default,
  },
  marketing: {
    label: "Marketing Strategy Session",
    description: "Review your ads, funnel and tracking, and get a clear plan to lower cost per lead.",
    duration: "45 min",
    url: site.calendly.marketing || site.calendly.default,
  },
};

export const whatsappMessages = [
  "I want AI Automation",
  "I want Website Audit",
  "I want AI Voice Agent",
  "I need Digital Marketing",
  "I need a Website",
  "I want a Free Consultation",
] as const;

export function whatsappLink(message: string = "Hi D Expert, I'd like to know more.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
