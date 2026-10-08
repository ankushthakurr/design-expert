import type { AuditReport, CategoryResult, Check, ScoreKey, SiteSignals } from "./types";

const labels: Record<ScoreKey, string> = {
  seo: "SEO",
  speed: "Speed",
  mobile: "Mobile",
  leadGen: "Lead Generation",
  conversion: "Conversion",
  trust: "Trust",
  gbp: "Google Business Profile",
  accessibility: "Accessibility",
};

function score(checks: Check[]) {
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + (c.pass ? c.weight : 0), 0);
  return Math.round((got / total) * 100);
}

function summarize(key: ScoreKey, s: number) {
  const band = s >= 80 ? "strong" : s >= 60 ? "fair" : "weak";
  const map: Record<ScoreKey, Record<string, string>> = {
    seo: {
      strong: "Search engines can understand your site well. Focus on content and local pages to climb further.",
      fair: "The basics are partly there, but missing tags and structure are holding back your rankings.",
      weak: "Google is struggling to understand your pages, so customers searching for you are finding competitors.",
    },
    speed: {
      strong: "Your site responds quickly, which keeps visitors engaged and helps ad and SEO performance.",
      fair: "Load time is acceptable but heavy scripts or images are slowing visitors down, especially on mobile data.",
      weak: "Your site is slow. Many mobile visitors will leave before the page finishes loading.",
    },
    mobile: {
      strong: "Your site is set up well for phones, where most of your visitors are.",
      fair: "Mobile works, but some elements make it harder to call, read or tap on a phone.",
      weak: "Your site isn't properly optimised for phones, where most local searches happen.",
    },
    leadGen: {
      strong: "Visitors have several easy ways to contact you. Make sure every enquiry gets an instant reply.",
      fair: "There are some contact options, but you're missing quick ways for visitors to reach you.",
      weak: "It's hard for visitors to get in touch, so interested people are leaving without enquiring.",
    },
    conversion: {
      strong: "Clear calls-to-action guide visitors to the next step.",
      fair: "Visitors can find the next step, but the offer and calls-to-action could be much clearer.",
      weak: "Your pages don't clearly tell visitors what to do next, so most will browse and leave.",
    },
    trust: {
      strong: "Strong trust signals help new visitors feel confident choosing you.",
      fair: "Some trust signals exist, but reviews, credentials and guarantees could be far more visible.",
      weak: "New visitors see little proof that you're trustworthy, so they're likely to keep comparing.",
    },
    gbp: {
      strong: "Your website supports your Google Business Profile well with consistent local signals.",
      fair: "Your local signals are partly in place. Strengthen them to compete in the map pack.",
      weak: "Your website isn't backing up your Google Business Profile, which weakens local rankings.",
    },
    accessibility: {
      strong: "Your site is broadly accessible, which widens your audience and helps SEO.",
      fair: "Some accessibility issues could block screen-reader and keyboard users.",
      weak: "Accessibility gaps make your site hard to use for some visitors and can hurt rankings.",
    },
  };
  return map[key][band];
}

export function buildReport(sig: SiteSignals): AuditReport {
  const psi = sig.pageSpeed;

  const seo: Check[] = [
    { label: "Page title present (30–65 characters)", pass: sig.titleLength >= 30 && sig.titleLength <= 65, weight: 3, tip: "Write a unique title with your main service and city, 30–65 characters long." },
    { label: "Meta description (70–160 characters)", pass: sig.descriptionLength >= 70 && sig.descriptionLength <= 160, weight: 2, tip: "Add a compelling meta description that sells the click in search results." },
    { label: "Exactly one H1 heading", pass: sig.h1Count === 1, weight: 2, tip: "Use a single, descriptive H1 that states what you do and where." },
    { label: "Supporting H2 headings", pass: sig.h2Count >= 2, weight: 1, tip: "Break content into sections with H2 headings that use your keywords." },
    { label: "Canonical URL", pass: sig.hasCanonical, weight: 1, tip: "Add a canonical tag to prevent duplicate-content issues." },
    { label: "Structured data (schema)", pass: sig.schemaTypes.length > 0, weight: 2, tip: "Add Organization/LocalBusiness and Service schema so Google understands your business." },
    { label: "Open Graph tags for sharing", pass: sig.hasOpenGraph, weight: 1, tip: "Add Open Graph tags so links look professional on WhatsApp, Facebook and LinkedIn." },
    { label: "robots.txt & sitemap", pass: sig.robotsTxt && sig.sitemap, weight: 1, tip: "Publish robots.txt and an XML sitemap and submit it to Google Search Console." },
    { label: "Indexable by search engines", pass: !sig.noindex, weight: 3, tip: "Remove the noindex tag; it tells Google not to show this page." },
    { label: "Enough content (300+ words)", pass: sig.wordCount >= 300, weight: 2, tip: "Add helpful content about your services, areas and FAQs (aim for 600+ words on key pages)." },
    { label: "Secure HTTPS", pass: sig.https, weight: 2, tip: "Install an SSL certificate; browsers mark non-HTTPS sites as not secure." },
  ];

  const speedChecks: Check[] = [
    { label: "Fast server response (< 800ms)", pass: sig.ttfbMs < 800, weight: 3, tip: "Use better hosting or a CDN to cut server response time." },
    { label: "Full HTML downloaded quickly (< 2s)", pass: sig.loadMs < 2000, weight: 2, tip: "Reduce page weight and use caching." },
    { label: "Lightweight HTML (< 250 KB)", pass: sig.htmlKb < 250, weight: 1, tip: "Trim inline code and page-builder bloat." },
    { label: "Few render-blocking scripts", pass: sig.blockingScripts <= 2, weight: 2, tip: "Load scripts with async/defer so content appears sooner." },
    { label: "Reasonable number of scripts (≤ 15)", pass: sig.scriptCount <= 15, weight: 1, tip: "Remove unused plugins and third-party scripts." },
    { label: "Lazy-loaded images", pass: sig.imgCount < 6 || sig.lazyImgs > 0, weight: 1, tip: "Lazy-load images below the fold." },
    { label: "Modern image formats (WebP/AVIF)", pass: sig.modernImages || sig.imgCount === 0, weight: 1, tip: "Serve images as WebP or AVIF to cut file sizes significantly." },
  ];
  let speedScore = score(speedChecks);
  if (psi) speedScore = Math.round(speedScore * 0.3 + psi.performance * 0.7);

  const mobile: Check[] = [
    { label: "Mobile viewport configured", pass: sig.hasViewport, weight: 4, tip: "Add a responsive viewport meta tag so the site scales on phones." },
    { label: "Tap-to-call phone link", pass: sig.telLinks > 0, weight: 3, tip: "Make your phone number a tap-to-call link; mobile visitors want to call." },
    { label: "WhatsApp contact option", pass: sig.whatsapp, weight: 2, tip: "Add a WhatsApp button; many customers prefer messaging." },
    { label: "Fast on mobile networks", pass: sig.ttfbMs < 800 && sig.htmlKb < 300, weight: 2, tip: "Optimise for slower mobile connections." },
    { label: "App icon / favicon", pass: sig.hasFavicon, weight: 1, tip: "Add a favicon and app icons for a polished look in browsers and bookmarks." },
  ];

  const leadGen: Check[] = [
    { label: "Contact or lead form", pass: sig.forms > 0, weight: 3, tip: "Add a short enquiry form on every key page." },
    { label: "Tap-to-call link", pass: sig.telLinks > 0, weight: 2, tip: "Add click-to-call buttons in the header and hero." },
    { label: "WhatsApp chat", pass: sig.whatsapp, weight: 2, tip: "Add a floating WhatsApp button with pre-filled messages." },
    { label: "Live chat or AI chatbot", pass: sig.hasChatWidget, weight: 2, tip: "Add an AI chatbot to answer questions and capture leads 24/7." },
    { label: "Online booking", pass: sig.hasBooking, weight: 2, tip: "Let visitors book appointments or calls online instantly." },
    { label: "Email link", pass: sig.mailtoLinks > 0, weight: 1, tip: "Show a clickable email address for visitors who prefer email." },
  ];

  const conversion: Check[] = [
    { label: "Clear calls-to-action (3+)", pass: sig.ctaCount >= 3, weight: 3, tip: "Repeat one clear primary call-to-action (e.g. \"Book a Free Consultation\") throughout the page." },
    { label: "Short forms (≤ 6 fields)", pass: sig.forms === 0 ? false : sig.inputs / Math.max(sig.forms, 1) <= 6, weight: 2, tip: "Shorter forms convert better; ask only what you need." },
    { label: "Social proof on page", pass: sig.testimonials, weight: 2, tip: "Show testimonials and star ratings near your calls-to-action." },
    { label: "Conversion tracking installed", pass: sig.analytics.ga || sig.analytics.gtm, weight: 2, tip: "Install GA4/Tag Manager and track form submissions and calls as conversions." },
    { label: "Instant response channel", pass: sig.hasChatWidget || sig.whatsapp || sig.hasBooking, weight: 2, tip: "Offer an instant channel: chatbot, WhatsApp or online booking." },
  ];

  const trust: Check[] = [
    { label: "Reviews or testimonials", pass: sig.testimonials, weight: 3, tip: "Display real reviews with names, photos and star ratings." },
    { label: "Credentials & guarantees", pass: sig.trustSignals >= 2, weight: 2, tip: "Highlight certifications, years in business, awards and guarantees." },
    { label: "Secure HTTPS", pass: sig.https, weight: 2, tip: "Use HTTPS on every page." },
    { label: "Privacy policy", pass: sig.hasPrivacy, weight: 1, tip: "Publish a privacy policy, required for ads and builds trust." },
    { label: "Physical address shown", pass: sig.hasAddress, weight: 1, tip: "Show your business address to signal you're a real, local business." },
    { label: "Phone number visible", pass: sig.hasPhoneText || sig.telLinks > 0, weight: 1, tip: "Display your phone number prominently." },
  ];

  const gbp: Check[] = [
    { label: "LocalBusiness schema", pass: sig.hasLocalBusinessSchema, weight: 3, tip: "Add LocalBusiness schema with name, address, phone and hours that match your Google profile." },
    { label: "Google Map embedded or linked", pass: sig.hasMapEmbed, weight: 2, tip: "Embed your Google Map on the contact page." },
    { label: "Address on site (NAP)", pass: sig.hasAddress, weight: 2, tip: "Show name, address and phone consistently with your Google Business Profile." },
    { label: "Phone on site (NAP)", pass: sig.hasPhoneText || sig.telLinks > 0, weight: 2, tip: "Use the same phone number as your Google profile." },
    { label: "Link to leave a Google review", pass: sig.hasGoogleReviewsLink, weight: 1, tip: "Add a \"Review us on Google\" link and automate review requests." },
  ];

  const accessibility: Check[] = [
    { label: "Language declared", pass: sig.hasLang, weight: 2, tip: "Declare the page language with <html lang>." },
    { label: "Images have alt text", pass: sig.imgCount === 0 || sig.imgsMissingAlt / sig.imgCount < 0.15, weight: 3, tip: `Add descriptive alt text to images (${sig.imgsMissingAlt} of ${sig.imgCount} are missing it).` },
    { label: "Form fields have labels", pass: sig.inputs === 0 || sig.labels >= sig.inputs * 0.6, weight: 2, tip: "Give every form field a visible label." },
    { label: "Heading structure", pass: sig.h1Count >= 1, weight: 1, tip: "Use a logical heading structure starting with one H1." },
    { label: "Zoom-friendly viewport", pass: sig.hasViewport, weight: 1, tip: "Make sure users can zoom on mobile." },
  ];
  let accScore = score(accessibility);
  if (psi) accScore = Math.round(accScore * 0.4 + psi.accessibility * 0.6);
  let seoScore = score(seo);
  if (psi) seoScore = Math.round(seoScore * 0.6 + psi.seo * 0.4);

  const categories: CategoryResult[] = (
    [
      ["seo", seo, seoScore],
      ["speed", speedChecks, speedScore],
      ["mobile", mobile, score(mobile)],
      ["leadGen", leadGen, score(leadGen)],
      ["conversion", conversion, score(conversion)],
      ["trust", trust, score(trust)],
      ["gbp", gbp, score(gbp)],
      ["accessibility", accessibility, accScore],
    ] as [ScoreKey, Check[], number][]
  ).map(([key, checks, s]) => ({ key, label: labels[key], score: s, checks, summary: summarize(key, s) }));

  const weights: Record<ScoreKey, number> = { seo: 1.2, speed: 1, mobile: 1, leadGen: 1.4, conversion: 1.3, trust: 1.1, gbp: 0.9, accessibility: 0.7 };
  const overall = Math.round(
    categories.reduce((s, c) => s + c.score * weights[c.key], 0) / categories.reduce((s, c) => s + weights[c.key], 0),
  );
  const grade = overall >= 90 ? "A" : overall >= 80 ? "B" : overall >= 65 ? "C" : overall >= 50 ? "D" : "F";

  const failed = categories.flatMap((c) => c.checks.filter((k) => !k.pass).map((k) => ({ ...k, cat: c.key })));
  failed.sort((a, b) => b.weight - a.weight);

  const losingLeads: string[] = [];
  if (!sig.hasChatWidget && !sig.whatsapp) losingLeads.push("Visitors with a quick question have no instant way to ask it, so they leave to find a business that answers right away.");
  if (sig.telLinks === 0) losingLeads.push("Your phone number isn't tap-to-call, which adds friction for mobile visitors who are ready to call now.");
  if (sig.forms === 0) losingLeads.push("There's no enquiry form, so visitors who don't want to call have no easy way to reach you.");
  if (!sig.hasBooking) losingLeads.push("Visitors can't book online, so people browsing after hours put it off and often forget.");
  if (sig.ctaCount < 3) losingLeads.push("Your next step isn't obvious. Without clear calls-to-action, interested visitors browse and leave.");
  if (!(sig.analytics.ga || sig.analytics.gtm)) losingLeads.push("Without conversion tracking you can't see which pages or campaigns bring enquiries, so leaks stay hidden.");
  if (losingLeads.length < 2) losingLeads.push("Even with good contact options, leads that aren't answered within minutes are far less likely to convert. Automated instant replies close this gap.");

  const customersLeave: string[] = [];
  if (speedScore < 70) customersLeave.push("The page takes too long to load, and many mobile visitors give up before seeing your offer.");
  if (!sig.testimonials) customersLeave.push("There's no visible social proof, so first-time visitors can't tell if others trust you.");
  if (sig.trustSignals < 2) customersLeave.push("Credentials, guarantees and experience aren't highlighted, so you look like every other option.");
  if (!sig.hasViewport) customersLeave.push("The site isn't mobile-optimised, making it frustrating to use on a phone.");
  if (sig.wordCount < 300) customersLeave.push("There isn't enough information to answer common questions, so visitors look elsewhere.");
  if (!sig.https) customersLeave.push("Browsers label your site \"Not secure\", which scares visitors away.");
  if (customersLeave.length === 0) customersLeave.push("Your fundamentals are solid. Remaining drop-off usually comes from unclear offers and slow follow-up, both fixable with sharper messaging and automation.");

  const improvements = failed.slice(0, 8).map((f) => f.tip);

  const quick = failed.filter((f) => ["seo", "mobile", "accessibility", "trust"].includes(f.cat)).slice(0, 4).map((f) => f.tip);
  const growth = failed.filter((f) => ["leadGen", "conversion"].includes(f.cat)).slice(0, 4).map((f) => f.tip);
  const scale = [
    "Add an AI chatbot and WhatsApp automation so every enquiry gets an instant reply, 24/7.",
    "Connect forms, calls and chats to a CRM with automated follow-up sequences.",
    "Set up an AI voice receptionist for missed and after-hours calls.",
    "Launch targeted Google or Meta campaigns to dedicated landing pages once tracking is in place.",
  ];
  const roadmap = [
    { phase: "Fix the foundations", window: "Week 1–2", items: quick.length ? quick : ["Keep titles, descriptions and schema up to date as you add pages."] },
    { phase: "Capture more leads", window: "Week 3–6", items: growth.length ? growth : ["Test stronger offers and add a lead magnet to capture visitors not ready to buy."] },
    { phase: "Automate & scale", window: "Week 7–12", items: scale },
  ];

  const headline =
    overall >= 80
      ? "Your website is in good shape. The biggest gains now come from automation and faster follow-up."
      : overall >= 60
        ? "Your website works, but it's leaking leads. A few focused fixes could noticeably increase enquiries."
        : "Your website is likely costing you customers. The good news: the fixes are clear and achievable.";

  return { signals: sig, categories, overall, grade, headline, losingLeads, customersLeave, improvements, roadmap };
}
