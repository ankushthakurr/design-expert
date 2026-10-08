"use client";

import { motion } from "framer-motion";

/** Lightweight SVG charts (no chart library: keeps tool pages fast). */

export function BarChart({
  data,
  format = (v: number) => String(Math.round(v)),
  height = 220,
  label,
}: {
  data: { label: string; value: number; color?: string }[];
  format?: (v: number) => string;
  height?: number;
  label: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <figure aria-label={label} className="w-full">
      <div className="flex items-end gap-3" style={{ height }}>
        {data.map((d, i) => {
          const h = Math.max(2, (d.value / max) * (height - 40));
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs font-medium tabular-nums text-foreground">{format(d.value)}</span>
              <motion.div
                className="w-full max-w-16 rounded-t-xl"
                style={{ background: `linear-gradient(to top, ${d.color ?? "#7B61FF"}55, ${d.color ?? "#00F5FF"})`, boxShadow: `0 0 24px ${d.color ?? "#00F5FF"}40` }}
                initial={{ height: 0 }}
                animate={{ height: h }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-3 border-t border-white/10 pt-2">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[11px] leading-tight text-muted">{d.label}</span>
        ))}
      </div>
      <figcaption className="sr-only">
        {label}: {data.map((d) => `${d.label} ${format(d.value)}`).join(", ")}
      </figcaption>
    </figure>
  );
}

export function DonutChart({ segments, size = 180, centerLabel, centerValue }: { segments: { label: string; value: number; color: string }[]; size?: number; centerLabel?: string; centerValue?: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  const offsets = segments.map((_, i) => segments.slice(0, i).reduce((s, x) => s + (x.value / total) * c, 0));
  return (
    <figure className="flex flex-col items-center gap-4 sm:flex-row" aria-label={`${centerLabel ?? "Breakdown"}: ${segments.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(", ")}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={18} fill="none" />
          {segments.map((s, i) => {
            const len = (s.value / total) * c;
            const el = (
              <motion.circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={s.color}
                strokeWidth={18}
                fill="none"
                strokeDasharray={`${len} ${c - len}`}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: -offsets[i] }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            );
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue && <span className="text-xl font-semibold text-foreground">{centerValue}</span>}
          {centerLabel && <span className="text-[10px] uppercase tracking-wider text-muted">{centerLabel}</span>}
        </div>
      </div>
      <ul className="flex flex-col gap-2 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: s.color }} />
            <span className="text-muted">{s.label}</span>
            <span className="ml-auto pl-3 font-medium tabular-nums text-foreground">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function LineChart({ series, labels, format = (v: number) => String(Math.round(v)), height = 220, label }: { series: { name: string; values: number[]; color: string }[]; labels: string[]; format?: (v: number) => string; height?: number; label: string }) {
  const w = 600;
  const h = height;
  const max = Math.max(...series.flatMap((s) => s.values), 1) * 1.1;
  const n = labels.length;
  const x = (i: number) => (i / (n - 1)) * w;
  const y = (v: number) => h - (v / max) * h;
  return (
    <figure aria-label={label}>
      <svg viewBox={`-4 -8 ${w + 8} ${h + 28}`} className="w-full" aria-hidden>
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={0} x2={w} y1={h - t * h} y2={h - t * h} stroke="rgba(255,255,255,0.06)" />
        ))}
        {series.map((s) => {
          const d = s.values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
          return (
            <g key={s.name}>
              <motion.path d={`${d} L${w},${h} L0,${h} Z`} fill={s.color} opacity={0.08} initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} />
              <motion.path d={d} fill="none" stroke={s.color} strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
            </g>
          );
        })}
        {labels.map((l, i) => (
          <text key={l} x={x(i)} y={h + 20} fontSize="11" fill="#6b7399" textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}>
            {l}
          </text>
        ))}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-xs">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5 text-muted">
            <span className="size-2.5 rounded-full" style={{ background: s.color }} /> {s.name}: <span className="text-foreground">{format(s.values[s.values.length - 1])}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

export function RadarChart({ data, size = 300 }: { data: { label: string; value: number }[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40;
  const n = data.length;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * r * (v / 100), cy + Math.sin(a) * r * (v / 100)];
  };
  const poly = data.map((d, i) => pt(i, d.value).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-sm" role="img" aria-label={`Scores: ${data.map((d) => `${d.label} ${d.value}`).join(", ")}`}>
      {[25, 50, 75, 100].map((lvl) => (
        <polygon key={lvl} points={data.map((_, i) => pt(i, lvl).join(",")).join(" ")} fill="none" stroke="rgba(255,255,255,0.08)" />
      ))}
      {data.map((_, i) => {
        const [x2, y2] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" />;
      })}
      <motion.polygon points={poly} fill="rgba(0,245,255,0.18)" stroke="#00F5FF" strokeWidth={2} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: "center" }} transition={{ duration: 0.8 }} />
      {data.map((d, i) => {
        const [x, y] = pt(i, d.value);
        const [lx, ly] = pt(i, 122);
        return (
          <g key={d.label}>
            <circle cx={x} cy={y} r={4} fill="#00FF9D" />
            <text x={lx} y={ly} fontSize="11" fill="#9aa3c7" textAnchor="middle" dominantBaseline="middle">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
