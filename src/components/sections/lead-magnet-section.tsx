import { CheckCircle2 } from "lucide-react";
import { LeadMagnetForm } from "@/components/forms/lead-magnet-form";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";

const provides = ["Website Audit", "Automation Roadmap", "Marketing Recommendations", "Lead Generation Recommendations"];

export function LeadMagnetSection() {
  return (
    <section id="free-audit" aria-labelledby="lm-title" className="py-24">
      <div className="container-x">
        <Reveal className="glass-strong border-gradient relative grid gap-10 overflow-hidden rounded-[2rem] p-6 md:p-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="glow-orb -left-20 -top-20 size-80 bg-secondary/40" aria-hidden />
          <div className="relative flex flex-col gap-5">
            <Badge variant="accent">Free lead magnet</Badge>
            <h2 id="lm-title" className="text-3xl font-semibold leading-tight text-foreground md:text-4xl">
              Get Instant <span className="text-gradient">AI Automation Audit</span>
            </h2>
            <p className="text-muted">
              Answer six quick questions and get a personalised report for your business in under a minute, no call required.
            </p>
            <ul className="flex flex-col gap-3">
              {provides.map((p) => (
                <li key={p} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="size-5 text-accent" aria-hidden /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <LeadMagnetForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
