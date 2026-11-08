// Application service: talent submits/withdraws, employer reviews and updates status.
import { queryOptions } from "@tanstack/react-query";
import { canEmployerSet, canWithdraw, STATUS_LABELS } from "@/domain/applications";
import { isOpenForApplications } from "@/domain/matching";
import { buildSnapshot } from "@/domain/passport";
import { SHAREABLE_SECTIONS, type Application, type ApplicationStatus, type ShareableSection } from "@/domain/types";
import { CURRENT_TALENT_ID } from "@/mocks/data";
import { latency, newId, nowIso, readDb, ServiceError, todayIso, writeDb } from "./store";

const withOpp = (a: Application) => {
  const op = readDb().opportunities.find((o) => o.id === a.opportunityId);
  return { ...a, opportunityTitle: op?.title ?? "Removed opportunity", orgName: op?.orgName ?? "", orgId: op?.orgId };
};
export type ApplicationRow = ReturnType<typeof withOpp>;

export async function listMyApplications(): Promise<ApplicationRow[]> {
  await latency();
  return readDb().applications.filter((a) => a.talentId === CURRENT_TALENT_ID).map(withOpp).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

/** The talent's active (not withdrawn) application for an opportunity, if any. */
export async function getMyApplicationFor(opportunityId: string): Promise<Application | null> {
  await latency(80);
  return readDb().applications.find((a) => a.talentId === CURRENT_TALENT_ID && a.opportunityId === opportunityId && a.status !== "WITHDRAWN") ?? null;
}

export async function submitApplication(input: { opportunityId: string; sections: ShareableSection[]; coverNote: string }): Promise<Application> {
  await latency(300);
  const sections = input.sections.filter((s) => (SHAREABLE_SECTIONS as readonly string[]).includes(s));
  if (sections.length === 0) throw new ServiceError("Choose at least one passport section to share.");
  if (input.coverNote.length > 1500) throw new ServiceError("Keep your note under 1500 characters.");
  return writeDb((db) => {
    const op = db.opportunities.find((o) => o.id === input.opportunityId);
    if (!op) throw new ServiceError("Opportunity not found.");
    if (op.source === "external") throw new ServiceError("This opportunity is applied for on its official website, not on SkillBridge.");
    if (!isOpenForApplications(op, todayIso())) throw new ServiceError("This opportunity is not accepting applications.");
    if (db.applications.some((a) => a.talentId === CURRENT_TALENT_ID && a.opportunityId === op.id && a.status !== "WITHDRAWN")) {
      throw new ServiceError("You've already applied to this opportunity.");
    }
    const profile = db.talents.find((t) => t.id === CURRENT_TALENT_ID);
    if (!profile) throw new ServiceError("Passport not found.");
    const at = nowIso();
    const app: Application = {
      id: newId("ap"), opportunityId: op.id, talentId: profile.id, status: "SUBMITTED", submittedAt: at.slice(0, 10),
      sharedSections: sections, snapshot: buildSnapshot(profile, sections), coverNote: input.coverNote.trim(),
      history: [{ status: "SUBMITTED", at, by: "talent" }], notes: [],
    };
    db.applications.push(app);
    db.notifications.push({ id: newId("n"), talentId: profile.id, title: `Application sent to ${op.orgName}`, body: op.title, at, unread: true, link: { applicationId: app.id } });
    return app;
  });
}

export async function withdrawApplication(id: string) {
  await latency();
  return writeDb((db) => {
    const a = db.applications.find((x) => x.id === id && x.talentId === CURRENT_TALENT_ID);
    if (!a) throw new ServiceError("Application not found.");
    if (!canWithdraw(a.status)) throw new ServiceError(`A ${STATUS_LABELS[a.status].toLowerCase()} application can't be withdrawn.`);
    a.status = "WITHDRAWN";
    a.history.push({ status: "WITHDRAWN", at: nowIso(), by: "talent" });
    return a;
  });
}

// ---- Employer side ----

const orgOwns = (orgId: string, a: Application) => readDb().opportunities.some((o) => o.id === a.opportunityId && o.orgId === orgId);

export async function listOrgApplications(orgId: string, opportunityId?: string): Promise<ApplicationRow[]> {
  await latency();
  return readDb().applications
    .filter((a) => orgOwns(orgId, a) && (!opportunityId || a.opportunityId === opportunityId))
    .map(withOpp)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function getOrgApplication(orgId: string, id: string): Promise<ApplicationRow | null> {
  await latency(100);
  const a = readDb().applications.find((x) => x.id === id);
  return a && orgOwns(orgId, a) ? withOpp(a) : null;
}

export async function setApplicationStatus(orgId: string, id: string, status: ApplicationStatus) {
  await latency();
  return writeDb((db) => {
    const a = db.applications.find((x) => x.id === id);
    if (!a || !orgOwns(orgId, a)) throw new ServiceError("Application not found.");
    if (!canEmployerSet(a.status, status)) throw new ServiceError(`Can't change a ${STATUS_LABELS[a.status].toLowerCase()} application to ${STATUS_LABELS[status].toLowerCase()}.`);
    const at = nowIso();
    a.status = status;
    a.history.push({ status, at, by: "employer" });
    const op = db.opportunities.find((o) => o.id === a.opportunityId);
    db.notifications.push({ id: newId("n"), talentId: a.talentId, title: `${op?.orgName ?? "An employer"} moved your application to ${STATUS_LABELS[status]}`, body: op?.title, at, unread: true, link: { applicationId: a.id } });
    return a;
  });
}

export async function addApplicationNote(orgId: string, id: string, text: string, author = "Grace Namutebi") {
  await latency();
  const t = text.trim();
  if (t.length < 2) throw new ServiceError("Write a note first.");
  if (t.length > 1000) throw new ServiceError("Keep notes under 1000 characters.");
  return writeDb((db) => {
    const a = db.applications.find((x) => x.id === id);
    if (!a || !orgOwns(orgId, a)) throw new ServiceError("Application not found.");
    a.notes.push({ text: t, at: nowIso(), author });
    return a;
  });
}

export const myApplicationsQuery = () => queryOptions({ queryKey: ["my-applications"], queryFn: listMyApplications });
export const myApplicationForQuery = (opportunityId: string) => queryOptions({ queryKey: ["my-application-for", opportunityId], queryFn: () => getMyApplicationFor(opportunityId) });
export const orgApplicationsQuery = (orgId: string, opportunityId?: string) =>
  queryOptions({ queryKey: ["org-applications", orgId, opportunityId ?? "all"], queryFn: () => listOrgApplications(orgId, opportunityId) });
export const orgApplicationQuery = (orgId: string, id: string) => queryOptions({ queryKey: ["org-application", orgId, id], queryFn: () => getOrgApplication(orgId, id) });
