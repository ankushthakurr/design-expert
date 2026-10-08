"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation";
import { submitLead } from "@/lib/submit-lead";
import { whatsappLink } from "@/lib/site";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const services = ["AI Voice Agent / Receptionist", "AI Chatbot", "Automation / CRM", "Website / Landing Page", "Google / Meta Ads", "Branding / Google Business Profile", "Full Growth System", "Not sure yet"];
const budgets = ["Under ₹25,000 / $300", "₹25,000–₹75,000 / $300–$900", "₹75,000–₹2,00,000 / $900–$2,500", "₹2,00,000+ / $2,500+"];

export function ContactForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: { service: "" } });

  const onSubmit = async (data: ContactInput) => {
    setError(null);
    try {
      await submitLead("contact-form", data);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center" role="status">
        <CheckCircle2 className="size-14 text-accent" aria-hidden />
        <h3 className="text-2xl font-semibold text-foreground">Message received!</h3>
        <p className="max-w-md text-muted">Thanks for reaching out. Pankaj or the team will reply within one business day. Need a faster answer?</p>
        <Button variant="accent" asChild>
          <a href={whatsappLink("Hi, I just sent a message through your website.")} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="c-name">Full name *</Label>
        <Input id="c-name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="c-email">Email *</Label>
        <Input id="c-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="c-phone">Phone / WhatsApp *</Label>
        <Input id="c-phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
        <FieldError message={errors.phone?.message} />
      </div>
      <div>
        <Label htmlFor="c-company">Company</Label>
        <Input id="c-company" autoComplete="organization" {...register("company")} />
      </div>
      <div>
        <Label htmlFor="c-service">What do you need? *</Label>
        <Select id="c-service" aria-invalid={!!errors.service} {...register("service")}>
          <option value="" disabled>Choose a service</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <FieldError message={errors.service?.message} />
      </div>
      <div>
        <Label htmlFor="c-budget">Monthly budget</Label>
        <Select id="c-budget" defaultValue="" {...register("budget")}>
          <option value="">Prefer not to say</option>
          {budgets.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="c-message">Tell us about your business and goals *</Label>
        <Textarea id="c-message" rows={5} aria-invalid={!!errors.message} placeholder="e.g. We're a dental clinic missing calls during busy hours and want an AI receptionist + online booking." {...register("message")} />
        <FieldError message={errors.message?.message} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />} Send message
        </Button>
        {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
      </div>
    </form>
  );
}
