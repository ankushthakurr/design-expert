import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { tools } from "@/content/tools";
import { SectionHeading } from "@/components/shared/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";

export function ToolsPromo() {
  return (
    <section aria-labelledby="tools-title" className="relative py-24">
      <div className="glow-orb right-0 top-1/4 size-[500px] bg-primary/15" aria-hidden />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Free business growth tools"
          title={<span id="tools-title">Find your growth leaks <span className="text-gradient">in 60 seconds</span></span>}
          description="SaaS-grade tools that audit your website, calculate the revenue you're missing and map your automation opportunities, free."
        />
        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
          {tools.map((t) => (
            <StaggerItem key={t.slug}>
              <Link href={t.href} className="glass group flex h-full flex-col gap-4 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 text-primary">
                    <Icon name={t.icon} className="size-5" />
                  </span>
                  {t.badge ? (
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] text-accent">{t.badge}</span>
                  ) : (
                    <ArrowUpRight className="size-4 text-subtle group-hover:text-primary" aria-hidden />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.short}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 flex justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/tools">Explore all free tools</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
