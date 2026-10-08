import { trustStats } from "@/content/testimonials";
import { Counter } from "@/components/shared/counter";
import { Reveal } from "@/components/shared/reveal";

export function TrustStats() {
  return (
    <section aria-label="Results at a glance" className="relative py-10">
      <div className="container-x">
        <Reveal className="glass border-gradient grid grid-cols-2 divide-white/8 rounded-3xl md:grid-cols-4 md:divide-x">
          {trustStats.map((s, i) => (
            <div key={s.label} className={`flex flex-col items-center gap-1 px-4 py-8 text-center ${i < 2 ? "border-b border-white/8 md:border-b-0" : ""} ${i % 2 === 0 ? "border-r border-white/8 md:border-r-0" : ""}`}>
              <span className="text-4xl font-semibold tracking-tight text-gradient md:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className="text-sm text-muted">{s.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
