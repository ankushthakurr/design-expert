import { Quote, Star } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { SectionHeading } from "@/components/shared/section-heading";

function Card({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <figure className="glass flex w-[340px] shrink-0 flex-col gap-4 rounded-3xl p-6 md:w-[400px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="size-4 fill-warning text-warning" aria-hidden />
          ))}
        </div>
        <Quote className="size-6 text-primary/40" aria-hidden />
      </div>
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</blockquote>
      <figcaption className="flex items-center gap-3 border-t border-white/8 pt-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-secondary/50 text-sm font-semibold text-foreground">
          {t.name.split(" ").map((n) => n[0]).slice(-2).join("")}
        </span>
        <span>
          <span className="block text-sm font-medium text-foreground">{t.name}</span>
          <span className="block text-xs text-muted">
            {t.role} · {t.location}
          </span>
        </span>
        <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-1 text-[10px] text-primary">{t.service}</span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const rowA = [...testimonials, ...testimonials];
  const rowB = [...testimonials.slice(3), ...testimonials.slice(0, 3), ...testimonials.slice(3), ...testimonials.slice(0, 3)];
  return (
    <section aria-labelledby="testimonials-title" className="overflow-hidden py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Client stories"
          title={<span id="testimonials-title">Business owners who <span className="text-gradient">got their time back</span></span>}
          description="Clinics, restaurants, contractors, agencies, stores and startups use D Expert systems every day."
        />
      </div>
      <div className="marquee-mask mt-14 flex flex-col gap-5">
        <div className="group flex">
          <div className="flex w-max animate-marquee gap-5 [animation-duration:70s] group-hover:[animation-play-state:paused]">
            {rowA.map((t, i) => (
              <div key={i} aria-hidden={i >= testimonials.length}>
                <Card t={t} />
              </div>
            ))}
          </div>
        </div>
        <div className="group hidden md:flex">
          <div className="flex w-max animate-marquee gap-5 [animation-direction:reverse] [animation-duration:80s] group-hover:[animation-play-state:paused]">
            {rowB.map((t, i) => (
              <div key={i} aria-hidden>
                <Card t={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
