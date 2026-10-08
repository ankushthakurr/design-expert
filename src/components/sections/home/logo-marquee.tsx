import { clientLogos } from "@/content/testimonials";
import { cn } from "@/lib/utils";

export function LogoMarquee() {
  const row = [...clientLogos, ...clientLogos];
  return (
    <section aria-labelledby="logos-title" className="py-14">
      <div className="container-x">
        <h2 id="logos-title" className="mb-8 text-center text-sm font-medium uppercase tracking-[0.25em] text-subtle">
          Trusted By Growing Businesses
        </h2>
        <div className="marquee-mask group relative overflow-hidden">
          <ul className="flex w-max animate-marquee items-center gap-14 group-hover:[animation-play-state:paused]">
            {row.map((l, i) => (
              <li key={i} aria-hidden={i >= clientLogos.length} className="flex shrink-0 items-center gap-2.5 text-muted/80 transition-colors hover:text-foreground">
                <span className="size-6 rounded-lg bg-gradient-to-br from-primary/60 to-secondary/60 opacity-70" />
                <span className={cn("whitespace-nowrap text-xl text-foreground/70", l.style)}>{l.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
