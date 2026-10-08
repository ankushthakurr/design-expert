"use client";

import { useUI } from "@/store/ui-store";
import { Modal } from "@/components/ui/modal";
import { LeadMagnetForm } from "./lead-magnet-form";

export function LeadMagnetModal() {
  const { leadMagnetOpen, closeLeadMagnet } = useUI();
  return (
    <Modal open={leadMagnetOpen} onClose={closeLeadMagnet} title="Get Instant AI Automation Audit">
      <div className="mb-6 pr-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Free · Instant · No obligation</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground md:text-3xl">Get Your Instant AI Automation Audit</h2>
        <p className="mt-2 text-sm text-muted">
          A website audit, automation roadmap, marketing recommendations and lead generation plan for your business, in under a minute.
        </p>
      </div>
      <LeadMagnetForm compact />
    </Modal>
  );
}
