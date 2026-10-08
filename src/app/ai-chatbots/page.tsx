import type { Metadata } from "next";
import { getPillar } from "@/content/pillars";
import { buildMetadata } from "@/lib/seo";
import { PillarPage } from "@/components/sections/pillar-page";

const pillar = getPillar("ai-chatbots");

export const metadata: Metadata = buildMetadata({
  title: pillar.metaTitle,
  description: pillar.metaDescription,
  path: pillar.path,
  keywords: pillar.keywords,
});

export default function Page() {
  return <PillarPage pillar={pillar} />;
}
