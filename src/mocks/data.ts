// PHASE 2 MOCK DATA — replaced by Lovable Cloud queries in Phase 3/4.
// Every screen that reads from this file must render <MockBadge />.

export type OpportunityKind = "direct" | "external";
export type OpportunityType = "Internship" | "Graduate job" | "Fellowship" | "Volunteer" | "Apprenticeship" | "Scholarship";

export interface Opportunity {
  id: string;
  kind: OpportunityKind;
  title: string;
  type: OpportunityType;
  orgName: string;
  orgSlug?: string;
  location: string;
  remote: boolean;
  deadline: string;
  compensation: string;
  summary: string;
  skills: string[];
  // external-only
  publisher?: string;
  sourceUrl?: string;
  officialApplyUrl?: string;
  ugandaEligibility?: string;
  lastVerified?: string;
}

export const opportunities: Opportunity[] = [
  { id: "op-1", kind: "direct", title: "Junior Data Analyst Intern", type: "Internship", orgName: "Pearl Fintech", orgSlug: "pearl-fintech", location: "Kampala", remote: false, deadline: "2026-12-15", compensation: "UGX 800,000 / month stipend", summary: "Support the analytics team building dashboards on mobile money transactions.", skills: ["SQL", "Excel", "Power BI"] },
  { id: "op-2", kind: "direct", title: "Graduate Trainee — Agribusiness", type: "Graduate job", orgName: "Nile Harvest Cooperative", orgSlug: "nile-harvest", location: "Jinja", remote: false, deadline: "2026-12-01", compensation: "UGX 1,500,000 / month", summary: "12-month rotation across supply chain, finance and farmer outreach.", skills: ["Agriculture", "Communication", "Logistics"] },
  { id: "op-3", kind: "external", title: "Mastercard Foundation Scholars — Postgraduate", type: "Scholarship", orgName: "Mastercard Foundation", location: "Multiple", remote: false, deadline: "2027-01-20", compensation: "Full tuition + living stipend", summary: "Fully funded postgraduate study for young African leaders.", skills: ["Leadership", "Community service"], publisher: "Mastercard Foundation", sourceUrl: "https://mastercardfdn.org", officialApplyUrl: "https://mastercardfdn.org/apply", ugandaEligibility: "Ugandan citizens under 30 with a first degree", lastVerified: "2026-11-02" },
  { id: "op-4", kind: "direct", title: "Frontend Developer Apprentice", type: "Apprenticeship", orgName: "Kampala Code Labs", orgSlug: "kampala-code-labs", location: "Kampala", remote: true, deadline: "2026-11-30", compensation: "UGX 1,000,000 / month", summary: "Learn React and TypeScript while shipping features for local startups.", skills: ["React", "TypeScript", "Git"] },
  { id: "op-5", kind: "external", title: "YALI Regional Leadership Fellowship", type: "Fellowship", orgName: "YALI East Africa", location: "Nairobi (hybrid)", remote: false, deadline: "2026-12-10", compensation: "Fully funded residential programme", summary: "Leadership training for emerging East African leaders.", skills: ["Leadership", "Public policy"], publisher: "YALI RLC East Africa", sourceUrl: "https://yali.state.gov", officialApplyUrl: "https://yali.state.gov/apply", ugandaEligibility: "Ugandan nationals aged 18–35", lastVerified: "2026-10-28" },
  { id: "op-6", kind: "direct", title: "Community Health Volunteer", type: "Volunteer", orgName: "Gulu Health Alliance", orgSlug: "gulu-health", location: "Gulu", remote: false, deadline: "2026-12-20", compensation: "Transport allowance", summary: "Support outreach clinics in Northern Uganda.", skills: ["Public health", "Luo", "Community engagement"] },
];

export const organizations = [
  { slug: "pearl-fintech", name: "Pearl Fintech", type: "Employer", sector: "Financial services", location: "Kampala", verified: true, about: "Digital payments for Ugandan SMEs." },
  { slug: "nile-harvest", name: "Nile Harvest Cooperative", type: "Employer", sector: "Agribusiness", location: "Jinja", verified: true, about: "Farmer-owned cooperative exporting coffee and maize." },
  { slug: "kampala-code-labs", name: "Kampala Code Labs", type: "Employer", sector: "Technology", location: "Kampala", verified: true, about: "Software studio training the next generation of Ugandan engineers." },
  { slug: "gulu-health", name: "Gulu Health Alliance", type: "NGO", sector: "Health", location: "Gulu", verified: false, about: "Community health programmes across Acholi sub-region." },
  { slug: "makerere", name: "Makerere University Career Office", type: "University", sector: "Education", location: "Kampala", verified: true, about: "Career services for Makerere students and alumni." },
];

export const talent = {
  handle: "amara-n",
  name: "Amara Nakato",
  headline: "BSc Computer Science, Makerere University '26",
  location: "Kampala",
  completeness: 72,
  sections: [
    { key: "about", label: "About", visibility: "PUBLIC" as const },
    { key: "education", label: "Education", visibility: "PUBLIC" as const },
    { key: "skills", label: "Skills", visibility: "PUBLIC" as const },
    { key: "credentials", label: "Credentials", visibility: "SHARED_ONLY" as const },
    { key: "portfolio", label: "Portfolio", visibility: "PUBLIC" as const },
    { key: "documents", label: "Documents", visibility: "PRIVATE" as const },
    { key: "contact", label: "Contact details", visibility: "PRIVATE" as const },
  ],
  about: "Aspiring data engineer passionate about financial inclusion and open data in East Africa.",
  education: [{ school: "Makerere University", award: "BSc Computer Science", years: "2022 – 2026" }],
  skills: ["Python", "SQL", "React", "Data visualisation", "Luganda", "English"],
  credentials: [
    { title: "Google Data Analytics Certificate", issuer: "Coursera", status: "verified" },
    { title: "Academic Transcript", issuer: "Makerere University", status: "pending" },
  ],
  experience: [
    { role: "Data Intern", org: "Uganda Bureau of Statistics", period: "Jun – Aug 2025", summary: "Cleaned census microdata and built district dashboards." },
    { role: "Student Tech Lead", org: "Makerere AI Club", period: "2024 – 2026", summary: "Ran weekly workshops for 60+ members." },
  ],
  personal: { email: "amara@example.ug", phone: "+256 7xx xxx 214", district: "Kampala", nationalId: "CM•••••••••••P", dob: "2003-04-12" },
  savedIds: ["op-1", "op-3", "op-5"],
  portfolio: [
    { title: "Boda Safety Map", summary: "Crowdsourced map of road incidents in Kampala." },
    { title: "Mobile money spend analyser", summary: "Visualises spending from SMS exports." },
  ],
};

export type ApplicationStatus = "submitted" | "screening" | "interview" | "offer" | "hired" | "rejected" | "withdrawn";

export const myApplications = [
  { id: "ap-1", opportunity: "Junior Data Analyst Intern", org: "Pearl Fintech", submitted: "2026-11-01", status: "interview" as ApplicationStatus },
  { id: "ap-2", opportunity: "Frontend Developer Apprentice", org: "Kampala Code Labs", submitted: "2026-10-22", status: "screening" as ApplicationStatus },
  { id: "ap-3", opportunity: "Graduate Trainee — Agribusiness", org: "Nile Harvest Cooperative", submitted: "2026-10-10", status: "rejected" as ApplicationStatus },
];

export const externalClicks = [{ opportunity: "Mastercard Foundation Scholars — Postgraduate", clicked: "2026-11-03" }];

export const applicants = [
  { id: "ap-1", name: "Amara Nakato", school: "Makerere University", submitted: "2026-11-01", status: "interview" as ApplicationStatus },
  { id: "ap-7", name: "Brian Okello", school: "Gulu University", submitted: "2026-11-02", status: "submitted" as ApplicationStatus },
  { id: "ap-8", name: "Sarah Atim", school: "Kyambogo University", submitted: "2026-10-29", status: "screening" as ApplicationStatus },
  { id: "ap-9", name: "Daniel Ssempa", school: "MUST", submitted: "2026-10-27", status: "offer" as ApplicationStatus },
];

export const orgMembers = [
  { name: "Grace Namutebi", email: "grace@pearl.ug", role: "Owner" },
  { name: "Isaac Mugisha", email: "isaac@pearl.ug", role: "Manager" },
  { name: "Ruth Achieng", email: "ruth@pearl.ug", role: "Recruiter" },
  { name: "Peter Kato", email: "peter@pearl.ug", role: "Reviewer" },
  { name: "Joan Auma", email: "joan@pearl.ug", role: "Partner rep" },
];

export const notifications = [
  { id: "n1", title: "Interview invitation from Pearl Fintech", time: "2h ago", unread: true },
  { id: "n2", title: "Your Coursera certificate was verified", time: "1d ago", unread: true },
  { id: "n3", title: "3 new internships match your skills", time: "3d ago", unread: false },
];

export const adminQueues = {
  users: [
    { name: "Amara Nakato", email: "amara@example.ug", roles: ["Talent"], status: "Active" },
    { name: "Grace Namutebi", email: "grace@pearl.ug", roles: ["Employer"], status: "Active" },
    { name: "Moses Wasswa", email: "moses@skillbridge.ug", roles: ["Researcher"], status: "Active" },
    { name: "Unknown Recruiter", email: "jobs@fastcash.biz", roles: ["Employer"], status: "Flagged" },
  ],
  orgs: [
    { name: "Gulu Health Alliance", type: "NGO", submitted: "2026-11-04", status: "Pending verification" },
    { name: "FastCash Jobs Ltd", type: "Employer", submitted: "2026-11-05", status: "Flagged" },
  ],
  externalDrafts: [
    { title: "Aga Khan Foundation Graduate Fellowship", researcher: "Moses Wasswa", lastVerified: "2026-11-06", status: "Awaiting admin approval" },
    { title: "UNDP Uganda Youth Internship", researcher: "Moses Wasswa", lastVerified: "2026-11-05", status: "Draft" },
  ],
  credentials: [
    { talent: "Amara Nakato", credential: "Academic Transcript", issuer: "Makerere University", submitted: "2026-11-02" },
    { talent: "Brian Okello", credential: "CCNA Certificate", issuer: "Cisco", submitted: "2026-11-03" },
  ],
  audit: [
    { actor: "admin@skillbridge.ug", action: "Assigned role Researcher", target: "Moses Wasswa", at: "2026-11-01 09:12" },
    { actor: "admin@skillbridge.ug", action: "Verified organization", target: "Pearl Fintech", at: "2026-10-30 14:40" },
    { actor: "mod@skillbridge.ug", action: "Flagged opportunity", target: "FastCash 'Easy money' post", at: "2026-11-05 17:03" },
  ],
};

export const partnerData = {
  programs: [
    { name: "Makerere Graduate Readiness 2026", cohort: 240, status: "Active" },
    { name: "Digital Skills for Northern Uganda", cohort: 85, status: "Planning" },
  ],
  cohort: [
    { name: "Amara Nakato", program: "Makerere Graduate Readiness 2026", consent: "Granted", expires: "2026-12-01" },
    { name: "Brian Okello", program: "Digital Skills for Northern Uganda", consent: "Granted", expires: "2026-12-08" },
  ],
  verification: [{ talent: "Amara Nakato", credential: "Academic Transcript", requested: "2026-11-02" }],
};
