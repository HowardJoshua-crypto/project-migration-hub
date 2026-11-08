// Opportunity service. Phase 3 reads/writes the browser test-data store; Phase 4 swaps
// these bodies for Lovable Cloud queries without changing the calling screens.
import { queryOptions } from "@tanstack/react-query";
import { canClose, canPublish, applyValues } from "@/domain/opportunities";
import type { Opportunity, OutboundClick } from "@/domain/types";
import { fieldErrors, opportunitySchema } from "@/domain/validation";
import { CURRENT_TALENT_ID } from "@/mocks/data";
import { latency, newId, nowIso, readDb, ServiceError, todayIso, writeDb } from "./store";

export interface OpportunityFilters {
  q?: string | undefined;
  type?: string | undefined;
  source?: string | undefined;
  arrangement?: string | undefined;
  location?: string | undefined;
}

export function filterOpportunities(list: Opportunity[], f: OpportunityFilters): Opportunity[] {
  const q = f.q?.toLowerCase().trim();
  const loc = f.location?.toLowerCase().trim();
  return list.filter((o) =>
    (!q || [o.title, o.orgName, o.location, o.type, o.summary, ...o.skills, ...o.fields].join(" ").toLowerCase().includes(q)) &&
    (!f.type || o.type === f.type) &&
    (!f.source || o.source === f.source) &&
    (!f.arrangement || o.workArrangement === f.arrangement) &&
    (!loc || o.location.toLowerCase().includes(loc)),
  );
}

/** Public listing: published opportunities only, soonest deadline first. */
export async function listOpportunities(f: OpportunityFilters = {}): Promise<Opportunity[]> {
  await latency();
  const published = readDb().opportunities.filter((o) => o.status === "PUBLISHED" && o.deadline >= todayIso());
  return filterOpportunities(published, f).sort((a, b) => a.deadline.localeCompare(b.deadline));
}

/** Public detail: drafts are never visible; closed ones are shown as closed. */
export async function getOpportunity(id: string): Promise<Opportunity | null> {
  await latency(100);
  const op = readDb().opportunities.find((o) => o.id === id);
  return op && op.status !== "DRAFT" ? op : null;
}

export async function listOrgOpportunities(orgId: string) {
  await latency();
  const db = readDb();
  return db.opportunities
    .filter((o) => o.orgId === orgId)
    .map((o) => ({ ...o, applicantCount: db.applications.filter((a) => a.opportunityId === o.id && a.status !== "WITHDRAWN").length }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrgOpportunity(orgId: string, id: string): Promise<Opportunity | null> {
  await latency(100);
  return readDb().opportunities.find((o) => o.id === id && o.orgId === orgId) ?? null;
}

function parse(raw: unknown) {
  const r = opportunitySchema.safeParse(raw);
  if (!r.success) throw new ServiceError("Please fix the highlighted fields.", fieldErrors(r.error));
  return r.data;
}

export async function createOpportunity(orgId: string, raw: unknown, publish = false): Promise<Opportunity> {
  await latency();
  const v = parse({ ...(raw as object), source: "internal" });
  return writeDb((db) => {
    const org = db.organizations.find((o) => o.id === orgId);
    if (!org) throw new ServiceError("Organization not found.");
    const op: Opportunity = { ...applyValues(v), id: newId("op"), status: "DRAFT", orgId, orgName: org.name, createdAt: nowIso() };
    if (publish) {
      const check = canPublish(org, op, todayIso());
      if (!check.ok) throw new ServiceError(check.reason);
      op.status = "PUBLISHED";
      op.publishedAt = nowIso();
    }
    db.opportunities.push(op);
    return op;
  });
}

export async function updateOpportunity(orgId: string, id: string, raw: unknown): Promise<Opportunity> {
  await latency();
  const v = parse({ ...(raw as object), source: "internal" });
  return writeDb((db) => {
    const i = db.opportunities.findIndex((o) => o.id === id && o.orgId === orgId);
    const existing = db.opportunities[i];
    if (!existing) throw new ServiceError("Opportunity not found.");
    const next: Opportunity = { ...existing, ...applyValues(v) };
    db.opportunities[i] = next;
    return next;
  });
}

export async function publishOpportunity(orgId: string, id: string) {
  await latency();
  return writeDb((db) => {
    const op = db.opportunities.find((o) => o.id === id && o.orgId === orgId);
    if (!op) throw new ServiceError("Opportunity not found.");
    const check = canPublish(db.organizations.find((o) => o.id === orgId), op, todayIso());
    if (!check.ok) throw new ServiceError(check.reason);
    op.status = "PUBLISHED";
    op.publishedAt = nowIso();
    op.closedAt = undefined;
    return op;
  });
}

export async function closeOpportunity(orgId: string, id: string) {
  await latency();
  return writeDb((db) => {
    const op = db.opportunities.find((o) => o.id === id && o.orgId === orgId);
    if (!op) throw new ServiceError("Opportunity not found.");
    if (!canClose(op)) throw new ServiceError("Only published opportunities can be closed.");
    op.status = "CLOSED";
    op.closedAt = nowIso();
    return op;
  });
}

/**
 * Records that someone left SkillBridge for an external application site.
 * This is a visit, never an application — nothing is added to applications.
 */
export function recordOutboundClick(opportunityId: string, talentId: string | null = CURRENT_TALENT_ID): OutboundClick {
  return writeDb((db) => {
    const op = db.opportunities.find((o) => o.id === opportunityId);
    if (!op || op.source !== "external" || !op.officialApplyUrl) throw new ServiceError("This opportunity has no external application link.");
    const click: OutboundClick = { id: newId("cl"), opportunityId, talentId, at: nowIso(), url: op.officialApplyUrl };
    db.clicks.push(click);
    return click;
  });
}

export async function listMyClicks(talentId = CURRENT_TALENT_ID) {
  await latency();
  const db = readDb();
  return db.clicks
    .filter((c) => c.talentId === talentId)
    .map((c) => ({ ...c, opportunity: db.opportunities.find((o) => o.id === c.opportunityId) }))
    .sort((a, b) => b.at.localeCompare(a.at));
}

export const opportunitiesQuery = (f: OpportunityFilters) =>
  queryOptions({ queryKey: ["opportunities", f], queryFn: () => listOpportunities(f) });
export const opportunityQuery = (id: string) =>
  queryOptions({ queryKey: ["opportunity", id], queryFn: () => getOpportunity(id) });
export const orgOpportunitiesQuery = (orgId: string) =>
  queryOptions({ queryKey: ["org-opportunities", orgId], queryFn: () => listOrgOpportunities(orgId) });
export const orgOpportunityQuery = (orgId: string, id: string) =>
  queryOptions({ queryKey: ["org-opportunity", orgId, id], queryFn: () => getOrgOpportunity(orgId, id) });
export const myClicksQuery = () => queryOptions({ queryKey: ["my-clicks"], queryFn: () => listMyClicks() });
