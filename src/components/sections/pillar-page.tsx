import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import type { Pillar } from "@/content/pillars";
import { projects } from "@/content/portfolio";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import { BookButton } from "@/components/shared/cta-buttons";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/portfolio/project-card";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceSchema } from "@/lib/schema";
import { Workflow3D, Rocket3D, Globe3D } from "@/components/three/scenes";
import { IdleVoiceOrb } from "@/components/voice/idle-voice-orb";
import { ChatDemo } from "@/components/shared/chat-demo";
import { ProjectVisual } from "@/components/portfolio/project-visual";

function HeroVisual({ scene }: { scene: Pillar["scene"] }) {
  switch (scene) {
    case "voice":
      return (
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <IdleVoiceOrb className="absolute inset-0" />
        </div>
      );
    case "workflow":
      return (
        <div className="glass border-gradient relative h-[380px] overflow-hidden rounded-[2rem] md:h-[440px]">
          <Workflow3D className="absolute inset-0" />
        </div>
      );
    case "chat":
      return <ChatDemo />;
    case "web":
      return (
        <div className="relative">
          <ProjectVisual kind="web" colors={["#00F5FF", "#7B61FF"]} title="Website design example" className="aspect-[4/3] rounded-[2rem] border border-white/10" />
          <ProjectVisual kind="chat" colors={["#00FF9D", "#7B61FF"]} title="Mobile website example" className="absolute -bottom-8 -left-6 hidden aspect-[9/14] w-40 rounded-3xl border border-white/10 shadow-2xl sm:block" />
        </div>
      );
    case "rocket":
      return (
        <div className="glass border-gradient relative h-[380px] overflow-hidden rounded-[2rem] md:h-[460px]">
          <Rocket3D className="absolute inset-0" />
        </div>
      );
    case "brand":
      return (
        <div className="relative mx-auto aspect-square w-full max-w-[500px]">
          <Globe3D className="absolute inset-0" />
        </div>
      );
  }
}

export function PillarPage({ pillar }: { pillar: Pillar }) {
  const related = pillar.related.map((s) => projects.find((p) => p.slug === s)).filter(Boolean) as typeof projects;
  return (
    <>
      <JsonLd data={serviceSchema({ name: pillar.eyebrow, description: pillar.metaDescription, path: pillar.path })} />
      <PageHero
        eyebrow={pillar.eyebrow}
        title={
          <>
            {pillar.title} <span className="text-gradient-animated">{pillar.highlight}</span>
          </>
        }
        description={pillar.intro}
        breadcrumbs={[
          { name: "Services", path: "/services" },
          { name: pillar.eyebrow, path: pillar.path },
        ]}
        aside={<HeroVisual scene={pillar.scene} />}
      >
        <div className="flex flex-wrap gap-3">
          <BookButton booking={pillar.cta.booking} size="lg">
            {pillar.cta.primary} <ArrowRight />
          </BookButton>
          {pillar.slug === "ai-voice-agents" ? (
            <Button size="lg" variant="secondary" asChild>
              <Link href="/voice-agent-demo">Hear a live demo</Link>
            </Button>
          ) : (
            <Button size="lg" variant="secondary" asChild>
              <Link href="/tools">Try a free tool</Link>
            </Button>
          )}
        </div>
        <dl className="mt-4 grid max-w-xl grid-cols-3 gap-4">
          {pillar.heroStats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-semibold text-gradient">{s.value}</dd>
              <dd className="text-xs leading-snug text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {pillar.note && (
        <div className="container-x">
          <p className="flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent/5 p-5 text-sm text-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            {pillar.note}
          </p>
        </div>
      )}

      {/* Problems */}
      <section className="py-20" aria-labelledby="problems-title">
        <div className="container-x">
          <SectionHeading eyebrow="The problem" title={<span id="problems-title">Sound familiar?</span>} />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {pillar.problems.map((p) => (
              <StaggerItem key={p.title} className="glass rounded-3xl p-6">
                <AlertCircle className="size-6 text-warning" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Offerings */}
      <section className="py-20" aria-labelledby="offer-title">
        <div className="container-x">
          <SectionHeading eyebrow="What we build" title={<span id="offer-title">Solutions designed around <span className="text-gradient">your business</span></span>} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {pillar.offerings.map((o, i) => (
              <Reveal key={o.id} delay={i * 0.05}>
                <article id={o.id} className="glass group h-full scroll-mt-28 rounded-3xl p-7 transition-colors hover:border-primary/30">
                  <div className="flex items-center gap-4">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/25 text-primary">
                      <Icon name={o.icon} className="size-6" />
                    </span>
                    <h3 className="text-xl font-semibold text-foreground">{o.title}</h3>
                  </div>
                  <p className="mt-4 leading-relaxed text-muted">{o.desc}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {o.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {f}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20" aria-labelledby="benefits-title">
        <div className="container-x">
          <SectionHeading eyebrow="The outcome" title={<span id="benefits-title">What changes for your business</span>} />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillar.benefits.map((b) => (
              <StaggerItem key={b.title} className="glass border-gradient rounded-3xl p-6">
                <Icon name={b.icon} className="size-7 text-primary" />
                <h3 className="mt-4 font-semibold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process + deliverables */}
      <section className="py-20" aria-labelledby="pp-process-title">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Process" title={<span id="pp-process-title">How we deliver</span>} />
            <ol className="mt-10 flex flex-col gap-0">
              {pillar.process.map((s, i) => (
                <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < pillar.process.length - 1 && <span className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px bg-gradient-to-b from-primary/60 to-transparent" aria-hidden />}
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-surface font-mono text-sm text-primary">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-5">
            <Reveal className="glass rounded-3xl p-7">
              <h3 className="text-lg font-semibold text-foreground">What you get</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {pillar.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-foreground/90">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {d}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="glass rounded-3xl p-7" delay={0.05}>
              <h3 className="text-lg font-semibold text-foreground">Industries we serve</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {pillar.industries.map((i) => (
                  <span key={i} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted">{i}</span>
                ))}
              </div>
              <h3 className="mt-7 text-lg font-semibold text-foreground">Technology we use</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {pillar.stack.map((i) => (
                  <span key={i} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary">{i}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20" aria-labelledby="related-title">
          <div className="container-x">
            <SectionHeading eyebrow="Related work" title={<span id="related-title">See it in action</span>} />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQSection faqs={pillar.faqs} title={`${pillar.eyebrow}: FAQs`} />
      <CTASection title={pillar.cta.title} description={pillar.cta.desc} primary={pillar.cta.primary} booking={pillar.cta.booking} />
    </>
  );
}
