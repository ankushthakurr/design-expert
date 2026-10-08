import { industries } from "@/content/services";
import { SectionHeading } from "@/components/shared/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";

export function Industries() {
  return (
    <section aria-labelledby="industries-title" className="py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Industries we serve"
          title={<span id="industries-title">Built for businesses where <span className="text-gradient">every lead counts</span></span>}
          description="We've designed AI agents, automations and campaigns around the real day-to-day of these industries."
        />
        <Stagger className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5" stagger={0.04}>
          {industries.map((ind) => (
            <StaggerItem key={ind.name} className="glass group rounded-2xl p-5 transition-colors hover:border-primary/30">
              <Icon name={ind.icon} className="size-6 text-primary transition-transform duration-500 group-hover:scale-110" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">{ind.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{ind.pain}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
