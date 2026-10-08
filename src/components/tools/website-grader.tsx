"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Gauge, Loader2, Search } from "lucide-react";
import type { AuditReport } from "@/lib/audit/types";
import { industryOptions } from "@/lib/validation";
import { submitLead } from "@/lib/submit-lead";
import { Input, Select, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuditReportView } from "./audit-report-view";

const schema = z.object({
  url: z.string().trim().min(4, "Enter your website address"),
  businessName: z.string().trim().min(2, "Enter your business name"),
  industry: z.string().min(1, "Choose an industry"),
  location: z.string().trim().min(2, "Enter your city"),
  email: z.string().trim().email("Enter a valid email"),
});
type FormValues = z.infer<typeof schema>;

const steps = ["Fetching your homepage…", "Checking SEO & structured data…", "Measuring speed & mobile readiness…", "Reviewing lead capture & trust signals…", "Writing your plain-English report…"];

export function WebsiteGrader() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, setValue, getValues, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { industry: "" } });

  useEffect(() => {
    const u = new URLSearchParams(window.location.search).get("url");
    if (u) setValue("url", u);
  }, [setValue]);

  useEffect(() => {
    if (!isSubmitting) return;
    setStepIdx(0);
    const i = setInterval(() => setStepIdx((s) => Math.min(s + 1, steps.length - 1)), 1600);
    return () => clearInterval(i);
  }, [isSubmitting]);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setReport(null);
    submitLead("website-grader", data).catch(() => {});
    const res = await fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: data.url }) });
    const j = await res.json().catch(() => ({ ok: false, error: "Unexpected error" }));
    if (!j.ok) {
      setError(j.error);
      return;
    }
    setReport(j.report);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* eslint-disable-next-line react-hooks/refs -- react-hook-form handleSubmit only reads refs on submit */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="glass-strong border-gradient grid gap-4 rounded-[2rem] p-6 md:grid-cols-6 md:p-8">
        <div className="md:col-span-6">
          <Label htmlFor="g-url">Website URL</Label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
            <Input id="g-url" inputMode="url" placeholder="yourbusiness.com" className="h-14 pl-11 text-base" aria-invalid={!!errors.url} {...register("url")} />
          </div>
          <FieldError message={errors.url?.message} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="g-biz">Business name</Label>
          <Input id="g-biz" aria-invalid={!!errors.businessName} {...register("businessName")} />
          <FieldError message={errors.businessName?.message} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="g-ind">Industry</Label>
          <Select id="g-ind" aria-invalid={!!errors.industry} {...register("industry")}>
            <option value="" disabled>Choose industry</option>
            {industryOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
          <FieldError message={errors.industry?.message} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="g-loc">Location</Label>
          <Input id="g-loc" placeholder="e.g. New Delhi" aria-invalid={!!errors.location} {...register("location")} />
          <FieldError message={errors.location?.message} />
        </div>
        <div className="md:col-span-4">
          <Label htmlFor="g-email">Email (we&apos;ll send you a copy)</Label>
          <Input id="g-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
        <div className="flex items-end md:col-span-2">
          <Button type="submit" variant="gradient" size="lg" className="h-12 w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Gauge />} {isSubmitting ? "Analysing…" : "Grade my website"}
          </Button>
        </div>
        {isSubmitting && (
          <p className="text-sm text-primary md:col-span-6" aria-live="polite">
            {steps[stepIdx]}
          </p>
        )}
        {error && (
          <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger md:col-span-6">
            {error}
          </p>
        )}
      </form>
      <div ref={resultsRef} className="scroll-mt-28">
        {report && <AuditReportView report={report} businessName={getValues("businessName")} />}
      </div>
    </div>
  );
}
