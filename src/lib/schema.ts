import { site, absoluteUrl } from "./site";

/** JSON-LD builders (schema.org). Rendered with <JsonLd /> */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    description: site.description,
    slogan: site.tagline,
    founder: { "@type": "Person", name: site.founder.name, jobTitle: site.founder.role },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phoneRaw,
        contactType: "sales",
        areaServed: ["IN", "US", "GB", "AE", "AU", "CA"],
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: Object.values(site.social),
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": absoluteUrl("/#localbusiness"),
    name: site.name,
    image: absoluteUrl("/og"),
    url: site.url,
    telephone: site.phoneRaw,
    email: site.email,
    priceRange: "₹₹",
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.latitude, longitude: site.geo.longitude },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:30",
        closes: "19:30",
      },
    ],
    areaServed: [{ "@type": "City", name: "New Delhi" }, { "@type": "Country", name: "India" }, "Worldwide"],
    founder: { "@type": "Person", name: site.founder.name },
    parentOrganization: { "@id": absoluteUrl("/#organization") },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: site.url,
    name: site.name,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-IN",
  };
}

export function serviceSchema(input: { name: string; description: string; path: string; serviceType?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType ?? input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": absoluteUrl("/#localbusiness") },
    areaServed: ["India", "United States", "United Kingdom", "UAE", "Australia", "Canada"],
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function articleSchema(input: { title: string; description: string; path: string; date: string; updated?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    datePublished: input.date,
    dateModified: input.updated ?? input.date,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    image: absoluteUrl(`/og?title=${encodeURIComponent(input.title)}`),
    author: { "@type": "Person", name: site.founder.name, url: absoluteUrl("/founder") },
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.founder.name,
    jobTitle: site.founder.role,
    description: site.founder.shortBio,
    url: absoluteUrl("/founder"),
    worksFor: { "@id": absoluteUrl("/#organization") },
    address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
    knowsAbout: [
      "AI Automation",
      "AI Voice Agents",
      "AI Chatbots",
      "CRM Automation",
      "Digital Marketing",
      "Google Ads",
      "Meta Ads",
      "Lead Generation",
      "Web Design",
    ],
    sameAs: Object.values(site.social),
  };
}

export function softwareToolSchema(input: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    provider: { "@id": absoluteUrl("/#organization") },
  };
}
