import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { canEmployerSet, canWithdraw } from "@/domain/applications";
import { matchOpportunity, recommend } from "@/domain/matching";
import { buildSnapshot, completeness, publicView, sanitizeVisibility } from "@/domain/passport";
import { opportunitySchema } from "@/domain/validation";
import { toFormValues } from "@/domain/opportunities";
import { seedOpportunities, seedTalent } from "@/mocks/data";

vi.mock("@/services/store", async (orig) => ({ ...(await orig<typeof import("@/services/store")>()), latency: () => Promise.resolve() }));

const { readDb, resetDb } = await import("@/services/store");
const apps = await import("@/services/applications");
const opps = await import("@/services/opportunities");
const passport = await import("@/services/passport");
const extras = await import("@/services/talent-extras");

const op = (id: string) => seedOpportunities.find((o) => o.id === id)!;

beforeAll(() => { vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(new Date("2026-11-08T09:00:00Z")); });
afterAll(() => vi.useRealTimers());
beforeEach(() => { window.localStorage.clear(); resetDb(); });

describe("matching", () => {
  it("explains a 77% match for Amara on the data analyst internship", () => {
    const m = matchOpportunity(seedTalent, op("op-1"));
    expect(m.eligible).toBe(true);
    expect(m.score).toBe(77);
    expect(m.reasons).toContain("You have 1 of 3 skills asked for: SQL");
    expect(m.reasons).toContain("Open to Computer Science students and graduates");
  });
  it("marks location-restricted opportunities as not eligible", () => {
    const m = matchOpportunity(seedTalent, op("op-6"));
    expect(m.eligible).toBe(false);
    expect(m.gaps).toContain("Only open to applicants in Gulu, Amuru");
  });
  it("counts ongoing experience towards the 12-month requirement", () => {
    expect(matchOpportunity(seedTalent, op("op-7")).reasons).toContain("Your 38 months of experience meets the 12 months asked");
  });
  it("never recommends drafts, closed or ineligible opportunities", () => {
    const ids = recommend(seedTalent, seedOpportunities, "2026-11-08").map((r) => r.op.id);
    expect(ids).not.toContain("op-8");
    expect(ids).not.toContain("op-9");
    expect(ids).not.toContain("op-6");
  });
});

describe("application status rules", () => {
  it("lets employers shortlist a submitted application", () => expect(canEmployerSet("SUBMITTED", "SHORTLISTED")).toBe(true));
  it("blocks any change after accepted, rejected or withdrawn", () => {
    expect(canEmployerSet("ACCEPTED", "INTERVIEW")).toBe(false);
    expect(canEmployerSet("REJECTED", "UNDER_REVIEW")).toBe(false);
    expect(canEmployerSet("WITHDRAWN", "SHORTLISTED")).toBe(false);
  });
  it("never lets employers set submitted or withdrawn", () => {
    expect(canEmployerSet("UNDER_REVIEW", "WITHDRAWN")).toBe(false);
    expect(canEmployerSet("UNDER_REVIEW", "SUBMITTED")).toBe(false);
  });
  it("allows withdrawing until a final decision", () => {
    expect(canWithdraw("INTERVIEW")).toBe(true);
    expect(canWithdraw("REJECTED")).toBe(false);
  });
});

describe("passport privacy", () => {
  it("public view hides shared-only credentials and contact details", () => {
    const v = publicView(seedTalent);
    expect(v.credentials).toBeUndefined();
    expect(v.contact).toBeUndefined();
    expect(v.skills).toEqual(seedTalent.skills);
  });
  it("contact details and documents can never be public", () => {
    const v = sanitizeVisibility({ ...seedTalent.visibility, contact: "PUBLIC", documents: "PUBLIC" });
    expect(v.contact).toBe("PRIVATE");
    expect(v.documents).toBe("PRIVATE");
  });
  it("completeness drops to 86% without skills", () => {
    expect(completeness(seedTalent).percent).toBe(100);
    expect(completeness({ ...seedTalent, skills: [] }).percent).toBe(86);
  });
  it("snapshot only contains ticked sections", () => {
    const s = buildSnapshot(seedTalent, ["skills"]);
    expect(s.skills).toEqual(seedTalent.skills);
    expect(s.education).toBeUndefined();
    expect(s.contact).toBeUndefined();
  });
});

describe("opportunity validation", () => {
  it("external opportunities must keep publisher, source and application URLs", () => {
    const r = opportunitySchema.safeParse({ ...toFormValues(op("op-3")), officialApplyUrl: "" });
    expect(r.success).toBe(false);
  });
  it("closing date can't be before opening date", () => {
    const r = opportunitySchema.safeParse({ ...toFormValues(op("op-1")), openingDate: "2026-12-20", deadline: "2026-12-01" });
    expect(r.success).toBe(false);
  });
  it("accepts all 13 seeded opportunities as valid", () => {
    for (const o of seedOpportunities) expect(opportunitySchema.safeParse(toFormValues(o)).success).toBe(true);
  });
});

describe("workflows (browser test-data store)", () => {
  it("submits an internal application once and blocks duplicates", async () => {
    const a = await apps.submitApplication({ opportunityId: "op-12", sections: ["about", "skills"], coverNote: "" });
    expect(a.status).toBe("SUBMITTED");
    await expect(apps.submitApplication({ opportunityId: "op-12", sections: ["about"], coverNote: "" })).rejects.toThrow("already applied");
  });
  it("refuses SkillBridge applications for external opportunities", async () => {
    await expect(apps.submitApplication({ opportunityId: "op-3", sections: ["about"], coverNote: "" })).rejects.toThrow("official website");
  });
  it("records an external click without creating an application", () => {
    const before = readDb().applications.length;
    const click = opps.recordOutboundClick("op-5");
    expect(click.url).toBe("https://yali.state.gov/apply");
    expect(readDb().applications.length).toBe(before);
  });
  it("submitted snapshot doesn't change when the passport is edited later", async () => {
    const a = await apps.submitApplication({ opportunityId: "op-12", sections: ["skills"], coverNote: "" });
    await passport.addSkill("Figma");
    const stored = readDb().applications.find((x) => x.id === a.id)!;
    expect(stored.snapshot.skills).not.toContain("Figma");
  });
  it("employer status change notifies the talent", async () => {
    await apps.setApplicationStatus("pearl-fintech", "ap-7", "SHORTLISTED");
    expect(readDb().notifications.some((n) => n.talentId === "talent-brian" && n.title.includes("Shortlisted"))).toBe(true);
  });
  it("other organizations can't change an application", async () => {
    await expect(apps.setApplicationStatus("nile-harvest", "ap-7", "SHORTLISTED")).rejects.toThrow("not found");
  });
  it("unverified organizations can save drafts but not publish", async () => {
    const draft = await opps.createOpportunity("gulu-health", toFormValues({ ...op("op-6"), deadline: "2026-12-30" }));
    expect(draft.status).toBe("DRAFT");
    await expect(opps.publishOpportunity("gulu-health", draft.id)).rejects.toThrow("verified");
  });
  it("organizations can publish with only the required fields filled", async () => {
    const op = await opps.createOpportunity("pearl-fintech", {
      title: "Marketing Graduate Trainee", type: "Graduate trainee programme", workArrangement: "On-site", location: "Kampala",
      openingDate: "2026-11-08", deadline: "2026-12-31", summary: "Rotate across brand, growth and partnerships for a year.",
      skills: "Marketing, Communication", eligibilitySummary: "Recent graduates.", minEducation: "",
    }, true);
    expect(op.status).toBe("PUBLISHED");
    expect(op.source).toBe("internal");
  });
  it("closed opportunities stop accepting applications", async () => {
    await opps.closeOpportunity("kampala-code-labs", "op-12");
    await expect(apps.submitApplication({ opportunityId: "op-12", sections: ["about"], coverNote: "" })).rejects.toThrow("not accepting");
  });
  it("save and unsave toggles", async () => {
    expect(await extras.toggleSaved("op-7")).toBe(true);
    expect(await extras.toggleSaved("op-7")).toBe(false);
  });
});
