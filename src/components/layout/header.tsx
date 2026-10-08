"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { mainNav } from "@/lib/navigation";
import { site } from "@/lib/site";
import { useUI } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { openBooking, mobileNavOpen, setMobileNav } = useUI();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileNav(false);
  }, [pathname, setMobileNav]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
  }, [mobileNavOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto mt-3 flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-6",
          scrolled ? "glass-strong mx-3 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] md:mx-auto" : "mx-3 border border-transparent md:mx-auto",
        )}
      >
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpenMenu(null)}>
          {mainNav.map((group) => {
            const active = group.href ? pathname === group.href || pathname.startsWith(group.href + "/") : false;
            if (!group.items) {
              return (
                <Link
                  key={group.label}
                  href={group.href!}
                  className={cn("rounded-full px-4 py-2 text-sm transition-colors hover:text-foreground", active ? "text-foreground" : "text-muted")}
                >
                  {group.label}
                </Link>
              );
            }
            const isOpen = openMenu === group.label;
            return (
              <div key={group.label} className="relative" onMouseEnter={() => setOpenMenu(group.label)}>
                <button
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(isOpen ? null : group.label)}
                  className={cn("flex items-center gap-1 rounded-full px-4 py-2 text-sm transition-colors hover:text-foreground", isOpen || active ? "text-foreground" : "text-muted")}
                >
                  {group.label}
                  <ChevronDown aria-hidden className={cn("size-3.5 transition-transform", isOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3"
                    >
                      <div className="glass-strong grid grid-cols-2 gap-1 rounded-3xl p-3 shadow-2xl">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-white/5"
                          >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                              <Icon name={item.icon ?? "Sparkles"} className="size-5" />
                            </span>
                            <span>
                              <span className="block text-sm font-medium text-foreground">{item.label}</span>
                              <span className="block text-xs leading-snug text-muted">{item.description}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:${site.phoneRaw}`} className="hidden items-center gap-2 px-3 text-sm text-muted transition-colors hover:text-primary xl:flex">
            <Phone aria-hidden className="size-4" /> {site.phone}
          </a>
          <Button size="sm" className="hidden sm:inline-flex" onClick={() => openBooking("consultation")}>
            Book Free Call
          </Button>
          <button
            className="flex size-10 items-center justify-center rounded-full border border-white/10 text-foreground lg:hidden"
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNav(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-0 -z-10 overflow-y-auto bg-background/97 px-5 pb-10 pt-24 backdrop-blur-xl lg:hidden"
            data-lenis-prevent
          >
            <nav aria-label="Mobile" className="flex flex-col gap-6">
              {mainNav.map((group) => (
                <div key={group.label}>
                  {group.href ? (
                    <Link href={group.href} className="text-2xl font-semibold text-foreground">
                      {group.label}
                    </Link>
                  ) : (
                    <p className="text-2xl font-semibold text-foreground">{group.label}</p>
                  )}
                  {group.items && (
                    <div className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl p-2.5 text-muted hover:bg-white/5 hover:text-foreground">
                          <Icon name={item.icon ?? "Sparkles"} className="size-4 text-primary" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <Button size="lg" onClick={() => openBooking("consultation")}>Book Free Strategy Call</Button>
                <Button size="lg" variant="secondary" asChild>
                  <a href={`tel:${site.phoneRaw}`}>
                    <Phone /> Call {site.phone}
                  </a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
