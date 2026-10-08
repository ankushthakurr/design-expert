"use client";

import dynamic from "next/dynamic";
import { SmoothScroll } from "./smooth-scroll";
import { WhatsAppButton } from "./whatsapp-button";

// Modals are only needed after interaction: keep them out of the initial bundle.
const BookingModal = dynamic(() => import("@/components/booking/booking-modal").then((m) => m.BookingModal), { ssr: false });
const LeadMagnetModal = dynamic(() => import("@/components/forms/lead-magnet-modal").then((m) => m.LeadMagnetModal), { ssr: false });

export function GlobalUI() {
  return (
    <>
      <SmoothScroll />
      <WhatsAppButton />
      <BookingModal />
      <LeadMagnetModal />
    </>
  );
}
