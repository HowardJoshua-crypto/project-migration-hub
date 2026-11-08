// Opportunity lifecycle rules.
import type { Opportunity, Organization } from "./types";
import { opportunitySchema, type OpportunityValues } from "./validation";

export function canPublish(org: Organization | undefined, op: Opportunity, today: string): { ok: true } | { ok: false; reason: string } {
  if (!org || org.verificationStatus !== "VERIFIED") return { ok: false, reason: "Only verified organizations can publish. Complete verification first." };
  if (op.status === "PUBLISHED") return { ok: false, reason: "Already published." };
  if (op.deadline < today) return { ok: false, reason: "The closing date has passed. Edit the dates before publishing." };
  if (!opportunitySchema.safeParse(toFormValues(op)).success) return { ok: false, reason: "Some required details are missing. Edit the opportunity first." };
  return { ok: true };
}

export function canClose(op: Opportunity) {
  return op.status === "PUBLISHED";
}

/** Converts a stored opportunity back into raw form values (for edit forms and re-validation). */
export function toFormValues(op: Opportunity): Record<string, string> {
  return {
    source: op.source, title: op.title, type: op.type, location: op.location, workArrangement: op.workArrangement,
    openingDate: op.openingDate, deadline: op.deadline, compensation: op.compensation, funding: op.funding ?? "",
    summary: op.summary, description: op.description, skills: op.skills.join(", "), fields: op.fields.join(", "),
    eligibilitySummary: op.eligibility.summary, minEducation: op.eligibility.minEducation ?? "",
    programmes: op.eligibility.programmes.join(", "), locations: op.eligibility.locations.join(", "),
    minExperienceMonths: String(op.eligibility.minExperienceMonths ?? 0),
    publisher: op.publisher ?? "", sourceUrl: op.sourceUrl ?? "", officialApplyUrl: op.officialApplyUrl ?? "",
  };
}

/** Applies validated form values to an opportunity record. External source fields are kept as given. */
export function applyValues(v: OpportunityValues): Omit<Opportunity, "id" | "status" | "orgId" | "orgName" | "createdAt" | "publishedAt" | "closedAt"> {
  const external = v.source === "external";
  return {
    source: v.source, title: v.title, type: v.type, location: v.location, workArrangement: v.workArrangement,
    openingDate: v.openingDate, deadline: v.deadline, compensation: v.compensation, funding: v.funding || undefined,
    summary: v.summary, description: v.description, skills: v.skills, fields: v.fields,
    eligibility: { summary: v.eligibilitySummary, minEducation: v.minEducation || undefined, programmes: v.programmes, locations: v.locations, minExperienceMonths: v.minExperienceMonths || undefined },
    publisher: external ? v.publisher : undefined, sourceUrl: external ? v.sourceUrl : undefined,
    officialApplyUrl: external ? v.officialApplyUrl : undefined, lastVerified: undefined,
  };
}
