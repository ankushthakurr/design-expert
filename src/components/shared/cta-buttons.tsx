"use client";

import Link from "next/link";
import { ArrowRight, Bot, CalendarCheck, Gauge, PlayCircle } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useUI } from "@/store/ui-store";
import type { BookingType } from "@/lib/site";

export function BookButton({ booking = "consultation", children, ...props }: ButtonProps & { booking?: BookingType }) {
  const openBooking = useUI((s) => s.openBooking);
  return (
    <Button onClick={() => openBooking(booking)} {...props}>
      {children ?? (
        <>
          <CalendarCheck /> Book Free Strategy Call
        </>
      )}
    </Button>
  );
}

export function LeadMagnetButton({ children, ...props }: ButtonProps) {
  const open = useUI((s) => s.openLeadMagnet);
  return (
    <Button onClick={open} {...props}>
      {children ?? (
        <>
          <Bot /> Get AI Automation Audit
        </>
      )}
    </Button>
  );
}

export function HeroActions() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <BookButton size="xl" variant="primary">
          <CalendarCheck /> Book Free Strategy Call <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
        </BookButton>
        <Button size="xl" variant="secondary" asChild>
          <Link href="/voice-agent-demo">
            <PlayCircle className="text-primary" /> Watch AI Demo
          </Link>
        </Button>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 pl-1">
        <Link href="/website-grader" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary">
          <Gauge className="size-4 text-primary" aria-hidden /> Get Free Website Audit
        </Link>
        <LeadMagnetButton variant="link" size="sm" className="h-auto text-sm text-muted hover:text-primary">
          <Bot className="text-accent" /> Get AI Automation Audit
        </LeadMagnetButton>
      </div>
    </div>
  );
}
