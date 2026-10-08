"use client";

import { bookingTypes, type BookingType } from "@/lib/site";
import { useUI } from "@/store/ui-store";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { CalendlyEmbed } from "./calendly-embed";

export function BookingModal() {
  const { bookingOpen, bookingType, closeBooking, openBooking } = useUI();
  const active = bookingTypes[bookingType];
  return (
    <Modal open={bookingOpen} onClose={closeBooking} title={active.label} className="max-w-4xl">
      <div className="mb-5 pr-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Book with Pankaj Thakur</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">{active.label}</h2>
        <p className="mt-1 text-sm text-muted">{active.description}</p>
      </div>
      <div role="tablist" aria-label="Meeting type" className="mb-5 flex flex-wrap gap-2">
        {(Object.keys(bookingTypes) as BookingType[]).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={k === bookingType}
            onClick={() => openBooking(k)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs transition-colors",
              k === bookingType ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-muted hover:text-foreground",
            )}
          >
            {bookingTypes[k].label} · {bookingTypes[k].duration}
          </button>
        ))}
      </div>
      <CalendlyEmbed key={active.url + bookingType} url={active.url} height={620} />
    </Modal>
  );
}
