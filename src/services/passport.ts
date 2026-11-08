// Talent passport service (current demo talent: Amara). Phase 4: Lovable Cloud tables + auth user.
import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";
import { publicView, sanitizeVisibility } from "@/domain/passport";
import type { Credential, EducationRecord, ExperienceRecord, PortfolioProject, SectionKey, TalentProfile, Visibility } from "@/domain/types";
import {
  credentialSchema, educationSchema, experienceSchema, fieldErrors, personalSchema, portfolioSchema, profileSchema, skillSchema,
} from "@/domain/validation";
import { CURRENT_TALENT_ID } from "@/mocks/data";
import { latency, newId, readDb, ServiceError, todayIso, writeDb } from "./store";

function parse<S extends z.ZodTypeAny>(schema: S, raw: unknown): z.output<S> {
  const r = schema.safeParse(raw);
  if (!r.success) throw new ServiceError("Please fix the highlighted fields.", fieldErrors(r.error));
  return r.data as z.output<S>;
}

function mutate<T>(fn: (p: TalentProfile) => T): T {
  return writeDb((db) => {
    const p = db.talents.find((t) => t.id === CURRENT_TALENT_ID);
    if (!p) throw new ServiceError("Passport not found.");
    return fn(p);
  });
}

export async function getMyPassport(): Promise<TalentProfile> {
  await latency(100);
  const p = readDb().talents.find((t) => t.id === CURRENT_TALENT_ID);
  if (!p) throw new ServiceError("Passport not found.");
  return p;
}

export async function getPublicPassport(handle: string) {
  await latency(100);
  const p = readDb().talents.find((t) => t.handle === handle);
  return p ? publicView(p) : null;
}

export async function updateProfile(raw: unknown) {
  await latency();
  const v = parse(profileSchema, raw);
  return mutate((p) => Object.assign(p, v));
}

export async function updatePersonal(raw: unknown) {
  await latency();
  const v = parse(personalSchema, raw);
  return mutate((p) => { p.personal = v; return p; });
}

function upsert<T extends { id: string }>(list: T[], item: Omit<T, "id">, id: string | undefined, prefix: string): T {
  if (id) {
    const i = list.findIndex((x) => x.id === id);
    if (i < 0) throw new ServiceError("Record not found.");
    list[i] = { ...item, id } as T;
    return list[i];
  }
  const created = { ...item, id: newId(prefix) } as T;
  list.push(created);
  return created;
}

export async function saveEducation(raw: unknown, id?: string) {
  await latency();
  const v = parse(educationSchema, raw);
  return mutate((p) => upsert<EducationRecord>(p.education, v, id, "ed"));
}
export async function saveExperience(raw: unknown, id?: string) {
  await latency();
  const v = parse(experienceSchema, raw);
  return mutate((p) => upsert<ExperienceRecord>(p.experience, v, id, "ex"));
}
export async function savePortfolio(raw: unknown, id?: string) {
  await latency();
  const v = parse(portfolioSchema, raw);
  return mutate((p) => upsert<PortfolioProject>(p.portfolio, v, id, "pf"));
}
/** New certificates always start as pending — verification is done by the issuer/admins. */
export async function addCredential(raw: unknown) {
  await latency();
  const v = parse(credentialSchema, raw);
  if (v.issuedOn > todayIso()) throw new ServiceError("Please fix the highlighted fields.", { issuedOn: "Issue date can't be in the future." });
  return mutate((p) => upsert<Credential>(p.credentials, { ...v, status: "pending" }, undefined, "cr"));
}

export type ListSection = "education" | "experience" | "portfolio" | "credentials";
export async function removeItem(section: ListSection, id: string) {
  await latency();
  return mutate((p) => {
    const list = p[section] as { id: string }[];
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) list.splice(i, 1);
  });
}

export async function addSkill(raw: string) {
  await latency(80);
  const v = parse(skillSchema, raw);
  return mutate((p) => {
    if (p.skills.some((s) => s.toLowerCase() === v.toLowerCase())) throw new ServiceError(`"${v}" is already in your skills.`);
    if (p.skills.length >= 30) throw new ServiceError("You can list up to 30 skills.");
    p.skills.push(v);
  });
}
export async function removeSkill(skill: string) {
  await latency(80);
  return mutate((p) => { p.skills = p.skills.filter((s) => s !== skill); });
}

export async function setVisibility(v: Record<SectionKey, Visibility>) {
  await latency();
  return mutate((p) => { p.visibility = sanitizeVisibility(v); return p.visibility; });
}

export const myPassportQuery = () => queryOptions({ queryKey: ["my-passport"], queryFn: getMyPassport });
export const publicPassportQuery = (handle: string) => queryOptions({ queryKey: ["public-passport", handle], queryFn: () => getPublicPassport(handle) });
