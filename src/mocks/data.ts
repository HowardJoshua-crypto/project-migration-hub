// TEST FIXTURES — the starting data for the browser test-data store (src/services/store.ts)
// and the remaining sample-only screens (admin, partner, team, analytics).
// Phase 4 replaces these with real records. Screens reading from here show <MockBadge />.
import type {
  AppNotification, Application, Organization, Opportunity, OutboundClick, PassportSnapshot, TalentProfile,
} from "@/domain/types";

export const CURRENT_TALENT_ID = "talent-amara";

const base = { description: "", funding: undefined, createdAt: "2026-10-01" };
const anyone = { programmes: [] as string[], locations: [] as string[] };

export const seedOpportunities: Opportunity[] = [
  { ...base, id: "op-1", source: "internal", status: "PUBLISHED", title: "Junior Data Analyst Intern", type: "Internship", orgId: "pearl-fintech", orgName: "Pearl Fintech", location: "Kampala", workArrangement: "On-site", openingDate: "2026-10-15", deadline: "2026-12-15", compensation: "UGX 800,000 / month stipend", summary: "Support the analytics team building dashboards on mobile money transactions.", description: "You'll join a team of four analysts, clean transaction data, build Power BI dashboards and present weekly insights to product managers. Six months, starting January 2027.", skills: ["SQL", "Excel", "Power BI"], fields: ["Data", "Finance"], eligibility: { summary: "Final-year students or recent graduates in a quantitative programme.", minEducation: "Diploma", programmes: ["Computer Science", "Statistics", "Economics"], locations: [] }, publishedAt: "2026-10-15" },
  { ...base, id: "op-2", source: "internal", status: "PUBLISHED", title: "Graduate Trainee — Agribusiness", type: "Graduate trainee programme", orgId: "nile-harvest", orgName: "Nile Harvest Cooperative", location: "Jinja", workArrangement: "On-site", openingDate: "2026-10-01", deadline: "2026-12-01", compensation: "UGX 1,500,000 / month", summary: "12-month rotation across supply chain, finance and farmer outreach.", skills: ["Agriculture", "Communication", "Logistics"], fields: ["Agriculture", "Supply chain"], eligibility: { summary: "Graduates from 2024–2026 with a degree in agriculture or business.", minEducation: "Bachelor's", programmes: ["Agriculture", "Agribusiness", "Business"], locations: [] }, publishedAt: "2026-10-01" },
  { ...base, id: "op-3", source: "external", status: "PUBLISHED", title: "Mastercard Foundation Scholars — Postgraduate", type: "Scholarship", orgName: "Mastercard Foundation", location: "Multiple countries", workArrangement: "On-site", openingDate: "2026-09-01", deadline: "2027-01-20", compensation: "Full tuition + living stipend", funding: "Fully funded", summary: "Fully funded postgraduate study for young African leaders.", skills: ["Leadership", "Community service"], fields: ["Leadership", "Education"], eligibility: { summary: "Ugandan citizens under 30 with a first degree.", minEducation: "Bachelor's", ...anyone }, publisher: "Mastercard Foundation", sourceUrl: "https://mastercardfdn.org", officialApplyUrl: "https://mastercardfdn.org/apply", lastVerified: "2026-11-02", publishedAt: "2026-09-05" },
  { ...base, id: "op-4", source: "internal", status: "PUBLISHED", title: "Frontend Developer Apprentice", type: "Apprenticeship", orgId: "kampala-code-labs", orgName: "Kampala Code Labs", location: "Kampala", workArrangement: "Remote", openingDate: "2026-10-10", deadline: "2026-11-30", compensation: "UGX 1,000,000 / month", summary: "Learn React and TypeScript while shipping features for local startups.", skills: ["React", "TypeScript", "Git"], fields: ["Software"], eligibility: { summary: "Anyone with basic HTML/CSS and a portfolio project.", ...anyone }, publishedAt: "2026-10-10" },
  { ...base, id: "op-5", source: "external", status: "PUBLISHED", title: "YALI Regional Leadership Programme", type: "Leadership programme", orgName: "YALI East Africa", location: "Nairobi", workArrangement: "Hybrid", openingDate: "2026-09-15", deadline: "2026-12-10", compensation: "Fully funded residential programme", funding: "Fully funded", summary: "Leadership training for emerging East African leaders.", skills: ["Leadership", "Public policy"], fields: ["Leadership", "Public policy"], eligibility: { summary: "Ugandan nationals aged 18–35 with proven community leadership.", ...anyone }, publisher: "YALI RLC East Africa", sourceUrl: "https://yali.state.gov", officialApplyUrl: "https://yali.state.gov/apply", lastVerified: "2026-10-28", publishedAt: "2026-09-20" },
  { ...base, id: "op-6", source: "internal", status: "PUBLISHED", title: "Community Health Volunteer", type: "Volunteering", orgId: "gulu-health", orgName: "Gulu Health Alliance", location: "Gulu", workArrangement: "On-site", openingDate: "2026-10-20", deadline: "2026-12-20", compensation: "Transport allowance", summary: "Support outreach clinics in Northern Uganda.", skills: ["Public health", "Luo", "Community engagement"], fields: ["Health"], eligibility: { summary: "Residents of Gulu or Amuru district.", programmes: [], locations: ["Gulu", "Amuru"] }, publishedAt: "2026-10-20" },
  { ...base, id: "op-7", source: "internal", status: "PUBLISHED", title: "Junior Backend Engineer", type: "Employment", orgId: "pearl-fintech", orgName: "Pearl Fintech", location: "Kampala", workArrangement: "Hybrid", openingDate: "2026-11-01", deadline: "2027-01-10", compensation: "UGX 3,200,000 / month", summary: "Build and maintain payment APIs used by thousands of Ugandan SMEs.", skills: ["Python", "SQL", "APIs"], fields: ["Software", "Finance"], eligibility: { summary: "Graduates with at least a year of hands-on software experience.", minEducation: "Bachelor's", programmes: ["Computer Science", "Software Engineering", "Information Technology"], locations: [], minExperienceMonths: 12 }, publishedAt: "2026-11-01" },
  { ...base, id: "op-8", source: "internal", status: "DRAFT", title: "Customer Success Associate (3-month contract)", type: "Contract work", orgId: "pearl-fintech", orgName: "Pearl Fintech", location: "Kampala", workArrangement: "On-site", openingDate: "2026-11-15", deadline: "2026-12-31", compensation: "UGX 1,200,000 / month", summary: "Help merchants get started with Pearl's payment tools over the phone and in person.", skills: ["Communication", "Luganda", "Customer service"], fields: ["Finance"], eligibility: { summary: "Fluent in English and Luganda.", ...anyone } },
  { ...base, id: "op-9", source: "internal", status: "CLOSED", title: "Industrial Placement — IT Support", type: "Industrial placement", orgId: "pearl-fintech", orgName: "Pearl Fintech", location: "Kampala", workArrangement: "On-site", openingDate: "2026-08-01", deadline: "2026-10-01", compensation: "Lunch and transport", summary: "Ten-week placement supporting staff laptops, networks and accounts.", skills: ["Networking", "Troubleshooting"], fields: ["Software"], eligibility: { summary: "Students who need an industrial training placement.", minEducation: "Diploma", ...anyone }, publishedAt: "2026-08-01", closedAt: "2026-10-01" },
  { ...base, id: "op-10", source: "external", status: "PUBLISHED", title: "Erasmus+ International Credit Mobility", type: "International exchange", orgName: "European Commission", location: "Europe", workArrangement: "On-site", openingDate: "2026-10-01", deadline: "2027-02-15", compensation: "Monthly grant + travel", funding: "Partially funded", summary: "Study one semester at a partner university in Europe through your home university.", skills: ["English", "Research"], fields: ["Education"], eligibility: { summary: "Students enrolled at a Ugandan university with an Erasmus+ partnership.", minEducation: "Diploma", ...anyone }, publisher: "European Commission — Erasmus+", sourceUrl: "https://erasmus-plus.ec.europa.eu", officialApplyUrl: "https://erasmus-plus.ec.europa.eu/opportunities", lastVerified: "2026-11-04", publishedAt: "2026-10-05" },
  { ...base, id: "op-11", source: "external", status: "PUBLISHED", title: "Hult Prize — Campus Programme", type: "Innovation competition", orgName: "Hult Prize Foundation", location: "Multiple campuses", workArrangement: "Hybrid", openingDate: "2026-09-01", deadline: "2026-12-05", compensation: "USD 1,000,000 grand prize", funding: "Prize funding", summary: "Pitch a social enterprise idea at your campus round and compete globally.", skills: ["Entrepreneurship", "Pitching", "Teamwork"], fields: ["Entrepreneurship", "Software"], eligibility: { summary: "University students in teams of 3–4.", ...anyone }, publisher: "Hult Prize Foundation", sourceUrl: "https://www.hultprize.org", officialApplyUrl: "https://www.hultprize.org/apply", lastVerified: "2026-10-30", publishedAt: "2026-09-02" },
  { ...base, id: "op-12", source: "internal", status: "PUBLISHED", title: "Mobile Money Dashboard (freelance)", type: "Freelance project", orgId: "kampala-code-labs", orgName: "Kampala Code Labs", location: "Kampala", workArrangement: "Remote", openingDate: "2026-11-01", deadline: "2026-12-12", compensation: "UGX 2,500,000 fixed fee", summary: "Six-week project to build a React dashboard for a savings group client.", skills: ["React", "Data visualisation", "Git"], fields: ["Software", "Data"], eligibility: { summary: "Freelancers with a React portfolio.", ...anyone }, publishedAt: "2026-11-01" },
  { ...base, id: "op-13", source: "external", status: "PUBLISHED", title: "Open Data Fellowship — East Africa", type: "Fellowship", orgName: "Open Data Africa Network", location: "Kampala", workArrangement: "Hybrid", openingDate: "2026-10-20", deadline: "2026-12-30", compensation: "USD 600 / month", funding: "Fully funded", summary: "Nine-month fellowship publishing open datasets with local government partners.", skills: ["Python", "Data visualisation", "Research"], fields: ["Data", "Public policy"], eligibility: { summary: "East African graduates with data skills.", minEducation: "Bachelor's", ...anyone }, publisher: "Open Data Africa Network", sourceUrl: "https://example.org/open-data-fellowship", officialApplyUrl: "https://example.org/open-data-fellowship/apply", lastVerified: "2026-11-01", publishedAt: "2026-10-22" },
];

export const seedOrganizations: Organization[] = [
  { id: "pearl-fintech", name: "Pearl Fintech", type: "Employer", sector: "Financial services", location: "Kampala", website: "https://pearl.ug", about: "Digital payments for Ugandan SMEs.", verificationStatus: "VERIFIED", verification: { registrationNumber: "80020001234567", tin: "1001234567", contactName: "Grace Namutebi", contactEmail: "grace@pearl.ug", documents: ["URSB certificate", "TIN certificate"], submittedAt: "2026-10-20" } },
  { id: "nile-harvest", name: "Nile Harvest Cooperative", type: "Employer", sector: "Agribusiness", location: "Jinja", website: "", about: "Farmer-owned cooperative exporting coffee and maize.", verificationStatus: "VERIFIED" },
  { id: "kampala-code-labs", name: "Kampala Code Labs", type: "Employer", sector: "Technology", location: "Kampala", website: "", about: "Software studio training the next generation of Ugandan engineers.", verificationStatus: "VERIFIED" },
  { id: "gulu-health", name: "Gulu Health Alliance", type: "NGO", sector: "Health", location: "Gulu", website: "", about: "Community health programmes across Acholi sub-region.", verificationStatus: "NOT_SUBMITTED" },
  { id: "makerere", name: "Makerere University Career Office", type: "University", sector: "Education", location: "Kampala", website: "https://mak.ac.ug", about: "Career services for Makerere students and alumni.", verificationStatus: "VERIFIED" },
];

export const seedTalent: TalentProfile = {
  id: CURRENT_TALENT_ID,
  handle: "amara-n",
  name: "Amara Nakato",
  headline: "BSc Computer Science, Makerere University '26",
  location: "Kampala",
  about: "Aspiring data engineer passionate about financial inclusion and open data in East Africa.",
  careerInterests: ["Data", "Software", "Finance"],
  personal: { email: "amara@example.ug", phone: "+256 772 000 214", district: "Kampala", dob: "2003-04-12", nationalId: "CM03000000000P" },
  education: [{ id: "ed-1", institution: "Makerere University", award: "BSc Computer Science", level: "Bachelor's", programme: "Computer Science", startYear: "2022", endYear: "2026" }],
  experience: [
    { id: "ex-1", role: "Data Intern", org: "Uganda Bureau of Statistics", start: "2025-06", end: "2025-08", summary: "Cleaned census microdata and built district dashboards." },
    { id: "ex-2", role: "Student Tech Lead", org: "Makerere AI Club", start: "2024-01", end: "", summary: "Run weekly workshops for 60+ members." },
  ],
  skills: ["Python", "SQL", "React", "Data visualisation", "Luganda", "English"],
  portfolio: [
    { id: "pf-1", title: "Boda Safety Map", summary: "Crowdsourced map of road incidents in Kampala.", url: "" },
    { id: "pf-2", title: "Mobile money spend analyser", summary: "Visualises spending from SMS exports.", url: "" },
  ],
  credentials: [
    { id: "cr-1", title: "Google Data Analytics Certificate", issuer: "Coursera", issuedOn: "2025-09-14", status: "verified" },
    { id: "cr-2", title: "Academic Transcript", issuer: "Makerere University", issuedOn: "2026-06-30", status: "pending" },
  ],
  visibility: { about: "PUBLIC", education: "PUBLIC", experience: "PUBLIC", skills: "PUBLIC", credentials: "SHARED_ONLY", portfolio: "PUBLIC", documents: "PRIVATE", contact: "PRIVATE" },
};

const amaraShared: PassportSnapshot = {
  name: seedTalent.name, headline: seedTalent.headline, location: seedTalent.location, about: seedTalent.about,
  education: seedTalent.education, experience: seedTalent.experience, skills: seedTalent.skills, credentials: seedTalent.credentials, portfolio: seedTalent.portfolio,
};
const other = (name: string, headline: string, location: string, programme: string, institution: string, skills: string[]): PassportSnapshot => ({
  name, headline, location, about: `${headline}. Looking for a role where I can learn fast and contribute.`,
  education: [{ id: `ed-${name}`, institution, award: `BSc ${programme}`, level: "Bachelor's", programme, startYear: "2022", endYear: "2026" }], skills,
});

const app = (a: Omit<Application, "history" | "notes" | "coverNote"> & { coverNote?: string }, history: Application["history"] = []): Application => ({
  coverNote: "", notes: [], ...a, history: [{ status: "SUBMITTED", at: a.submittedAt, by: "talent" }, ...history],
});

export const seedApplications: Application[] = [
  app({ id: "ap-1", opportunityId: "op-1", talentId: CURRENT_TALENT_ID, status: "INTERVIEW", submittedAt: "2026-11-01", sharedSections: ["about", "education", "experience", "skills", "credentials", "portfolio"], snapshot: amaraShared, coverNote: "I've built dashboards on census data and would love to do the same for mobile money." }, [
    { status: "UNDER_REVIEW", at: "2026-11-02", by: "employer" }, { status: "SHORTLISTED", at: "2026-11-04", by: "employer" }, { status: "INTERVIEW", at: "2026-11-06", by: "employer" },
  ]),
  app({ id: "ap-2", opportunityId: "op-4", talentId: CURRENT_TALENT_ID, status: "UNDER_REVIEW", submittedAt: "2026-10-22", sharedSections: ["about", "skills", "portfolio"], snapshot: { name: amaraShared.name, headline: amaraShared.headline, location: amaraShared.location, about: amaraShared.about, skills: amaraShared.skills, portfolio: amaraShared.portfolio } }, [
    { status: "UNDER_REVIEW", at: "2026-10-25", by: "employer" },
  ]),
  app({ id: "ap-3", opportunityId: "op-2", talentId: CURRENT_TALENT_ID, status: "REJECTED", submittedAt: "2026-10-10", sharedSections: ["about", "education"], snapshot: { name: amaraShared.name, headline: amaraShared.headline, location: amaraShared.location, about: amaraShared.about, education: amaraShared.education } }, [
    { status: "REJECTED", at: "2026-10-28", by: "employer" },
  ]),
  app({ id: "ap-7", opportunityId: "op-1", talentId: "talent-brian", status: "SUBMITTED", submittedAt: "2026-11-02", sharedSections: ["about", "education", "skills"], snapshot: other("Brian Okello", "Statistics graduate, Gulu University", "Gulu", "Statistics", "Gulu University", ["Excel", "SQL", "R"]) }),
  app({ id: "ap-8", opportunityId: "op-1", talentId: "talent-sarah", status: "UNDER_REVIEW", submittedAt: "2026-10-29", sharedSections: ["about", "education", "skills"], snapshot: other("Sarah Atim", "Economics student, Kyambogo University", "Kampala", "Economics", "Kyambogo University", ["Excel", "Power BI", "Stata"]) }, [
    { status: "UNDER_REVIEW", at: "2026-11-01", by: "employer" },
  ]),
  app({ id: "ap-9", opportunityId: "op-1", talentId: "talent-daniel", status: "SHORTLISTED", submittedAt: "2026-10-27", sharedSections: ["about", "education", "skills"], snapshot: other("Daniel Ssempa", "Computer Science graduate, MUST", "Mbarara", "Computer Science", "Mbarara University of Science and Technology", ["SQL", "Python", "Power BI"]) }, [
    { status: "UNDER_REVIEW", at: "2026-10-30", by: "employer" }, { status: "SHORTLISTED", at: "2026-11-03", by: "employer" },
  ]),
  app({ id: "ap-10", opportunityId: "op-7", talentId: "talent-joel", status: "SUBMITTED", submittedAt: "2026-11-05", sharedSections: ["about", "education", "skills"], snapshot: other("Joel Mukasa", "Software engineer, 2 years at a Kampala startup", "Kampala", "Software Engineering", "Makerere University", ["Python", "APIs", "Docker"]) }),
];

export const seedClicks: OutboundClick[] = [
  { id: "cl-1", opportunityId: "op-3", talentId: CURRENT_TALENT_ID, at: "2026-11-03T10:12:00.000Z", url: "https://mastercardfdn.org/apply" },
];

export const seedNotifications: AppNotification[] = [
  { id: "n1", talentId: CURRENT_TALENT_ID, title: "Pearl Fintech moved your application to Interview", at: "2026-11-06T08:00:00.000Z", unread: true, link: { applicationId: "ap-1" } },
  { id: "n2", talentId: CURRENT_TALENT_ID, title: "Your Coursera certificate was verified", at: "2026-11-05T09:30:00.000Z", unread: true },
  { id: "n3", talentId: CURRENT_TALENT_ID, title: "New opportunities match your skills", body: "Junior Backend Engineer and Mobile Money Dashboard (freelance).", at: "2026-11-02T07:00:00.000Z", unread: false },
];

export const seedSavedIds: string[] = ["op-1", "op-3", "op-5"];

// ---- Sample-only data (screens not yet wired to the test-data store) ----

export const orgMembers = [
  { name: "Grace Namutebi", email: "grace@pearl.ug", role: "Owner" },
  { name: "Isaac Mugisha", email: "isaac@pearl.ug", role: "Manager" },
  { name: "Ruth Achieng", email: "ruth@pearl.ug", role: "Recruiter" },
  { name: "Peter Kato", email: "peter@pearl.ug", role: "Reviewer" },
  { name: "Joan Auma", email: "joan@pearl.ug", role: "Partner rep" },
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
