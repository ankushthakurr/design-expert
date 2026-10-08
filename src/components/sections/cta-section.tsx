import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BookButton } from "@/components/shared/cta-buttons";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import type { BookingType } from "@/lib/site";

export function CTASection({
  title = "Ready to scale with AI automation?",
  description = "Book a free 30-minute strategy call. We'll map the AI agents, automations and campaigns that will have the biggest impact on your business, with no obligation.",
  primary = "Book Free Strategy Call",
  booking = "consultation",
  secondary = { label: "Try the AI Voice Demo", href: "/voice-agent-demo" },
}: {
  title?: string;
  description?: string;
  primary?: string;
  booking?: BookingType;
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="py-20">
      <div className="container-x">
        <Reveal className="noise relative isolate overflow-hidden rounded-[2rem] border border-white/10 p-10 text-center md:p-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,245,255,0.25),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(123,97,255,0.35),transparent_55%),#0a0f24]" aria-hidden />
          <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight text-foreground md:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted md:text-lg">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BookButton booking={booking} size="xl">
              {primary} <ArrowRight />
            </BookButton>
            <Button size="xl" variant="secondary" asChild>
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
