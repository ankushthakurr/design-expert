"use client";

import { Check, Crown, X } from "lucide-react";
import { plans, pricingComparison } from "@/content/pricing";
import { useUI } from "@/store/ui-store";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CurrencyToggle() {
  const { currency, setCurrency } = useUI();
  return (
    <div role="radiogroup" aria-label="Currency" className="glass inline-flex rounded-full p-1">
      {(["INR", "USD"] as const).map((c) => (
        <button
          key={c}
          role="radio"
          aria-checked={currency === c}
          onClick={() => setCurrency(c)}
          className={cn("rounded-full px-5 py-2 text-sm transition-all", currency === c ? "bg-primary text-background" : "text-muted hover:text-foreground")}
        >
          {c === "INR" ? "₹ INR" : "$ USD"}
        </button>
      ))}
    </div>
  );
}

export function PricingCards() {
  const { currency, openBooking } = useUI();
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {plans.map((p) => {
        const price = currency === "INR" ? p.priceINR : p.priceUSD;
        const setup = currency === "INR" ? p.setupINR : p.setupUSD;
        return (
          <article
            key={p.id}
            className={cn(
              "relative flex flex-col rounded-[2rem] p-7",
              p.highlighted
                ? "border-gradient bg-[linear-gradient(160deg,rgba(0,245,255,0.14),rgba(123,97,255,0.18)_50%,rgba(0,255,157,0.1))] shadow-glow-violet xl:-my-4 xl:py-11"
                : "glass",
            )}
            aria-label={`${p.name} plan`}
          >
            {p.badge && (
              <span className={cn("absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold", p.highlighted ? "bg-[linear-gradient(110deg,#00f5ff,#7b61ff,#00ff9d)] text-background" : "bg-white/10 text-foreground")}>
                {p.highlighted && <Crown className="size-3.5" aria-hidden />} {p.badge}
              </span>
            )}
            <h3 className="text-xl font-semibold text-foreground">{p.name}</h3>
            <p className="mt-2 min-h-12 text-sm text-muted">{p.tagline}</p>
            <div className="mt-6">
              {price ? (
                <>
                  <span className="text-4xl font-semibold tracking-tight text-foreground">{formatCurrency(price, currency)}</span>
                  <span className="text-sm text-muted"> /month</span>
                  {setup && <p className="mt-1 text-xs text-subtle">+ {formatCurrency(setup, currency)} one-time setup</p>}
                </>
              ) : (
                <>
                  <span className="text-4xl font-semibold tracking-tight text-gradient">Custom</span>
                  <p className="mt-1 text-xs text-subtle">Tailored scope, SLA & pricing</p>
                </>
              )}
            </div>
            <p className="mt-4 rounded-xl bg-white/5 px-3 py-2 text-xs text-muted">Best for: {p.bestFor}</p>
            <Button
              className="mt-6 w-full"
              variant={p.highlighted ? "gradient" : p.badge ? "primary" : "secondary"}
              size="lg"
              onClick={() => openBooking(p.id === "automation-pro" ? "automation" : "consultation")}
            >
              {p.cta}
            </Button>
            <div className="mt-7 flex flex-col gap-5 text-sm">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">Features</p>
                <ul className="flex flex-col gap-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-foreground/90">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">Deliverables</p>
                <ul className="flex flex-col gap-2">
                  {p.deliverables.map((f) => (
                    <li key={f} className="flex gap-2.5 text-muted">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-subtle">Support</p>
                <p className="text-muted">{p.support}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ComparisonTable() {
  return (
    <div className="glass overflow-x-auto rounded-3xl" data-lenis-prevent>
      <table className="w-full min-w-[720px] text-left text-sm">
        <caption className="sr-only">Plan comparison</caption>
        <thead>
          <tr className="border-b border-white/10">
            <th scope="col" className="p-5 font-medium text-muted">Feature</th>
            {plans.map((p) => (
              <th key={p.id} scope="col" className={cn("p-5 font-semibold", p.highlighted ? "text-primary" : "text-foreground")}>
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pricingComparison.map((row) => (
            <tr key={row.feature} className="border-b border-white/5 last:border-0">
              <th scope="row" className="p-5 font-normal text-foreground/90">{row.feature}</th>
              {row.values.map((v, i) => (
                <td key={i} className={cn("p-5", i === 3 && "bg-primary/[0.04]")}>
                  {v === true ? <Check className="size-4 text-accent" aria-label="Included" /> : v === false ? <X className="size-4 text-subtle" aria-label="Not included" /> : <span className="text-muted">{v}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
