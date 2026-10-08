import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { tools, extraTools } from "@/content/tools";
import { PageHero } from "@/components/shared/page-hero";
import { Icon } from "@/components/shared/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { softwareToolSchema } from "@/lib/schema";
import { CTASection } from "@/components/sections/cta-section";

export function ToolShell({
  title,
  highlight,
  description,
  path,
  breadcrumb,
  children,
  schemaName,
}: {
  title: string;
  highlight?: string;
  description: string;
  path: string;
  breadcrumb: string;
  children: React.ReactNode;
  schemaName?: string;
}) {
  const others = [...tools.map((t) => ({ href: t.href, title: t.title, short: t.short, icon: t.icon })), ...extraTools].filter((t) => t.href !== path).slice(0, 4);
  return (
    <>
      <JsonLd data={softwareToolSchema({ name: schemaName ?? breadcrumb, description, path })} />
      <PageHero
        eyebrow="Free tool"
        title={
          <>
            {title} {highlight && <span className="text-gradient-animated">{highlight}</span>}
          </>
        }
        description={description}
        breadcrumbs={[
          { name: "Tools", path: "/tools" },
          { name: breadcrumb, path },
        ]}
        className="pb-10"
      />
      <section className="pb-16">
        <div className="container-x">{children}</div>
      </section>
      <section className="py-16">
        <div className="container-x">
          <h2 className="mb-6 text-xl font-semibold text-foreground">More free tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((t) => (
              <Link key={t.href} href={t.href} className="glass group flex gap-3 rounded-2xl p-5 hover:border-primary/30">
                <Icon name={t.icon} className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    {t.title} <ArrowUpRight className="size-3.5 text-subtle group-hover:text-primary" aria-hidden />
                  </span>
                  <span className="mt-1 block text-xs text-muted">{t.short}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTASection title="Want an expert to review your results?" description="Book a free strategy call and Pankaj will walk you through your report and the fastest fixes for your business." />
    </>
  );
}

export function NumberField({ id, label, value, onChange, min = 0, max, step = 1, prefix, suffix, hint }: { id: string; label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; prefix?: string; suffix?: string; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-xs font-medium tracking-wide text-muted">
        <span>{label}</span>
        <span className="font-mono text-sm text-primary tabular-nums">
          {prefix}
          {value.toLocaleString("en-IN")}
          {suffix}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#00F5FF]"
      />
      <input
        type="number"
        aria-label={`${label} (exact value)`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
        className="mt-2 h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-foreground focus:border-primary/60 focus:outline-none"
      />
      {hint && <p className="mt-1 text-[11px] text-subtle">{hint}</p>}
    </div>
  );
}

export function StatTile({ label, value, sub, accent = "#00F5FF" }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums md:text-3xl" style={{ color: accent }}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-subtle">{sub}</p>}
    </div>
  );
}
