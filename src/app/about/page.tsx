import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import { TrustStats } from "@/components/sections/home/trust-stats";
import { ProcessSection } from "@/components/sections/home/process-section";
import { Industries } from "@/components/sections/home/industries";
import { CTASection } from "@/components/sections/cta-section";
import { HeroBrain } from "@/components/three/scenes";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "About D Expert | AI Automation & Digital Marketing Agency",
  description:
    "D Expert is an AI automation and digital marketing agency founded by Pankaj Thakur in New Delhi. We help businesses automate operations, support customers and generate leads with AI.",
  path: "/about",
  keywords: ["about D Expert", "AI automation agency India"],
});

const values = [
  { icon: "Handshake", title: "AI that supports people", desc: "We automate the repetitive so your team can focus on the human moments customers remember." },
  { icon: "Target", title: "Outcomes over output", desc: "We measure success in answered calls, booked appointments and revenue, not deliverables shipped." },
  { icon: "ShieldCheck", title: "Honest & transparent", desc: "Clear pricing, realistic timelines and accounts you own. No black boxes, no lock-in." },
  { icon: "Zap", title: "Speed matters", desc: "Quick wins in weeks, not months, then continuous improvement from real data." },
  { icon: "Lock", title: "Privacy by design", desc: "Least-privilege access, secure integrations and responsible handling of customer data." },
  { icon: "Lightbulb", title: "Always learning", desc: "AI moves fast. We test new models and tools so you don't have to." },
];

const different = [
  { title: "AI + automation + marketing under one roof", desc: "Most agencies do one piece. We build the whole system, so the ad, the website, the AI agent and the follow-up all work together." },
  { title: "Built for real businesses", desc: "Clinics, contractors, restaurants and agencies, not just tech startups. Our systems are designed around how your day actually runs." },
  { title: "Founder-led", desc: "You work directly with Pankaj, who has hands-on experience in every part of the stack." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About D Expert"
        title={
          <>
            We help businesses <span className="text-gradient-animated">grow without the grind</span>
          </>
        }
        description={site.mission}
        breadcrumbs={[{ name: "About", path: "/about" }]}
        aside={<div className="relative h-[360px] md:h-[440px]"><HeroBrain className="absolute inset-0" /></div>}
      >
        <Button variant="secondary" size="lg" className="w-fit" asChild>
          <Link href="/founder">
            Meet the founder <ArrowRight />
          </Link>
        </Button>
      </PageHero>
      <TrustStats />

      <section className="py-24" aria-labelledby="story-title">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <SectionHeading align="left" eyebrow="Our story" title={<span id="story-title">Built to close the gaps that cost businesses customers</span>} />
          <Reveal className="flex flex-col gap-5 text-lg leading-relaxed text-muted">
            <p>
              D Expert was founded in New Delhi by {site.founder.name} after years of watching good businesses lose customers to simple gaps: unanswered calls, slow replies, confusing websites and leads that were never followed up.
            </p>
            <p>
              Today we combine AI voice agents, chatbots, automation, web design and performance marketing into one connected growth system. Our clients range from neighbourhood clinics and restaurants to roofing companies in the US, real estate agencies, ecommerce brands and funded startups.
            </p>
            <p>
              Our promise is simple: every system we build should either bring you more customers, save your team time, or both, and you should be able to see exactly how.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20" aria-labelledby="diff-title">
        <div className="container-x">
          <SectionHeading eyebrow="Why D Expert" title={<span id="diff-title">What makes us different</span>} />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
            {different.map((d, i) => (
              <StaggerItem key={d.title} className="glass border-gradient rounded-3xl p-7">
                <span className="font-mono text-sm text-primary">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold text-foreground">{d.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{d.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-20" aria-labelledby="values-title">
        <div className="container-x">
          <SectionHeading eyebrow="Values" title={<span id="values-title">How we work</span>} />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <StaggerItem key={v.title} className="glass rounded-3xl p-6">
                <Icon name={v.icon} className="size-7 text-primary" />
                <h3 className="mt-4 font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <ProcessSection />
      <Industries />
      <CTASection />
    </>
  );
}
