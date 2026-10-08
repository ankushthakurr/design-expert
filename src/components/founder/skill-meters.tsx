"use client";

import { motion, useReducedMotion } from "framer-motion";
import { founderSkills } from "@/content/founder";

export function SkillMeters() {
  const reduce = useReducedMotion();
  return (
    <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
      {founderSkills.map((s, i) => (
        <li key={s.label}>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-medium text-foreground">{s.label}</span>
            <span className="font-mono text-sm text-primary tabular-nums">{s.value}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/8" role="progressbar" aria-valuenow={s.value} aria-valuemin={0} aria-valuemax={100} aria-label={s.label}>
            <motion.div
              className="relative h-full rounded-full bg-[linear-gradient(90deg,#7B61FF,#00F5FF,#00FF9D)]"
              initial={{ width: reduce ? `${s.value}%` : 0 }}
              whileInView={{ width: `${s.value}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="absolute right-0 top-1/2 size-3.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-background bg-accent shadow-[0_0_12px_#00FF9D]" />
            </motion.div>
          </div>
        </li>
      ))}
    </ul>
  );
}
