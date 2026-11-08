// Service interface for opportunities. Phase 2 reads from src/mocks; Phase 3/4 swaps
// these bodies for Lovable Cloud queries without changing the calling screens.
import { queryOptions } from "@tanstack/react-query";
import { opportunities, type Opportunity } from "@/mocks/data";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export interface OpportunityFilters { q?: string | undefined; type?: string | undefined; kind?: string | undefined }

export async function listOpportunities(f: OpportunityFilters = {}): Promise<Opportunity[]> {
  await delay();
  const q = f.q?.toLowerCase().trim();
  return opportunities.filter((o) =>
    (!q || [o.title, o.orgName, o.location, ...o.skills].join(" ").toLowerCase().includes(q)) &&
    (!f.type || o.type === f.type) &&
    (!f.kind || o.kind === f.kind),
  );
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  await delay(200);
  return opportunities.find((o) => o.id === id) ?? null;
}

export const opportunitiesQuery = (f: OpportunityFilters) =>
  queryOptions({ queryKey: ["opportunities", f], queryFn: () => listOpportunities(f) });
export const opportunityQuery = (id: string) =>
  queryOptions({ queryKey: ["opportunity", id], queryFn: () => getOpportunity(id) });
