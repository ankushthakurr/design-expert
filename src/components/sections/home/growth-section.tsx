import Link from "next/link";
import { Rocket3D } from "@/components/three/scenes";
import { RevenueGraph } from "@/components/charts/revenue-graph";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";

const pillars = [
  { icon: "Search", label: "Google Ads", desc: "Capture high-intent searches" },
  { icon: "Megaphone", label: "Meta Ads", desc: "Create and retarget demand" },
  { icon: "MapPin", label: "Local SEO", desc: "Win the Google map pack" },
  { icon: "Gem", label: "Brand", desc: "Look as good as you are" },
];

export function GrowthSection() {
  return (
    <section aria-labelledby="growth-title" className="relative overflow-hidden py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <div className="glass border-gradient relative h-[360px] overflow-hidden rounded-[2rem] sm:h-[440px]">
            <Rocket3D className="absolute inset-0" />
          </div>
          <div className="glass-strong relative -mt-20 ml-auto w-[88%] rounded-3xl p-5 sm:-mt-24 sm:w-[78%]">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted">Pipeline value</p>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">Growing</span>
            </div>
            <RevenueGraph className="w-full" />
            <p className="mt-1 text-[11px] text-subtle">Illustrative growth curve</p>
          </div>
        </div>
        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="Brand & Digital Growth"
            title={<span id="growth-title">Launch campaigns that <span className="text-gradient">compound into growth</span></span>}
            description="Ads bring the traffic, a strong brand earns the trust, and automation makes sure no lead is wasted. We build all three as one system with tracking you can believe."
          />
          <div className="grid grid-cols-2 gap-3">
            {pillars.map((p) => (
              <div key={p.label} className="glass rounded-2xl p-4">
                <Icon name={p.icon} className="size-5 text-primary" />
                <p className="mt-2 text-sm font-semibold text-foreground">{p.label}</p>
                <p className="text-xs text-muted">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/digital-marketing">Grow with D Expert</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/tools/digital-marketing-audit">Free marketing audit</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
