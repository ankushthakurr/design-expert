"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { questions, scoreAssessment } from "@/lib/tools/growth-assessment";
import { submitLead } from "@/lib/submit-lead";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { RadarChart } from "@/components/charts/charts";
import { ScoreRing, ScoreBar } from "@/components/charts/score-ring";
import { BookButton } from "@/components/shared/cta-buttons";

export function GrowthAssessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const total = questions.length;
  const q = questions[step];

  const choose = (i: number) => {
    setAnswers((a) => ({ ...a, [q.id]: i }));
    setTimeout(() => {
      if (step < total - 1) setStep((s) => s + 1);
      else setStep(total);
    }, 220);
  };

  const finish = (e: React.FormEvent) => {
    e.preventDefault();
    const result = scoreAssessment(answers);
    if (/^\S+@\S+\.\S+$/.test(email)) submitLead("growth-assessment", { email, overall: result.overall, pillars: result.byPillar }).catch(() => {});
    setDone(true);
    setTimeout(() => document.getElementById("assessment-results")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
  };

  if (done) {
    const r = scoreAssessment(answers);
    return (
      <div id="assessment-results" className="flex scroll-mt-28 flex-col gap-8" aria-live="polite">
        <div className="glass-strong border-gradient grid items-center gap-8 rounded-[2rem] p-6 md:grid-cols-[auto_1fr] md:p-10">
          <ScoreRing score={r.overall} size={160} stroke={12} label="Growth score" />
          <div>
            <p className="text-xs uppercase tracking-wider text-primary">Growth stage</p>
            <h2 className="mt-1 text-3xl font-semibold text-foreground">{r.stage.name}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{r.stage.desc}</p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass flex items-center justify-center rounded-3xl p-6">
            <RadarChart data={r.byPillar.map((p) => ({ label: p.pillar, value: p.score }))} size={340} />
          </div>
          <div className="glass flex flex-col justify-center gap-4 rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground">Score by pillar</h3>
            {r.byPillar.map((p) => (
              <ScoreBar key={p.pillar} label={p.pillar} score={p.score} />
            ))}
          </div>
        </div>
        <div className="glass border-gradient rounded-3xl p-6 md:p-8">
          <h3 className="text-xl font-semibold text-foreground">Your top 3 priorities</h3>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {r.recommendations.map((rec, i) => (
              <li key={rec.pillar} className="flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <p className="font-mono text-xs text-primary">
                  0{i + 1} · {rec.pillar} · {rec.score}/100
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">{rec.text}</p>
                <Link href={rec.service.href} className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  Explore {rec.service.label} <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookButton booking="consultation" size="lg">Discuss my results with Pankaj</BookButton>
            <Button variant="secondary" size="lg" onClick={reset}>
              <RotateCcw /> Retake assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-strong border-gradient mx-auto max-w-3xl rounded-[2rem] p-6 md:p-10">
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-muted">
          <span>{step < total ? `Question ${step + 1} of ${total}` : "Almost done"}</span>
          <span>{step < total ? q.pillar : "Results"}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/8" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.min(step, total)} aria-label="Assessment progress">
          <div className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500" style={{ width: `${(Math.min(step, total) / total) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step < total ? (
          <motion.fieldset key={q.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
            <legend className="text-xl font-semibold text-foreground md:text-2xl">{q.q}</legend>
            <div className="mt-6 grid gap-3">
              {q.options.map((o, i) => {
                const on = answers[q.id] === i;
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => choose(i)}
                    aria-pressed={on}
                    className={cn("flex items-center gap-4 rounded-2xl border px-5 py-4 text-left text-sm transition-colors md:text-base", on ? "border-primary bg-primary/10 text-foreground" : "border-white/10 bg-white/[0.02] text-foreground/85 hover:border-primary/40")}
                  >
                    <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs", on ? "border-primary text-primary" : "border-white/15 text-muted")}>{String.fromCharCode(65 + i)}</span>
                    {o}
                  </button>
                );
              })}
            </div>
          </motion.fieldset>
        ) : (
          <motion.form key="email" onSubmit={finish} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-foreground md:text-2xl">Your growth score is ready</h2>
            <p className="text-muted">Add your email if you&apos;d like a copy of your results and personalised recommendations. It&apos;s optional.</p>
            <div>
              <Label htmlFor="ga-email">Email (optional)</Label>
              <Input id="ga-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
            </div>
            <Button type="submit" variant="gradient" size="lg">
              See my results <ArrowRight />
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {step > 0 && (
        <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Back
        </button>
      )}
    </div>
  );
}
