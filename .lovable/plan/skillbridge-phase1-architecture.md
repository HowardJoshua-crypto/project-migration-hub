# SkillBridge Uganda — Phase 1 Architecture

One app, one login, one Lovable Cloud backend (PostgreSQL + Storage + server functions). Five areas: Public site, Talent, Employer, Partner, Admin. Built with React + TypeScript + Tailwind + shadcn/ui on TanStack Start (the project's fixed framework and router).

## 1. Product architecture

```text
                Public website (no login)
                         |
                  Sign in / Sign up (shared)
                         |
        +----------+-----+------+-----------+
     Talent     Employer     Partner      Admin
   (personal)  (org-scoped) (org-scoped) (platform)
        \__________ shared data + permissions __________/
                    Lovable Cloud (Postgres, Storage, server functions)
```

- A person = one account. Roles are attached separately, so one person can be talent and an employer staff member.
- Organizations (employers, universities, NGOs, agencies) are their own records; people join them as members with an org role.
- Area access is decided by role + org membership, checked on the server and in database rules — never in the browser alone.

## 2. Route and page map

Public: `/`, `/opportunities`, `/opportunities/$id`, `/organizations/$slug`, `/talent/$handle` (only if the person opts to share), `/about`, `/partners`, `/contact`, `/login`, `/signup`, `/reset-password`, `/onboarding` (choose role).

Talent `/app/talent/...`: dashboard, passport (profile, education, skills, credentials, portfolio, documents), opportunities (saved/recommended), applications, notifications, settings.

Employer `/app/org/$orgId/...`: dashboard, profile, members, opportunities (list/new/edit), applicants per opportunity, settings.

Partner `/app/org/$orgId/partner/...`: dashboard, programs/partnerships, cohort (consented talent), credential verification requests, reports. (Phase later — routes reserved now.)

Admin `/app/admin/...`: dashboard, users, roles, organizations (verify), opportunities (moderate, external imports), credentials (verify queue), reports/flags, audit log.

## 3. Folder structure

```text
src/
  routes/
    index.tsx, opportunities/, organizations/, about.tsx, login.tsx ...
    _authenticated/            (requires sign-in)
      app/talent/...
      app/org/$orgId/...       (requires org membership)
      app/admin/...            (requires admin role)
  components/
    ui/                        shadcn
    layout/                    PublicLayout, AppShell, Sidebar, TopBar
    passport/ opportunities/ applications/ orgs/ admin/ shared/
  features/<module>/           queries.ts, *.functions.ts (server), schemas.ts (zod)
  lib/                         auth, permissions, storage helpers, utils
  hooks/
  integrations/supabase/       generated
supabase/migrations/
```

## 4. Role and permission model (corrected)

Platform roles (`user_roles`): `talent`, `employer`, `partner`, `moderator`, `admin`, `researcher` (curates external opportunities).
Org roles (`organization_members`): `owner`, `manager`, `recruiter`, `reviewer`, `partner_rep`.

| Action | Talent | Owner | Manager | Recruiter | Reviewer | Partner rep | Researcher | Moderator | Admin |
|---|---|---|---|---|---|---|---|---|---|
| Edit own passport / set visibility | yes | - | - | - | - | - | - | - | - |
| Apply / withdraw own eligible application | yes | - | - | - | - | - | - | - | - |
| Manage org profile, members, org roles | - | yes | yes (not owner) | - | - | - | - | - | yes |
| Create/edit direct opportunities | - | yes | yes | yes | - | - | - | - | yes |
| Read applications + snapshots (own org's opportunities) | own | yes | yes | yes | yes | NO | - | - | audited |
| Change hiring status (valid transitions only) | - | yes | yes | yes | NO | NO | - | - | - |
| Write evaluation notes (hidden from applicant) | - | yes | yes | yes | yes | NO | - | - | - |
| Manage partnerships / programs | - | yes | yes | - | - | yes | - | - | yes |
| Curate external opportunities | - | - | - | - | - | - | yes (draft) | - | publish |
| Review/flag content, verify-queue triage | - | - | - | - | - | - | - | yes | yes |
| Verify orgs/credentials, assign platform roles, account actions | - | - | - | - | - | - | - | NO | yes (audit logged) |

All checks enforced twice: server functions and database row rules (`has_role`, `org_role_in(org, roles[])` security-definer helpers).

## 5. Database entity outline (corrected)

```text
auth.users 1-1 profiles (private contact fields)
auth.users 1-n user_roles
talent_profiles 1-n passport_sections (section, visibility: PUBLIC|PRIVATE|SHARED_ONLY)
  education, skills, credentials, portfolio_items, documents  (each row has visibility + section)
passport_share_grants (owner -> recipient org/user, scope, expires_at)
organizations (type) 1-n organization_members (org_role) ; org_verification_documents (separate private bucket)
opportunities
  kind = direct  -> organization_id (verified org), internal apply
  kind = external-> publisher_name, source_url, official_apply_url, uganda_eligibility,
                    compensation_details, researcher_id, source_notes, verification_notes,
                    last_verified_at, moderation_status, publication_status, expires_at
applications (direct only) -> application_snapshots (1-1, write-once) -> snapshot_documents
application_status_history ; application_evaluations (internal notes)
external_application_clicks (tracking only)  |  placements (confirmed outcomes, separate)
partnerships, partner_programs, partner_cohort_consents
notifications, moderation_flags, audit_log
```

DB checks: direct requires organization_id and no apply URL; external requires source_url + official_apply_url and cannot have applications.

## 5a. Passport privacy model

- Every section/item has visibility: PUBLIC (public passport), PRIVATE (owner only), SHARED_ONLY (only via grant or application snapshot).
- Public passport is served only by a sanitized view/server function `get_public_passport(handle)` returning an allow-listed column set of PUBLIC items. Never returns contact info, national ID, confidential academic records or storage paths. Base tables have no anon access.

## 5b. Application snapshot model

- `submit_application(opportunity_id, section_ids[], document_ids[])` — one security-definer database function, one transaction: validates applicant owns every selected item, opportunity is direct + open, then inserts application + frozen JSON snapshot + snapshot document links.
- Snapshots are write-once: no UPDATE/DELETE policies, plus a trigger rejecting changes. Later passport edits never touch them.
- Readable only by the applicant and owner/manager/recruiter/reviewer of the org owning that opportunity.
- Updates: applicant may only set status to `withdrawn` from eligible states; recruiters+ may change status via a transition table (e.g. submitted -> screening -> interview -> offer -> hired/rejected); reviewers cannot. Trigger blocks edits to applicant_id, opportunity_id, submitted fields. Evaluation notes in a separate table invisible to applicants and partner reps.

## 5c. Storage

- `passport-documents` (private): every download goes through a server function that checks ownership, an active share grant, or an application snapshot link for the caller's org, then issues a short-lived signed URL (e.g. 60s).
- `org-verification-documents` (private, owner/manager + admin only), separate from personal documents.
- `org-assets` and `portfolio-public` public only for explicitly public items.

## 5d. Administration

- Moderators: review/flag content, triage queues. Admins only: assign privileged roles, suspend accounts, verify organizations and credentials, publish external opportunities. All such actions written to `audit_log` (actor, action, target, before/after, time).

## 6. Component hierarchy

```text
RootShell
  PublicLayout -> Header, Footer, OpportunityCard, SearchFilters
  AppShell (authenticated)
    RoleSwitcher (talent / each org / admin)
    Sidebar (per area) + TopBar (NotificationsBell, UserMenu)
    Area pages -> shared: DataTable, EmptyState, FormSection, FileUploader, StatusBadge, VerificationBadge
```

## 7. Authentication and storage

- Email/password + Google sign-in. Onboarding picks starting role; extra roles added later.
- Storage buckets: `passport-documents` (private, path `userId/...`, access via short-lived signed links), `org-assets` (public logos), `portfolio-public` (only items the user marks public).
- Security boundaries: database row rules on every table; helper checks `has_role` and `is_org_member` (security-definer) to avoid rule loops; privileged actions (role assignment, verification, admin reads) only in server functions with audit log entries.

## 8. Governance and development sequence

Six project phases (governance): 1 Plan and Structure, 2 Build the Interface, 3 Core Functionalities, 4 Database and Authentication, 5 Bug Fixing and Testing, 6 Final Polish.
Internal milestones (design system, auth, passport, orgs, opportunities, applications, notifications, admin, partner portal, hardening) map into these phases. Partner portal stays in the architecture and routes; full build may be deferred.

## 9. Risks and prevention

- Privilege escalation: roles in separate table, never trusted from the browser.
- Leaked private documents: private bucket + signed URLs + rules by owner path.
- Mixing internal/external flows: database constraints + separate UI components.
- Org data tampering: every org table checked against membership and org role.
- Partner scope creep: partner = organization type + consent table, so it plugs in without rework.
- Search performance: Postgres full-text indexes on opportunities from the start.
- Future integrations (university records, SMS/email, job feeds, mobile money): isolated in server functions and public webhook routes with caller verification.

## Approved decisions

1. Only Owners and Managers invite, remove or change org members and roles.
2. Researcher is a separate restricted platform role: drafts external opportunities; only Admins approve and publish.
3. Signed URLs live 60 seconds; share grants default to 30 days; owners can revoke instantly; authorization re-checked on every signed URL.
4. Placements: employer-reported -> talent-confirmed (mutual) or disputed; all three states kept distinct in analytics.
5. Every privileged server function and SECURITY DEFINER function validates authentication, ownership, org membership and permitted action; RLS stays on.

## Summary

One Cloud backend, people and organizations kept separate, multi-role accounts, org-scoped employer/partner areas, private-by-default passport, and distinct internal vs external application paths. Approve to start Phase 2 (design system + public site + auth).
