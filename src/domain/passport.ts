// Pure passport rules: completeness, privacy filtering and application snapshots.
import {
  EDUCATION_LEVELS, NEVER_PUBLIC, SECTION_KEYS,
  type EducationLevel, type PassportSnapshot, type SectionKey, type ShareableSection, type TalentProfile, type Visibility,
} from "./types";

export function highestEducation(p: TalentProfile): EducationLevel | undefined {
  let best = -1;
  for (const e of p.education) best = Math.max(best, EDUCATION_LEVELS.indexOf(e.level));
  return best >= 0 ? EDUCATION_LEVELS[best] : undefined;
}

const monthIndex = (ym: string) => { const [y, m] = ym.split("-").map(Number); return (y ?? 0) * 12 + ((m ?? 1) - 1); };

/** Total months across experience records. Ongoing roles count up to `now` ("YYYY-MM"). */
export function experienceMonths(p: TalentProfile, now = "2026-11"): number {
  return p.experience.reduce((sum, x) => {
    if (!x.start) return sum;
    const end = x.end || now;
    return sum + Math.max(0, monthIndex(end) - monthIndex(x.start) + 1);
  }, 0);
}

export const COMPLETENESS_CHECKS: { label: string; done: (p: TalentProfile) => boolean }[] = [
  { label: "Add a headline and summary", done: (p) => p.headline.trim().length > 0 && p.about.trim().length >= 30 },
  { label: "Add your education", done: (p) => p.education.length > 0 },
  { label: "Add at least 5 skills", done: (p) => p.skills.length >= 5 },
  { label: "Add work or volunteer experience", done: (p) => p.experience.length > 0 },
  { label: "Add a portfolio project", done: (p) => p.portfolio.length > 0 },
  { label: "Add a certificate or credential", done: (p) => p.credentials.length > 0 },
  { label: "Choose your career interests", done: (p) => p.careerInterests.length > 0 },
];

export function completeness(p: TalentProfile) {
  const missing = COMPLETENESS_CHECKS.filter((c) => !c.done(p)).map((c) => c.label);
  const percent = Math.round(((COMPLETENESS_CHECKS.length - missing.length) / COMPLETENESS_CHECKS.length) * 100);
  return { percent, missing };
}

/** Enforces that contact details and documents can never be public. */
export function sanitizeVisibility(v: Record<SectionKey, Visibility>): Record<SectionKey, Visibility> {
  const out = { ...v };
  for (const k of SECTION_KEYS) if (NEVER_PUBLIC.has(k) && out[k] === "PUBLIC") out[k] = "PRIVATE";
  return out;
}

/** What anyone on the internet may see: only PUBLIC sections, never contact details. */
export function publicView(p: TalentProfile): PassportSnapshot {
  const v = sanitizeVisibility(p.visibility);
  const pub = (k: SectionKey) => v[k] === "PUBLIC";
  return {
    name: p.name, headline: p.headline, location: p.location,
    about: pub("about") ? p.about : undefined,
    education: pub("education") ? p.education : undefined,
    experience: pub("experience") ? p.experience : undefined,
    skills: pub("skills") ? p.skills : undefined,
    credentials: pub("credentials") ? p.credentials : undefined,
    portfolio: pub("portfolio") ? p.portfolio : undefined,
  };
}

/** Frozen copy of exactly the sections the talent ticked for one application. */
export function buildSnapshot(p: TalentProfile, sections: ShareableSection[]): PassportSnapshot {
  const has = (k: ShareableSection) => sections.includes(k);
  const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
  return {
    name: p.name, headline: p.headline, location: p.location,
    about: has("about") ? p.about : undefined,
    education: has("education") ? clone(p.education) : undefined,
    experience: has("experience") ? clone(p.experience) : undefined,
    skills: has("skills") ? [...p.skills] : undefined,
    credentials: has("credentials") ? clone(p.credentials) : undefined,
    portfolio: has("portfolio") ? clone(p.portfolio) : undefined,
    contact: has("contact") ? { email: p.personal.email, phone: p.personal.phone } : undefined,
  };
}
