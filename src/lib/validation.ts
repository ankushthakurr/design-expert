import { z } from "zod";

export const industryOptions = [
  "Dental Clinic",
  "Medical Clinic",
  "Restaurant",
  "Roofing Company",
  "Contractor",
  "Real Estate Agency",
  "Law Firm",
  "Gym / Fitness",
  "Consultant",
  "Coach",
  "Local Business",
  "Ecommerce",
  "Service Business",
  "Startup",
  "Other",
] as const;

const phoneRegex = /^[+()\-\s\d]{7,20}$/;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().regex(phoneRegex, "Please enter a valid phone number"),
  businessName: z.string().trim().min(2, "Please enter your business name").max(120),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  industry: z.string().min(1, "Please choose your industry"),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().regex(phoneRegex, "Please enter a valid phone number"),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().min(1, "Please choose a service"),
  budget: z.string().optional(),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(2000),
});
export type ContactInput = z.infer<typeof contactSchema>;

/** Server-side envelope for every lead sent to the CRM webhook. */
export const leadEnvelopeSchema = z.object({
  source: z.string().min(1).max(60),
  data: z.record(z.string(), z.unknown()),
  page: z.string().max(300).optional(),
  // honeypot: must stay empty
  company_website: z.string().max(0).optional(),
});
