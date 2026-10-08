import { Accordion } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/shared/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/schema";

export function FAQSection({ faqs, title = "Frequently asked questions", eyebrow = "FAQ", description }: { faqs: { q: string; a: string }[]; title?: string; eyebrow?: string; description?: string }) {
  return (
    <section aria-label={title} className="py-24">
      <JsonLd data={faqSchema(faqs)} />
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading align="left" eyebrow={eyebrow} title={title} description={description} />
        <Accordion items={faqs} />
      </div>
    </section>
  );
}
