// Saved opportunities, notifications and recommendations for the current talent.
import { queryOptions } from "@tanstack/react-query";
import { matchOpportunity, recommend } from "@/domain/matching";
import { CURRENT_TALENT_ID } from "@/mocks/data";
import { latency, readDb, ServiceError, todayIso, writeDb } from "./store";

// ---- Saved ----
export async function listSavedIds(): Promise<string[]> {
  await latency(60);
  return readDb().saved[CURRENT_TALENT_ID] ?? [];
}

export async function listSavedOpportunities() {
  await latency();
  const db = readDb();
  const ids = db.saved[CURRENT_TALENT_ID] ?? [];
  return ids.map((id) => db.opportunities.find((o) => o.id === id)).filter((o) => !!o && o.status !== "DRAFT").map((o) => o!);
}

/** Returns true when the opportunity is now saved, false when it was removed. */
export async function toggleSaved(opportunityId: string): Promise<boolean> {
  await latency(80);
  return writeDb((db) => {
    if (!db.opportunities.some((o) => o.id === opportunityId)) throw new ServiceError("Opportunity not found.");
    const list = (db.saved[CURRENT_TALENT_ID] ??= []);
    const i = list.indexOf(opportunityId);
    if (i >= 0) { list.splice(i, 1); return false; }
    list.unshift(opportunityId);
    return true;
  });
}

// ---- Notifications ----
export async function listNotifications() {
  await latency();
  return readDb().notifications.filter((n) => n.talentId === CURRENT_TALENT_ID).sort((a, b) => b.at.localeCompare(a.at));
}
export async function markNotificationRead(id: string) {
  await latency(60);
  writeDb((db) => { const n = db.notifications.find((x) => x.id === id); if (n) n.unread = false; });
}
export async function markAllNotificationsRead() {
  await latency(80);
  writeDb((db) => { for (const n of db.notifications) if (n.talentId === CURRENT_TALENT_ID) n.unread = false; });
}

// ---- Recommendations ----
export async function getRecommendations() {
  await latency();
  const db = readDb();
  const p = db.talents.find((t) => t.id === CURRENT_TALENT_ID);
  return p ? recommend(p, db.opportunities, todayIso()) : [];
}
export async function getMatchFor(opportunityId: string) {
  await latency(60);
  const db = readDb();
  const p = db.talents.find((t) => t.id === CURRENT_TALENT_ID);
  const op = db.opportunities.find((o) => o.id === opportunityId);
  return p && op ? matchOpportunity(p, op) : null;
}

export const savedIdsQuery = () => queryOptions({ queryKey: ["saved-ids"], queryFn: listSavedIds });
export const savedOpportunitiesQuery = () => queryOptions({ queryKey: ["saved-opportunities"], queryFn: listSavedOpportunities });
export const notificationsQuery = () => queryOptions({ queryKey: ["notifications"], queryFn: listNotifications });
export const recommendationsQuery = () => queryOptions({ queryKey: ["recommendations"], queryFn: getRecommendations });
export const matchQuery = (opportunityId: string) => queryOptions({ queryKey: ["match", opportunityId], queryFn: () => getMatchFor(opportunityId) });
