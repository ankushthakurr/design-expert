"use client";

import { useState } from "react";
import { CalendarCheck, Clock } from "lucide-react";
import { bookingTypes, type BookingType } from "@/lib/site";
import { CalendlyEmbed } from "./calendly-embed";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

const icons: Record<BookingType, string> = { consultation: "Compass", aiDemo: "AudioLines", automation: "Workflow", marketing: "TrendingUp" };

export function BookingCenter() {
  const [type, setType] = useState<BookingType>("consultation");
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <div role="tablist" aria-label="Choose a meeting type" className="flex flex-col gap-3">
        {(Object.keys(bookingTypes) as BookingType[]).map((k) => {
          const b = bookingTypes[k];
          const active = k === type;
          return (
            <button
              key={k}
              role="tab"
              aria-selected={active}
              onClick={() => setType(k)}
              className={cn("glass flex gap-4 rounded-2xl p-5 text-left transition-all", active ? "border-primary/50 shadow-glow" : "hover:border-white/20")}
            >
              <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", active ? "bg-primary text-background" : "bg-white/5 text-primary")}>
                <Icon name={icons[k]} className="size-5" />
              </span>
              <span>
                <span className="block font-semibold text-foreground">{b.label}</span>
                <span className="mt-1 block text-sm text-muted">{b.description}</span>
                <span className="mt-2 flex items-center gap-1.5 text-xs text-primary">
                  <Clock className="size-3.5" aria-hidden /> {b.duration} · Free · Video call
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="glass rounded-[2rem] p-3">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
          <CalendarCheck className="size-4 text-primary" aria-hidden /> {bookingTypes[type].label}: pick a time that suits you
        </div>
        <CalendlyEmbed key={type} url={bookingTypes[type].url} height={700} />
      </div>
    </div>
  );
}
