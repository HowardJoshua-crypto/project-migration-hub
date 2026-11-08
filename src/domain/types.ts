// Core domain types for SkillBridge. Shared by fixtures, services and screens.
// Phase 4 maps these to database rows; keep them plain and serialisable.

export const OPPORTUNITY_TYPES = [
  "Employment",
  "Graduate trainee programme",
  "Internship",
  "Industrial placement",
  "Apprenticeship",
  "Freelance project",
  "Contract work",
  "Fellowship",
  "Scholarship",
  "International exchange",
  "Innovation competition",
  "Leadership programme",
  "Volunteering",
] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

/** internal = posted by an organization on SkillBridge; external = sourced from an official website. */
export type OpportunitySource = "internal" | "external";
export type OpportunityStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export const WORK_ARRANGEMENTS = ["On-site", "Hybrid", "Remote"] as const;
export type WorkArrangement = (typeof WORK_ARRANGEMENTS)[number];

export const EDUCATION_LEVELS = ["Certificate", "Diploma", "Bachelor's", "Master's", "PhD"] as const;
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export interface Eligibility {
  summary: string;
  minEducation?: EducationLevel | undefined;
  /** Academic programmes accepted, e.g. "Computer Science". Empty = any programme. */
  programmes: string[];
  /** Districts/towns where applicants must live. Empty = anywhere. */
  locations: string[];
  minExperienceMonths?: number | undefined;
}

export interface Opportunity {
  id: string;
  source: OpportunitySource;
  status: OpportunityStatus;
  title: string;
  type: OpportunityType;
  orgId?: string | undefined;
  orgName: string;
  location: string;
  workArrangement: WorkArrangement;
  openingDate: string;
  deadline: string;
  compensation: string;
  funding?: string | undefined;
  summary: string;
  description: string;
  skills: string[];
  /** Career fields used for interest matching, e.g. "Data", "Software". */
  fields: string[];
  eligibility: Eligibility;
  // External only — must always be retained
  publisher?: string | undefined;
  sourceUrl?: string | undefined;
  officialApplyUrl?: string | undefined;
  lastVerified?: string | undefined;
  createdAt: string;
  publishedAt?: string | undefined;
  closedAt?: string | undefined;
}

export const SECTION_KEYS = ["about", "education", "experience", "skills", "credentials", "portfolio", "documents", "contact"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];
export type Visibility = "PUBLIC" | "SHARED_ONLY" | "PRIVATE";
/** Sections that may never be made public. */
export const NEVER_PUBLIC: ReadonlySet<SectionKey> = new Set<SectionKey>(["contact", "documents"]);
/** Sections a talent can choose to include in an application. */
export const SHAREABLE_SECTIONS = ["about", "education", "experience", "skills", "credentials", "portfolio", "contact"] as const;
export type ShareableSection = (typeof SHAREABLE_SECTIONS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  about: "About", education: "Education", experience: "Experience", skills: "Skills",
  credentials: "Certificates & credentials", portfolio: "Portfolio", documents: "Documents", contact: "Contact details",
};

export interface EducationRecord { id: string; institution: string; award: string; level: EducationLevel; programme: string; startYear: string; endYear: string }
/** Months are "YYYY-MM"; end empty = ongoing. */
export interface ExperienceRecord { id: string; role: string; org: string; start: string; end: string; summary: string }
export interface PortfolioProject { id: string; title: string; summary: string; url: string }
export interface Credential { id: string; title: string; issuer: string; issuedOn: string; status: "pending" | "verified" }

export interface TalentProfile {
  id: string;
  handle: string;
  name: string;
  headline: string;
  location: string;
  about: string;
  careerInterests: string[];
  personal: { email: string; phone: string; district: string; dob: string; nationalId: string };
  education: EducationRecord[];
  experience: ExperienceRecord[];
  skills: string[];
  portfolio: PortfolioProject[];
  credentials: Credential[];
  visibility: Record<SectionKey, Visibility>;
}

export const APPLICATION_STATUSES = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "ACCEPTED", "REJECTED", "WITHDRAWN"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Frozen copy of what the talent chose to share. Later passport edits never change it. */
export interface PassportSnapshot {
  name: string;
  headline: string;
  location: string;
  about?: string | undefined;
  education?: EducationRecord[] | undefined;
  experience?: ExperienceRecord[] | undefined;
  skills?: string[] | undefined;
  credentials?: Credential[] | undefined;
  portfolio?: PortfolioProject[] | undefined;
  contact?: { email: string; phone: string } | undefined;
}

export interface Application {
  id: string;
  opportunityId: string;
  talentId: string;
  status: ApplicationStatus;
  submittedAt: string;
  sharedSections: ShareableSection[];
  snapshot: PassportSnapshot;
  coverNote: string;
  history: { status: ApplicationStatus; at: string; by: "talent" | "employer" }[];
  /** Internal employer notes — never shown to the talent. */
  notes: { text: string; at: string; author: string }[];
}

export interface OutboundClick { id: string; opportunityId: string; talentId: string | null; at: string; url: string }

export interface AppNotification { id: string; talentId: string; title: string; body?: string | undefined; at: string; unread: boolean; link?: { opportunityId?: string; applicationId?: string } | undefined }

export type VerificationStatus = "NOT_SUBMITTED" | "PENDING_REVIEW" | "VERIFIED" | "REJECTED";
export interface Organization {
  id: string;
  name: string;
  type: "Employer" | "NGO" | "University" | "Government";
  sector: string;
  location: string;
  website: string;
  about: string;
  verificationStatus: VerificationStatus;
  verification?: { registrationNumber: string; tin: string; contactName: string; contactEmail: string; documents: string[]; submittedAt: string } | undefined;
}
