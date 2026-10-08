import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { homeServices } from "@/content/services";
import { SectionHeading } from "@/components/shared/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ServicesBento() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="What we build"
          title={<span id="services-title">One partner for <span className="text-gradient">AI, automation & growth</span></span>}
          description="From the first ad click to the booked appointment and the follow-up after, we build every piece of your growth engine and connect it together."
        />
        <Stagger className="mt-14 grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeServices.map((s) => (
            <StaggerItem
              key={s.title}
              className={cn(s.span === "lg" && "sm:col-span-2 sm:row-span-2", s.span === "md" && "sm:col-span-2")}
            >
              <Link
                href={s.href}
                className="glass group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow"
              >
                <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/0 blur-3xl transition-colors duration-700 group-hover:bg-primary/20" aria-hidden />
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <ArrowUpRight className="size-5 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                </div>
                <div className="mt-6">
                  {"tag" in s && s.tag && <span className="mb-2 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">{s.tag}</span>}
                  <h3 className={cn("font-semibold text-foreground", s.span === "lg" ? "text-2xl md:text-3xl" : "text-lg")}>{s.title}</h3>
                  <p className={cn("mt-2 leading-relaxed text-muted", s.span === "lg" ? "text-base" : "text-sm")}>{s.desc}</p>
                  {s.span === "lg" && (
                    <div className="mt-6 flex items-end gap-1" aria-hidden>
                      {Array.from({ length: 38 }).map((_, i) => (
                        <span
                          key={i}
                          className="w-1.5 rounded-full bg-gradient-to-t from-secondary to-primary opacity-70"
                          style={{ height: `${10 + Math.abs(Math.sin(i * 0.7) * 34) + (i % 3) * 6}px` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 flex justify-center">
          <Button variant="secondary" size="lg" asChild>
            <Link href="/services">Explore all 25 services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
