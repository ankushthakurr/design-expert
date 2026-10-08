import type { Metadata } from "next";
import { site, absoluteUrl } from "./site";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  noIndex?: boolean;
};

/** Builds per-page metadata: title, description, canonical, Open Graph and Twitter cards. */
export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  type = "website",
  publishedTime,
  noIndex,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl(`/og?title=${encodeURIComponent(title)}`);
  return {
    title,
    description,
    keywords: [...keywords, ...site.keywords.slice(0, 6)],
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      locale: "en_IN",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: site.twitterHandle,
      creator: site.twitterHandle,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
