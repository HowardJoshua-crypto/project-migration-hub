// Form validation schemas. The same schemas run again inside the services, so a bypassed
// form can't store invalid data (Phase 4 reuses them on the server).
import { z } from "zod";
import { EDUCATION_LEVELS, OPPORTUNITY_TYPES, WORK_ARRANGEMENTS } from "./types";

const trimmed = (min: number, msg: string, max = 200) => z.string().trim().min(min, msg).max(max, `Keep this under ${max} characters.`);
const optionalUrl = z.string().trim().max(500).refine((v) => v === "" || /^https?:\/\/\S+\.\S+/.test(v), "Enter a full web address starting with https://");
const ym = z.string().regex(/^\d{4}-\d{2}$/, "Choose a month.");
const year = z.string().regex(/^\d{4}$/, "Enter a 4-digit year.");
const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
export const csv = z.string().max(500).transform(list);

export const profileSchema = z.object({
  name: trimmed(2, "Enter your full name.", 100),
  headline: trimmed(3, "Add a short headline.", 120),
  location: trimmed(2, "Enter your town or district.", 60),
  about: z.string().trim().max(1500, "Keep your summary under 1500 characters."),
  careerInterests: csv,
});

export const personalSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().regex(/^\+?[0-9 ]{9,16}$/, "Enter a phone number like +256 772 123 456."),
  district: trimmed(2, "Enter your district.", 60),
  dob: z.string().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Choose a date."),
  nationalId: z.string().trim().max(20),
});

export const educationSchema = z.object({
  institution: trimmed(2, "Enter the school or university."),
  award: trimmed(2, "Enter the award, e.g. BSc Computer Science."),
  level: z.enum(EDUCATION_LEVELS, { errorMap: () => ({ message: "Choose a level." }) }),
  programme: trimmed(2, "Enter the programme or field of study.", 100),
  startYear: year,
  endYear: year,
}).refine((v) => v.endYear >= v.startYear, { path: ["endYear"], message: "End year can't be before start year." });

export const experienceSchema = z.object({
  role: trimmed(2, "Enter your role."),
  org: trimmed(2, "Enter the organization."),
  start: ym,
  end: z.string().refine((v) => v === "" || /^\d{4}-\d{2}$/.test(v), "Choose a month or leave empty if ongoing."),
  summary: z.string().trim().max(600, "Keep this under 600 characters."),
}).refine((v) => v.end === "" || v.end >= v.start, { path: ["end"], message: "End can't be before start." });

export const portfolioSchema = z.object({
  title: trimmed(2, "Give the project a title."),
  summary: trimmed(10, "Describe the project in a sentence or two.", 600),
  url: optionalUrl,
});

export const credentialSchema = z.object({
  title: trimmed(2, "Enter the certificate name."),
  issuer: trimmed(2, "Enter who issued it."),
  issuedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose the issue date."),
});

export const skillSchema = trimmed(1, "Type a skill.", 40);

export const orgProfileSchema = z.object({
  name: trimmed(2, "Enter the organization name.", 120),
  sector: trimmed(2, "Enter your sector.", 80),
  location: trimmed(2, "Enter your head office town.", 80),
  website: optionalUrl,
  about: z.string().trim().min(20, "Describe your organization in at least 20 characters.").max(1500),
});

export const verificationSchema = z.object({
  registrationNumber: z.string().trim().regex(/^[A-Z0-9/-]{5,30}$/i, "Enter the URSB registration number."),
  tin: z.string().trim().regex(/^\d{10}$/, "TIN is 10 digits."),
  contactName: trimmed(2, "Enter the contact person's name.", 100),
  contactEmail: z.string().trim().email("Enter a valid email address."),
  documents: csv.refine((d) => d.length >= 1, "List at least one document you'll upload."),
});

export const opportunitySchema = z.object({
  source: z.enum(["internal", "external"]),
  title: trimmed(4, "Add a clear title (at least 4 characters).", 120),
  type: z.enum(OPPORTUNITY_TYPES, { errorMap: () => ({ message: "Choose a type." }) }),
  location: trimmed(2, "Enter a location.", 80),
  workArrangement: z.enum(WORK_ARRANGEMENTS),
  openingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose an opening date."),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a closing date."),
  compensation: z.string().trim().max(120),
  funding: z.string().trim().max(120),
  summary: trimmed(20, "Write a one-line summary (at least 20 characters).", 240),
  description: z.string().trim().max(4000),
  skills: csv.refine((s) => s.length >= 1, "List at least one skill."),
  fields: csv,
  eligibilitySummary: trimmed(5, "Describe who can apply.", 400),
  minEducation: z.enum(["", ...EDUCATION_LEVELS]),
  programmes: csv,
  locations: csv,
  minExperienceMonths: z.coerce.number().int().min(0, "Can't be negative.").max(240),
  publisher: z.string().trim().max(120),
  sourceUrl: optionalUrl,
  officialApplyUrl: optionalUrl,
}).superRefine((v, ctx) => {
  if (v.deadline < v.openingDate) ctx.addIssue({ code: "custom", path: ["deadline"], message: "Closing date must be on or after the opening date." });
  if (v.source === "external") {
    if (!v.publisher) ctx.addIssue({ code: "custom", path: ["publisher"], message: "External opportunities must name the original publisher." });
    if (!v.sourceUrl) ctx.addIssue({ code: "custom", path: ["sourceUrl"], message: "Add the official source page." });
    if (!v.officialApplyUrl) ctx.addIssue({ code: "custom", path: ["officialApplyUrl"], message: "Add the official application link." });
  }
});
export type OpportunityInput = z.input<typeof opportunitySchema>;
export type OpportunityValues = z.output<typeof opportunitySchema>;

/** Turns a zod error into { field: firstMessage } for inline form errors. */
export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of err.issues) { const k = String(i.path[0] ?? "form"); out[k] ??= i.message; }
  return out;
}
