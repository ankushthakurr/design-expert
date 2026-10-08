import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { footerNav } from "@/lib/navigation";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "./logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 border-t border-white/8 bg-[linear-gradient(180deg,transparent,rgba(123,97,255,0.06))]">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted">{site.tagline}. Founded by {site.founder.name}, {site.founder.role}.</p>
          <address className="flex flex-col gap-2.5 text-sm not-italic text-muted">
            <a href={`tel:${site.phoneRaw}`} className="flex items-center gap-2.5 hover:text-primary">
              <Phone aria-hidden className="size-4 text-primary" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-primary">
              <Mail aria-hidden className="size-4 text-primary" /> {site.email}
            </a>
            <span className="flex items-center gap-2.5">
              <MapPin aria-hidden className="size-4 text-primary" /> {site.address.locality}, {site.address.countryName}
            </span>
            <span className="flex items-center gap-2.5">
              <Clock aria-hidden className="size-4 text-primary" /> {site.hoursLabel}
            </span>
          </address>
          <a
            href={whatsappLink("I want a Free Consultation")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent hover:bg-accent/20"
          >
            Chat on WhatsApp
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="mb-4 text-sm font-semibold text-foreground">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-subtle md:flex-row">
          <p>© {year} {site.legalName}. All rights reserved. AI systems built to support your team, not replace it.</p>
          <div className="flex gap-5">
            {Object.entries(site.social).map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-primary">
                {k === "x" ? "X" : k}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
