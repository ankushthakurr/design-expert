import Link from "next/link";
import { projects } from "@/content/portfolio";
import { SectionHeading } from "@/components/shared/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { ProjectCard } from "@/components/portfolio/project-card";
import { Button } from "@/components/ui/button";

export function FeaturedWork() {
  const featured = ["ai-receptionist-dental-clinic", "real-estate-lead-qualification-agent", "restaurant-website-ai-booking", "ecommerce-automation-system", "roofing-company-website", "ai-company-knowledge-search"]
    .map((s) => projects.find((p) => p.slug === s)!)
    .filter(Boolean);
  return (
    <section aria-labelledby="work-title" className="py-24">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Selected work"
            title={<span id="work-title">AI systems & websites <span className="text-gradient">that do the work</span></span>}
          />
          <Button variant="secondary" asChild>
            <Link href="/portfolio">View full portfolio</Link>
          </Button>
        </div>
        <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <StaggerItem key={p.slug}>
              <ProjectCard project={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
