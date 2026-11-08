// LOCAL TEST-DATA STORE (Phase 3).
// Holds every record the services read and write, seeded from src/mocks/data.ts and saved to
// this browser's localStorage. It is NOT a database: nothing is shared between devices or
// people, and clearing browser data (or "Reset test data") restores the seed.
// Phase 4 replaces the service bodies with Lovable Cloud queries; screens don't change.
import type { AppNotification, Application, Organization, Opportunity, OutboundClick, TalentProfile } from "@/domain/types";
import {
  seedApplications, seedClicks, seedNotifications, seedOpportunities, seedOrganizations, seedSavedIds, seedTalent, CURRENT_TALENT_ID,
} from "@/mocks/data";

export interface DbState {
  version: 1;
  opportunities: Opportunity[];
  organizations: Organization[];
  talents: TalentProfile[];
  applications: Application[];
  clicks: OutboundClick[];
  notifications: AppNotification[];
  saved: Record<string, string[]>;
}

export const STORAGE_KEY = "skillbridge.testdata.v1";

function seed(): DbState {
  return structuredClone({
    version: 1 as const,
    opportunities: seedOpportunities,
    organizations: seedOrganizations,
    talents: [seedTalent],
    applications: seedApplications,
    clicks: seedClicks,
    notifications: seedNotifications,
    saved: { [CURRENT_TALENT_ID]: seedSavedIds },
  });
}

let memory: DbState | null = null;

function load(): DbState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DbState;
    return parsed.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

function persist() {
  if (typeof window === "undefined" || !memory) return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); } catch { /* storage full or blocked: keep in memory */ }
}

export function readDb(): DbState {
  memory ??= load() ?? seed();
  return memory;
}

export function writeDb<T>(fn: (db: DbState) => T): T {
  const db = readDb();
  const result = fn(db);
  persist();
  return result;
}

export function resetDb() {
  memory = seed();
  persist();
}

let counter = 0;
export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}`;
export const nowIso = () => new Date().toISOString();
export const todayIso = () => new Date().toISOString().slice(0, 10);
/** Simulated latency so loading states are visible, like a real network. */
export const latency = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export class ServiceError extends Error {
  constructor(message: string, public fields?: Record<string, string>) { super(message); this.name = "ServiceError"; }
}
