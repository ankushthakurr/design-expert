# D Expert: AI Automation & Digital Growth Website

Premium marketing site for **D Expert** (Pankaj Thakur, New Delhi), built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, React Three Fiber, Framer Motion and GSAP.

- 57 statically generated pages, plus 2 API routes (`/api/lead`, `/api/audit`) and a dynamic OG image route (`/og`)
- 5 interactive 3D scenes that lazy-load, pause offscreen and fall back gracefully without WebGL or with reduced motion
- 8 free growth tools, a business growth assessment, an ROI calculator suite and an AI voice agent demo center
- Full SEO: metadata, Open Graph, JSON-LD (Organization, LocalBusiness, Service, FAQ, Article, Person, Breadcrumb), sitemap, robots and manifest

---

## 1. Run locally

Requires Node.js 20.9 or newer (22 LTS recommended).

```bash
npm install
cp .env.example .env.local   # then fill in the values (see section 3)
npm run dev                  # http://localhost:3000
```

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with Turbopack |
| `npm run build` | Production build (must pass before deploying) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core web vitals and TypeScript rules) |
| `npm run typecheck` | TypeScript, no emit |

---

## 2. Deploy to Vercel (recommended)

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository. The framework preset (Next.js) is detected automatically, so leave build settings as they are.
3. Add the environment variables from section 3 under **Settings → Environment Variables** (Production and Preview).
4. Deploy.
5. Under **Settings → Domains**, add your domain (for example `dexpert.in` and `www.dexpert.in`) and follow Vercel's DNS instructions. Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy so canonical URLs and the sitemap use it.
6. Submit `https://<your-domain>/sitemap.xml` in Google Search Console and verify the domain.

**Other hosts.** Any Node.js host that runs `npm run build && npm run start` works (Netlify, Render, Railway, a VPS with PM2 behind Nginx). The site is not a static export because the lead and audit APIs run on the server.

---

## 3. Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production URL without a trailing slash. Used for canonical URLs, the sitemap, Open Graph and schema. |
| `NEXT_PUBLIC_CALENDLY_URL` | Yes | Default Calendly link (Free Strategy Call). |
| `NEXT_PUBLIC_CALENDLY_AI_DEMO_URL` | No | Calendly event for "Book AI Demo". Falls back to the default link. |
| `NEXT_PUBLIC_CALENDLY_AUTOMATION_URL` | No | Calendly event for automation consultations. |
| `NEXT_PUBLIC_CALENDLY_MARKETING_URL` | No | Calendly event for marketing consultations. |
| `CRM_WEBHOOK_URL` | Strongly recommended | Every lead (contact form, lead magnet, tool results, assessments) is POSTed here as JSON. Works with GoHighLevel, HubSpot workflows, Zapier, Make, n8n or Pabbly. Without it, leads are only written to the server log. |
| `CRM_WEBHOOK_SECRET` | No | Sent as the `X-Webhook-Secret` header so your automation can reject fake requests. |
| `PAGESPEED_API_KEY` | No | Google PageSpeed Insights key. When set, the Website Grader adds real Lighthouse performance data. Free from Google Cloud Console. |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 measurement ID (`G-XXXXXXX`). |

### Lead payload

`POST /api/lead` forwards this shape to `CRM_WEBHOOK_URL`:

```json
{
  "source": "lead-magnet | contact | website-grader | automation-advisor | ai-strategy-generator | growth-assessment | ...",
  "data": { "name": "...", "email": "...", "phone": "...", "businessName": "...", "industry": "..." },
  "page": "/path",
  "receivedAt": "ISO date",
  "userAgent": "...",
  "referer": "..."
}
```

The endpoint validates input with Zod, ignores bots through a honeypot field and rate-limits each IP. Map `source` in your CRM to tag or route leads.

---

## 4. Replace placeholder content before launch

All copy lives in `src/content/*.ts` and `src/lib/site.ts`. Search the project for `TODO(owner)` to find every item.

| What | Where | Notes |
| --- | --- | --- |
| Domain, email, postal code, social links, Twitter handle | `src/lib/site.ts` | Phone and WhatsApp (`+91 98737 63204`) are already set. |
| Stats ("50+ projects", etc.) | `src/content/testimonials.ts` → `trustStats` | **Placeholders.** Confirm or change them. |
| Client logos | `src/content/testimonials.ts` → `clientLogos` | **Placeholder wordmarks.** Add real SVGs to `/public/logos`, and only with permission. |
| Testimonials | `src/content/testimonials.ts` | **Placeholders.** Replace with real, permitted quotes. |
| Portfolio projects and case study metrics | `src/content/portfolio.ts`, `src/content/case-studies.ts` | Sample projects. Replace with verified work. Mockups are generated in CSS; add real screenshots to `/public/portfolio` and update `project-visual.tsx` if you like. |
| Pricing | `src/content/pricing.ts` | Confirm INR and USD prices. |
| Founder story, timeline years and portrait | `src/content/founder.ts`, `src/app/founder/page.tsx` | Add a portrait at `/public/images/pankaj-thakur.jpg`. |
| Intro video | `src/lib/site.ts` → `introVideo` | Set `type` to `youtube`, `vimeo` or `file` and add the `id` or file path. A styled placeholder shows until then. |
| Blog posts | `src/content/blog.ts` | Six full articles are included. Add more objects to publish more. |

---

## 5. Voice agent demo recordings

`/voice-agent-demo` runs three scripted calls (dental clinic, restaurant, real estate). Agent lines currently use the visitor's built-in browser voice. To use real recordings:

1. Record one MP3 for each agent line. The file name is the node id in `src/content/voice-demos.ts`, for example:
   ```
   public/audio/demos/dental/greet.mp3
   public/audio/demos/dental/book.mp3
   public/audio/demos/restaurant/confirm730.mp3
   public/audio/demos/real-estate/visit.mp3
   ```
2. Set `hasRecordings: true` for that demo in `src/content/voice-demos.ts`.

Any missing file falls back to the browser voice automatically. Keep files small (mono, 64–96 kbps).

The microphone is optional. When the visitor allows it, the waveform reacts to their voice and, in Chrome, Edge and Safari, speech recognition picks the matching reply. Nothing is recorded or sent to the server. `next.config.ts` sets `Permissions-Policy: microphone=(self)` so this works on your own domain only.

---

## 6. Project structure

```
src/
  app/                 Routes (App Router). Each folder is a page.
    api/lead           Lead capture → CRM webhook
    api/audit          Server-side website scan (SSRF-guarded) + optional PageSpeed
    og/                Dynamic Open Graph images (/og?title=...)
  components/
    three/             R3F scenes + SceneCanvas (lazy mount, offscreen pause, fallbacks)
    sections/          Page sections (home/*, CTA, FAQ, pillar page template)
    tools/             Free tools and calculators
    voice/             Voice demo center, waveform, idle orb
    booking/           Calendly embed, booking modal
    forms/             Lead magnet and contact forms
    ui/                Buttons, inputs, cards, modal, accordion
  content/             All site copy and data
  lib/                 SEO, schema, validation, ROI maths, audit engine, playbooks
  store/               Zustand UI store (modals, currency)
```

---

## 7. Production best practices

- **Performance.** 3D scenes load only when visible and pause offscreen. Keep new images in AVIF or WebP through `next/image`, and avoid adding heavy client libraries to the home page. Check with PageSpeed Insights after each major change.
- **Leads.** Point `CRM_WEBHOOK_URL` at an automation that sends an instant WhatsApp or email reply. Test every form after deployment.
- **Rate limiting.** The built-in limiter is per server instance. For heavy traffic, add Vercel Firewall rules or an Upstash-based limiter.
- **Security.** Security headers are set in `next.config.ts`. Never commit `.env.local`. Rotate `CRM_WEBHOOK_SECRET` if it leaks.
- **SEO.** After launch, verify the domain in Google Search Console, submit the sitemap and link the site from your Google Business Profile. Keep `site.ts` business details identical to your Google profile (name, address, phone).
- **Calendly.** Add your domain to Calendly's embed settings if you restrict embeds. The booking iframe loads lazily, only when opened.
- **Accessibility.** Keep the colour tokens in `globals.css`, use `Label` for every input and test with keyboard only after adding new components.
