"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { portfolioFilters, projects, type PortfolioFilter } from "@/content/portfolio";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/utils";

export function PortfolioGrid() {
  const [filter, setFilter] = useState<PortfolioFilter>("All");
  const list = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter))), [filter]);
  return (
    <div>
      <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {portfolioFilters.map((f) => {
          const count = f === "All" ? projects.length : projects.filter((p) => p.categories.includes(f as Exclude<PortfolioFilter, "All">)).length;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-all",
                filter === f ? "border-primary bg-primary text-background shadow-glow" : "border-white/10 bg-white/5 text-muted hover:text-foreground",
              )}
            >
              {f} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
      <motion.div layout className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
