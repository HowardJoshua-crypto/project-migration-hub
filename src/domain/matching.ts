// Transparent rule-based matching. Every point awarded comes with a human-readable reason,
// so screens can show exactly why something is recommended. No AI involved.
import { EDUCATION_LEVELS, type EducationLevel, type Opportunity, type TalentProfile } from "./types";
import { experienceMonths, highestEducation } from "./passport";

export interface MatchResult {
  score: number; // 0–100
  reasons: string[]; // why it fits
  gaps: string[]; // what doesn't fit (soft)
  eligible: boolean; // false = a hard eligibility rule fails
}

export const MATCH_WEIGHTS = { skills: 35, education: 15, programme: 15, experience: 10, location: 10, interests: 15 } as const;
/** Minimum score for an opportunity to appear under "Recommended for you". */
export const RECOMMEND_THRESHOLD = 40;

const norm = (s: string) => s.trim().toLowerCase();
const levelRank = (l: EducationLevel) => EDUCATION_LEVELS.indexOf(l);

export function matchOpportunity(p: TalentProfile, op: Opportunity): MatchResult {
  const reasons: string[] = [];
  const gaps: string[] = [];
  let score = 0;
  let eligible = true;
  const e = op.eligibility;

  // Skills
  const mine = new Set(p.skills.map(norm));
  const matched = op.skills.filter((s) => mine.has(norm(s)));
  if (op.skills.length) {
    score += Math.round((matched.length / op.skills.length) * MATCH_WEIGHTS.skills);
    if (matched.length) reasons.push(`You have ${matched.length} of ${op.skills.length} skills asked for: ${matched.join(", ")}`);
    const missing = op.skills.filter((s) => !mine.has(norm(s)));
    if (missing.length) gaps.push(`Skills to build: ${missing.join(", ")}`);
  }

  // Education level (hard rule)
  const top = highestEducation(p);
  if (e.minEducation) {
    if (top && levelRank(top) >= levelRank(e.minEducation)) {
      score += MATCH_WEIGHTS.education;
      reasons.push(`Your ${top} meets the ${e.minEducation} requirement`);
    } else {
      eligible = false;
      gaps.push(`Requires at least a ${e.minEducation}`);
    }
  } else {
    score += MATCH_WEIGHTS.education;
  }

  // Academic programme (hard rule when listed)
  if (e.programmes.length) {
    const progs = p.education.map((x) => norm(x.programme));
    const hit = e.programmes.find((req) => progs.some((mp) => mp.includes(norm(req)) || norm(req).includes(mp)));
    if (hit) {
      score += MATCH_WEIGHTS.programme;
      reasons.push(`Open to ${hit} students and graduates`);
    } else {
      eligible = false;
      gaps.push(`Open to: ${e.programmes.join(", ")}`);
    }
  } else {
    score += MATCH_WEIGHTS.programme;
  }

  // Experience (soft)
  const months = experienceMonths(p);
  const need = e.minExperienceMonths ?? 0;
  if (need > 0) {
    if (months >= need) {
      score += MATCH_WEIGHTS.experience;
      reasons.push(`Your ${months} months of experience meets the ${need} months asked`);
    } else {
      gaps.push(`Asks for ${need} months of experience (you have ${months})`);
    }
  } else {
    score += MATCH_WEIGHTS.experience;
  }

  // Location (hard rule when restricted to districts)
  if (e.locations.length && !e.locations.some((l) => norm(l) === norm(p.location))) {
    eligible = false;
    gaps.push(`Only open to applicants in ${e.locations.join(", ")}`);
  } else if (op.workArrangement === "Remote") {
    score += MATCH_WEIGHTS.location;
    reasons.push("Remote — you can work from anywhere");
  } else if (norm(op.location).includes(norm(p.location))) {
    score += MATCH_WEIGHTS.location;
    reasons.push(`Based in ${p.location}, where you live`);
  } else {
    gaps.push(`Based in ${op.location}`);
  }

  // Career interests
  const interests = new Set(p.careerInterests.map(norm));
  const fieldHit = op.fields.filter((f) => interests.has(norm(f)));
  if (fieldHit.length) {
    score += MATCH_WEIGHTS.interests;
    reasons.push(`Matches your interest in ${fieldHit.join(", ")}`);
  }

  return { score: Math.min(100, score), reasons, gaps, eligible };
}

export function isOpenForApplications(op: Opportunity, today: string): boolean {
  return op.status === "PUBLISHED" && op.deadline >= today && op.openingDate <= today;
}

/** Eligible, open opportunities scoring at least the threshold, best first. */
export function recommend(p: TalentProfile, ops: Opportunity[], today: string) {
  return ops
    .filter((o) => isOpenForApplications(o, today))
    .map((op) => ({ op, match: matchOpportunity(p, op) }))
    .filter((r) => r.match.eligible && r.match.score >= RECOMMEND_THRESHOLD)
    .sort((a, b) => b.match.score - a.match.score);
}
