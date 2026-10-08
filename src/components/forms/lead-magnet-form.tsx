"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Bot, Loader2, Megaphone, Sparkles, Users, Globe } from "lucide-react";
import { leadSchema, industryOptions, type LeadInput } from "@/lib/validation";
import { submitLead } from "@/lib/submit-lead";
import { getPlaybook } from "@/lib/tools/industry-playbooks";
import type { AuditReport } from "@/lib/audit/types";
import { Input, Select, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScoreBar, ScoreRing } from "@/components/charts/score-ring";

type Result = { input: LeadInput; report: AuditReport | null; auditError?: string };

export function LeadMagnetForm({ compact = false }: { compact?: boolean }) {
  const [result, setResult] = useState<Result | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [step, setStep] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({ resolver: zodResolver(leadSchema), defaultValues: { industry: "" } });

  const onSubmit = async (data: LeadInput) => {
    setServerError(null);
    try {
      setStep("Saving your details…");
      await submitLead("instant-ai-automation-audit", data);
      let report: AuditReport | null = null;
      let auditError: string | undefined;
      if (data.website) {
        setStep("Scanning your website…");
        const res = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: data.website }) });
        const j = await res.json();
        if (j.ok) report = j.report;
        else auditError = j.error;
      }
      setResult({ input: data, report, auditError });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setStep(null);
    }
  };

  if (result) return <InstantAuditResult result={result} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="lm-name">Name</Label>
        <Input id="lm-name" autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="lm-email">Email</Label>
        <Input id="lm-email" type="email" autoComplete="email" placeholder="you@business.com" aria-invalid={!!errors.email} {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="lm-phone">Phone / WhatsApp</Label>
        <Input id="lm-phone" type="tel" autoComplete="tel" placeholder="+91 98xxx xxxxx" aria-invalid={!!errors.phone} {...register("phone")} />
        <FieldError message={errors.phone?.message} />
      </div>
      <div>
        <Label htmlFor="lm-business">Business name</Label>
        <Input id="lm-business" autoComplete="organization" placeholder="Business name" aria-invalid={!!errors.businessName} {...register("businessName")} />
        <FieldError message={errors.businessName?.message} />
      </div>
      <div>
        <Label htmlFor="lm-website">Website (optional)</Label>
        <Input id="lm-website" inputMode="url" placeholder="yourbusiness.com" {...register("website")} />
      </div>
      <div>
        <Label htmlFor="lm-industry">Industry</Label>
        <Select id="lm-industry" aria-invalid={!!errors.industry} {...register("industry")}>
          <option value="" disabled>
            Choose your industry
          </option>
          {industryOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
        <FieldError message={errors.industry?.message} />
      </div>
      <div className={compact ? "sm:col-span-2" : "sm:col-span-2"}>
        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> {step ?? "Working…"}
            </>
          ) : (
            <>
              Get My Instant AI Automation Audit <ArrowRight />
            </>
          )}
        </Button>
        {serverError && <p role="alert" className="mt-2 text-sm text-danger">{serverError}</p>}
        <p className="mt-3 text-center text-xs text-subtle">Free. No spam. Your details are only used to send your audit and follow up once.</p>
      </div>
    </form>
  );
}

function InstantAuditResult({ result }: { result: Result }) {
  const { input, report, auditError } = result;
  const pb = getPlaybook(input.industry);
  return (
    <div className="flex flex-col gap-6" aria-live="polite">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Your instant audit is ready</p>
        <h3 className="mt-1 text-2xl font-semibold text-foreground">{input.businessName}: AI Automation Audit</h3>
        <p className="mt-1 text-sm text-muted">We&apos;ve also sent this to our team. Pankaj will follow up personally on WhatsApp within one business day.</p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground"><Globe className="size-4 text-primary" /> Website Audit</h4>
        {report ? (
          <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            <ScoreRing score={report.overall} size={110} label="Overall" />
            <div className="grid gap-3">
              {report.categories.slice(0, 5).map((c) => (
                <ScoreBar key={c.key} label={c.label} score={c.score} />
              ))}
            </div>
            <p className="text-sm text-muted sm:col-span-2">{report.headline}</p>
            <Link href={`/website-grader?url=${encodeURIComponent(input.website ?? "")}`} className="text-sm text-primary underline-offset-4 hover:underline sm:col-span-2">
              View the full website report →
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted">
            {auditError ?? "No website provided."} You can run a full scan any time with our{" "}
            <Link href="/website-grader" className="text-primary underline">Website Grader</Link>.
          </p>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <PlanList icon={<Bot className="size-4" />} title="Automation Roadmap" items={pb.automations.slice(0, 4)} />
        <PlanList icon={<Megaphone className="size-4" />} title="Marketing Recommendations" items={pb.marketing} />
        <PlanList icon={<Users className="size-4" />} title="Lead Generation" items={pb.leadGen} />
      </div>
      <p className="flex items-start gap-2 rounded-2xl border border-secondary/30 bg-secondary/10 p-4 text-sm text-foreground">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-secondary" /> Biggest quick win: {pb.voice}
      </p>
    </div>
  );
}

function PlanList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </h4>
      <ul className="flex flex-col gap-2 text-sm text-muted">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
            {i}
          </li>
        ))}
      </ul>
    </section>
  );
}
