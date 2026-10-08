import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-subtle">
          {all.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1.5">
              {i < all.length - 1 ? (
                <>
                  <Link href={it.path} className="transition-colors hover:text-primary">
                    {it.name}
                  </Link>
                  <ChevronRight aria-hidden className="size-3" />
                </>
              ) : (
                <span aria-current="page" className="text-muted">
                  {it.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
