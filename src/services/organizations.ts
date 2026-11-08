// Organization profile and verification submission.
import { queryOptions } from "@tanstack/react-query";
import type { Organization } from "@/domain/types";
import { fieldErrors, orgProfileSchema, verificationSchema } from "@/domain/validation";
import { latency, nowIso, readDb, ServiceError, writeDb } from "./store";

export async function getOrganization(orgId: string): Promise<Organization | null> {
  await latency(80);
  return readDb().organizations.find((o) => o.id === orgId) ?? null;
}

export async function updateOrganization(orgId: string, raw: unknown) {
  await latency();
  const r = orgProfileSchema.safeParse(raw);
  if (!r.success) throw new ServiceError("Please fix the highlighted fields.", fieldErrors(r.error));
  return writeDb((db) => {
    const org = db.organizations.find((o) => o.id === orgId);
    if (!org) throw new ServiceError("Organization not found.");
    Object.assign(org, r.data);
    // Keep the organization name on its opportunities in sync.
    for (const op of db.opportunities) if (op.orgId === orgId) op.orgName = org.name;
    return org;
  });
}

/** Sends verification details for admin review. Already-verified organizations can't resubmit. */
export async function submitVerification(orgId: string, raw: unknown) {
  await latency(300);
  const r = verificationSchema.safeParse(raw);
  if (!r.success) throw new ServiceError("Please fix the highlighted fields.", fieldErrors(r.error));
  return writeDb((db) => {
    const org = db.organizations.find((o) => o.id === orgId);
    if (!org) throw new ServiceError("Organization not found.");
    if (org.verificationStatus === "VERIFIED") throw new ServiceError("This organization is already verified.");
    org.verification = { ...r.data, submittedAt: nowIso().slice(0, 10) };
    org.verificationStatus = "PENDING_REVIEW";
    return org;
  });
}

export const organizationQuery = (orgId: string) => queryOptions({ queryKey: ["organization", orgId], queryFn: () => getOrganization(orgId) });
