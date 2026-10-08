import Link from "next/link";
import { Workflow3D } from "@/components/three/scenes";
import { SectionHeading } from "@/components/shared/section-heading";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";

const flows = [
  { icon: "Zap", title: "Speed-to-lead in seconds", desc: "Every form, ad lead and missed call gets an instant WhatsApp or SMS reply." },
  { icon: "Database", title: "CRM that updates itself", desc: "Leads are scored, tagged and assigned automatically, with follow-up tasks." },
  { icon: "CalendarCheck", title: "Bookings on autopilot", desc: "Self-serve scheduling, reminders and no-show recovery across channels." },
  { icon: "Repeat", title: "Follow-up that never forgets", desc: "Nurture, review requests and win-back sequences that run 24/7." },
];

export function AutomationSection() {
  return (
    <section aria-labelledby="automation-title" className="relative py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Automation Solutions"
          title={<span id="automation-title">Watch your leads <span className="text-gradient">flow on autopilot</span></span>}
          description="We connect your website, ads, phone, CRM, WhatsApp and calendar into one intelligent workflow. No more copy-paste, no more forgotten follow-ups."
        />
        <div className="glass border-gradient relative mt-14 h-[380px] overflow-hidden rounded-[2rem] sm:h-[460px]">
          <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
          <Workflow3D className="absolute inset-0" />
          <p className="sr-only">
            Diagram: a new lead from the web, ads or a call is qualified by an AI agent, saved to the CRM, followed up on WhatsApp, and booked into the calendar automatically.
          </p>
        </div>
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flows.map((f) => (
            <StaggerItem key={f.title} className="glass rounded-3xl p-6">
              <Icon name={f.icon} className="size-6 text-primary" />
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/automation-audit">Find my automation wins</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/automation-solutions">Explore automation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
