import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTool } from "@/content/tools";
import { ToolShell } from "@/components/tools/tool-shell";
import { VoiceRoiCalculator } from "@/components/tools/voice-roi-calculator";
import { FAQSection } from "@/components/sections/faq-section";

const tool = getTool("ai-roi-calculator");
export const metadata: Metadata = buildMetadata({ title: tool.metaTitle, description: tool.metaDescription, path: tool.href, keywords: ["AI voice agent ROI", "missed call calculator", "AI receptionist ROI"] });

const faqs = [
  { q: "How accurate is this calculator?", a: "It uses conservative, clearly stated assumptions to give a directional estimate. Your real results depend on call mix, offer and follow-up. We'll refine the numbers with your actual call data on a strategy call." },
  { q: "How do I find my missed-call numbers?", a: "Most phone systems and VoIP providers show unanswered and after-hours calls in their call logs. If you don't track them, a typical small business misses 15–30% of calls." },
  { q: "Does an AI voice agent replace my receptionist?", a: "No. It handles overflow, after-hours and routine calls so your receptionist can focus on the people in front of them. Calls can be transferred to staff at any time." },
];

export default function Page() {
  return (
    <ToolShell title="AI Voice Agent" highlight="ROI Calculator" description={tool.description} path={tool.href} breadcrumb="AI ROI Calculator" schemaName={tool.title}>
      <VoiceRoiCalculator />
      <FAQSection faqs={faqs} title="About the ROI calculator" />
    </ToolShell>
  );
}
