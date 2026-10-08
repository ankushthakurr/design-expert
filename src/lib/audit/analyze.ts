import "server-only";
import type { SiteSignals } from "./types";

const UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36 DExpertGrader/1.0";

export function normalizeUrl(input: string) {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  const url = new URL(u);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only http(s) URLs are supported");
  const host = url.hostname.toLowerCase();
  // Block obvious internal targets (SSRF guard).
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    host === "[::1]" ||
    !host.includes(".")
  ) {
    throw new Error("Please enter a public website address");
  }
  return url;
}

async function fetchText(url: string, timeoutMs: number) {
  const started = Date.now();
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
  const ttfb = Date.now() - started;
  const reader = res.body?.getReader();
  let html = "";
  let bytes = 0;
  if (reader) {
    const decoder = new TextDecoder();
    // Cap at ~3 MB to avoid huge downloads.
    while (bytes < 3_000_000) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      html += decoder.decode(value, { stream: true });
    }
    reader.cancel().catch(() => {});
  }
  return { res, html, bytes, ttfb, total: Date.now() - started };
}

const count = (html: string, re: RegExp) => (html.match(re) || []).length;
const has = (html: string, re: RegExp) => re.test(html);

function metaContent(html: string, name: string) {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() ?? "";
}

async function pageSpeed(url: string) {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return null;
  try {
    const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&category=accessibility&category=seo&key=${key}`;
    const res = await fetch(api, { signal: AbortSignal.timeout(45_000), cache: "no-store" });
    if (!res.ok) return null;
    const j = (await res.json()) as {
      lighthouseResult?: { categories?: Record<string, { score: number | null }>; audits?: Record<string, { numericValue?: number }> };
    };
    const c = j.lighthouseResult?.categories ?? {};
    const a = j.lighthouseResult?.audits ?? {};
    return {
      performance: Math.round((c.performance?.score ?? 0) * 100),
      accessibility: Math.round((c.accessibility?.score ?? 0) * 100),
      seo: Math.round((c.seo?.score ?? 0) * 100),
      lcpMs: a["largest-contentful-paint"]?.numericValue ?? null,
      cls: a["cumulative-layout-shift"]?.numericValue ?? null,
    };
  } catch {
    return null;
  }
}

/** Fetches a public web page and extracts the signals used by every D Expert tool. */
export async function analyzeWebsite(input: string): Promise<SiteSignals> {
  const url = normalizeUrl(input);
  const [{ res, html, bytes, ttfb, total }, psi] = await Promise.all([fetchText(url.toString(), 12_000), pageSpeed(url.toString())]);
  const finalUrl = new URL(res.url || url.toString());
  const lower = html.toLowerCase();

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
  const description = metaContent(html, "description");
  const h1s = html.match(/<h1[\s>][\s\S]*?<\/h1>/gi) ?? [];
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  const imgsMissingAlt = imgs.filter((t) => !/\balt=["'][^"']+["']/i.test(t)).length;
  const lazyImgs = imgs.filter((t) => /loading=["']lazy["']/i.test(t)).length;
  const scripts = html.match(/<script\b[^>]*src=[^>]*>/gi) ?? [];
  const blockingScripts = scripts.filter((s) => !/\b(async|defer|type=["']module["'])\b/i.test(s)).length;
  const stylesheets = count(html, /<link[^>]+rel=["']stylesheet["']/gi);
  const jsonLd = (html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) ?? []).join(" ");
  const schemaTypes = Array.from(new Set((jsonLd.match(/"@type"\s*:\s*"([^"]+)"/g) ?? []).map((m) => m.replace(/.*"([^"]+)"$/, "$1"))));
  const forms = count(html, /<form\b/gi);
  const inputs = count(html, /<input\b(?![^>]*type=["']hidden["'])/gi);
  const labels = count(html, /<label\b/gi);
  const text = lower.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const words = text.split(" ").filter((w) => w.length > 2).length;
  const internalLinks = count(html, new RegExp(`href=["'](?:/(?!/)|https?://(?:www\\.)?${finalUrl.hostname.replace(/^www\./, "").replace(/\./g, "\\.")})`, "gi"));

  let robotsTxt = false;
  let sitemap = false;
  try {
    const [r, s] = await Promise.all([
      fetch(new URL("/robots.txt", finalUrl), { signal: AbortSignal.timeout(4000), headers: { "User-Agent": UA } }),
      fetch(new URL("/sitemap.xml", finalUrl), { signal: AbortSignal.timeout(4000), headers: { "User-Agent": UA } }),
    ]);
    robotsTxt = r.ok;
    sitemap = s.ok || (robotsTxt && /sitemap:/i.test(await r.text().catch(() => "")));
  } catch {
    /* ignore */
  }

  return {
    url: finalUrl.toString(),
    host: finalUrl.hostname,
    status: res.status,
    https: finalUrl.protocol === "https:",
    ttfbMs: ttfb,
    loadMs: total,
    htmlKb: Math.round(bytes / 1024),
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    h1Count: h1s.length,
    h2Count: count(html, /<h2[\s>]/gi),
    hasViewport: has(html, /<meta[^>]+name=["']viewport["']/i),
    hasCanonical: has(html, /<link[^>]+rel=["']canonical["']/i),
    hasLang: has(html, /<html[^>]+lang=["'][a-z]/i),
    hasOpenGraph: has(html, /property=["']og:(title|image)["']/i),
    hasTwitterCard: has(html, /name=["']twitter:card["']/i),
    hasFavicon: has(html, /rel=["'](?:shortcut )?icon["']/i),
    noindex: /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html),
    robotsTxt,
    sitemap,
    schemaTypes,
    hasLocalBusinessSchema: schemaTypes.some((t) => /LocalBusiness|Dentist|Restaurant|RoofingContractor|LegalService|MedicalClinic|Physician|RealEstateAgent|HomeAndConstructionBusiness|ProfessionalService|Store|HealthClub/i.test(t)),
    hasFaqSchema: schemaTypes.includes("FAQPage"),
    imgCount: imgs.length,
    imgsMissingAlt,
    lazyImgs,
    modernImages: has(html, /\.(webp|avif)\b/i),
    scriptCount: scripts.length,
    blockingScripts,
    stylesheets,
    wordCount: words,
    internalLinks,
    forms,
    inputs,
    labels,
    telLinks: count(html, /href=["']tel:/gi),
    mailtoLinks: count(html, /href=["']mailto:/gi),
    whatsapp: has(lower, /wa\.me|api\.whatsapp\.com|whatsapp/),
    ctaCount: count(text, /\b(book|schedule|get a quote|free quote|get started|contact us|call now|request|enquire|inquire|sign up|buy now|order now|reserve|free consultation|get in touch)\b/g),
    hasChatWidget: has(lower, /intercom|tawk\.to|crisp\.chat|drift\.com|livechat|tidio|zendesk|hubspot.*conversations|wati|interakt|manychat|botpress|voiceflow/),
    hasBooking: has(lower, /calendly|acuityscheduling|setmore|simplybook|zocdoc|practo|opentable|resy|booking widget|book (an )?appointment|book now|reserve a table/),
    testimonials: has(text, /testimonial|what our (clients|customers|patients) say|reviews?\b|★|5 stars|rated/),
    trustSignals: count(text, /\b(certified|accredited|award|licensed|insured|guarantee|warranty|years of experience|since \d{4}|trusted by|iso \d+|verified)\b/g),
    hasPrivacy: has(text, /privacy policy/),
    hasAddress: has(text, /\b(street|road|marg|nagar|sector|suite|avenue|ave\b|blvd|floor|plot|block)\b/) || has(html, /itemprop=["']address["']|"address"\s*:/i),
    hasPhoneText: has(text, /(\+?\d[\d\s\-()]{8,}\d)/),
    hasMapEmbed: has(lower, /google\.com\/maps|maps\.google|goo\.gl\/maps|g\.page|maps\.app\.goo\.gl/),
    hasGoogleReviewsLink: has(lower, /g\.page\/r\/|search\.google\.com\/local\/writereview|writereview|google reviews/),
    analytics: {
      ga: has(lower, /gtag\(|google-analytics\.com|googletagmanager\.com\/gtag/),
      gtm: has(lower, /googletagmanager\.com\/gtm\.js|gtm-[a-z0-9]+/),
      metaPixel: has(lower, /connect\.facebook\.net|fbq\(/),
      googleAds: has(lower, /aw-\d{6,}|googleadservices|gclid/),
      linkedin: has(lower, /snap\.licdn\.com|_linkedin_partner_id/),
      hotjar: has(lower, /hotjar|clarity\.ms/),
    },
    pageSpeed: psi,
  };
}
