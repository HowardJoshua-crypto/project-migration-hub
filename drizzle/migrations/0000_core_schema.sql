
-- ===== Enums =====
CREATE TYPE public.app_role AS ENUM ('talent', 'employer', 'partner', 'admin');
CREATE TYPE public.account_status AS ENUM ('ACTIVE', 'SUSPENDED');
CREATE TYPE public.org_type AS ENUM ('Employer', 'NGO', 'University', 'Government');
CREATE TYPE public.org_member_role AS ENUM ('owner', 'admin', 'recruiter', 'viewer');
CREATE TYPE public.verification_status AS ENUM ('NOT_SUBMITTED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED');
CREATE TYPE public.opportunity_kind AS ENUM ('internal', 'external');
CREATE TYPE public.opportunity_status AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
CREATE TYPE public.section_visibility AS ENUM ('PUBLIC', 'SHARED_ONLY', 'PRIVATE');
CREATE TYPE public.application_status AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
CREATE TYPE public.credential_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE public.verification_kind AS ENUM ('ORGANIZATION', 'CREDENTIAL');

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ===== Authentication =====
CREATE TABLE public.roles (
  role public.app_role PRIMARY KEY,
  label text NOT NULL,
  description text NOT NULL DEFAULT ''
);
INSERT INTO public.roles (role, label, description) VALUES
  ('talent', 'Student or graduate', 'Builds a Digital Talent Passport and applies to opportunities'),
  ('employer', 'Employer or opportunity provider', 'Manages organizations and posts opportunities'),
  ('partner', 'Institutional partner', 'Runs programmes and partnerships'),
  ('admin', 'Platform administrator', 'Verifies organizations and credentials; moderates the platform');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  account_type public.app_role NOT NULL DEFAULT 'talent',
  status public.account_status NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL REFERENCES public.roles(role),
  granted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Emails that receive the admin role once they confirm their address. Never readable by app users.
CREATE TABLE public.admin_invites (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===== Helper functions (security definer, avoid RLS recursion) =====
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_active_user(_user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND status = 'ACTIVE')
$$;

CREATE OR REPLACE FUNCTION public.try_uuid(_v text) RETURNS uuid
LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
BEGIN RETURN _v::uuid; EXCEPTION WHEN others THEN RETURN NULL; END $$;

-- ===== Organizations =====
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  org_type public.org_type NOT NULL DEFAULT 'Employer',
  sector text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  about text NOT NULL DEFAULT '',
  verification_status public.verification_status NOT NULL DEFAULT 'NOT_SUBMITTED',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER organizations_updated BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.organization_members (
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_role public.org_member_role NOT NULL DEFAULT 'recruiter',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id, user_id)
);
CREATE INDEX organization_members_user_idx ON public.organization_members(user_id);

CREATE OR REPLACE FUNCTION public.org_role(_org_id uuid, _user_id uuid) RETURNS public.org_member_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT member_role FROM public.organization_members WHERE org_id = _org_id AND user_id = _user_id
$$;
CREATE OR REPLACE FUNCTION public.is_org_member(_org_id uuid, _user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.organization_members WHERE org_id = _org_id AND user_id = _user_id)
$$;
-- owner/admin: edit profile, submit verification
CREATE OR REPLACE FUNCTION public.can_edit_org(_org_id uuid, _user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.organization_members WHERE org_id = _org_id AND user_id = _user_id AND member_role IN ('owner', 'admin'))
$$;
-- owner/admin/recruiter: manage opportunities and applicants
CREATE OR REPLACE FUNCTION public.can_recruit(_org_id uuid, _user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.organization_members WHERE org_id = _org_id AND user_id = _user_id AND member_role IN ('owner', 'admin', 'recruiter'))
$$;

-- ===== Talent =====
CREATE TABLE public.talent_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  about text NOT NULL DEFAULT '' CHECK (char_length(about) <= 1500),
  career_interests text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER talent_profiles_updated BEFORE UPDATE ON public.talent_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Private personal details: never public, never readable by employers directly.
CREATE TABLE public.talent_personal_details (
  user_id uuid PRIMARY KEY REFERENCES public.talent_profiles(user_id) ON DELETE CASCADE,
  contact_email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  dob date,
  national_id text NOT NULL DEFAULT '',
  profile_image_path text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER talent_personal_updated BEFORE UPDATE ON public.talent_personal_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.education_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id uuid NOT NULL REFERENCES public.talent_profiles(user_id) ON DELETE CASCADE,
  institution text NOT NULL,
  award text NOT NULL,
  level text NOT NULL CHECK (level IN ('Certificate', 'Diploma', 'Bachelor''s', 'Master''s', 'PhD')),
  programme text NOT NULL,
  start_year text NOT NULL CHECK (start_year ~ '^\d{4}$'),
  end_year text NOT NULL CHECK (end_year ~ '^\d{4}$'),
  document_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_year >= start_year)
);
CREATE INDEX education_records_talent_idx ON public.education_records(talent_id);

CREATE TABLE public.experience_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id uuid NOT NULL REFERENCES public.talent_profiles(user_id) ON DELETE CASCADE,
  role text NOT NULL,
  org_name text NOT NULL,
  start_month text NOT NULL CHECK (start_month ~ '^\d{4}-\d{2}$'),
  end_month text CHECK (end_month IS NULL OR end_month ~ '^\d{4}-\d{2}$'),
  summary text NOT NULL DEFAULT '' CHECK (char_length(summary) <= 600),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_month IS NULL OR end_month >= start_month)
);
CREATE INDEX experience_records_talent_idx ON public.experience_records(talent_id);

CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id uuid NOT NULL REFERENCES public.talent_profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text NOT NULL CHECK (char_length(summary) <= 600),
  url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX portfolio_projects_talent_idx ON public.portfolio_projects(talent_id);

CREATE TABLE public.credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id uuid NOT NULL REFERENCES public.talent_profiles(user_id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text NOT NULL,
  issued_on date NOT NULL,
  status public.credential_status NOT NULL DEFAULT 'pending',
  file_path text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX credentials_talent_idx ON public.credentials(talent_id);

CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX skills_name_ci ON public.skills (lower(name));

CREATE TABLE public.talent_skills (
  talent_id uuid NOT NULL REFERENCES public.talent_profiles(user_id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (talent_id, skill_id)
);

-- ===== Digital Passport =====
CREATE TABLE public.passports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id uuid NOT NULL UNIQUE REFERENCES public.talent_profiles(user_id) ON DELETE CASCADE,
  handle text NOT NULL UNIQUE CHECK (handle ~ '^[a-z0-9-]{3,48}$'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.passport_section_visibility (
  passport_id uuid NOT NULL REFERENCES public.passports(id) ON DELETE CASCADE,
  section text NOT NULL CHECK (section IN ('about', 'education', 'experience', 'skills', 'credentials', 'portfolio', 'documents', 'contact')),
  visibility public.section_visibility NOT NULL DEFAULT 'PRIVATE',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (passport_id, section),
  -- Contact details and documents can never be public.
  CONSTRAINT never_public_sections CHECK (NOT (section IN ('contact', 'documents') AND visibility = 'PUBLIC'))
);
CREATE TRIGGER passport_visibility_updated BEFORE UPDATE ON public.passport_section_visibility FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.passport_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passport_id uuid NOT NULL REFERENCES public.passports(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  sections text[] NOT NULL DEFAULT '{}',
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX passport_shares_passport_idx ON public.passport_shares(passport_id);
CREATE INDEX passport_shares_org_idx ON public.passport_shares(org_id);

-- ===== Opportunities =====
CREATE TABLE public.opportunity_categories (
  key text PRIMARY KEY,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
INSERT INTO public.opportunity_categories (key, label, sort_order) VALUES
  ('Employment', 'Employment', 1), ('Graduate trainee programme', 'Graduate trainee programme', 2), ('Internship', 'Internship', 3),
  ('Industrial placement', 'Industrial placement', 4), ('Apprenticeship', 'Apprenticeship', 5), ('Freelance project', 'Freelance project', 6),
  ('Contract work', 'Contract work', 7), ('Fellowship', 'Fellowship', 8), ('Scholarship', 'Scholarship', 9),
  ('International exchange', 'International exchange', 10), ('Innovation competition', 'Innovation competition', 11),
  ('Leadership programme', 'Leadership programme', 12), ('Volunteering', 'Volunteering', 13);

CREATE TABLE public.opportunity_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  website_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.opportunity_kind NOT NULL DEFAULT 'internal',
  status public.opportunity_status NOT NULL DEFAULT 'DRAFT',
  title text NOT NULL CHECK (char_length(title) BETWEEN 4 AND 120),
  category_key text NOT NULL REFERENCES public.opportunity_categories(key),
  org_id uuid REFERENCES public.organizations(id) ON DELETE RESTRICT,
  source_id uuid REFERENCES public.opportunity_sources(id) ON DELETE RESTRICT,
  provider_name text,
  location text NOT NULL,
  work_arrangement text NOT NULL CHECK (work_arrangement IN ('On-site', 'Hybrid', 'Remote')),
  opening_date date NOT NULL,
  deadline date NOT NULL,
  compensation text NOT NULL DEFAULT '',
  funding text NOT NULL DEFAULT '',
  summary text NOT NULL CHECK (char_length(summary) BETWEEN 20 AND 240),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 4000),
  fields text[] NOT NULL DEFAULT '{}',
  eligibility_summary text NOT NULL DEFAULT '',
  min_education text CHECK (min_education IS NULL OR min_education IN ('Certificate', 'Diploma', 'Bachelor''s', 'Master''s', 'PhD')),
  eligible_programmes text[] NOT NULL DEFAULT '{}',
  eligible_locations text[] NOT NULL DEFAULT '{}',
  min_experience_months int NOT NULL DEFAULT 0 CHECK (min_experience_months BETWEEN 0 AND 240),
  source_url text NOT NULL DEFAULT '',
  official_apply_url text NOT NULL DEFAULT '',
  last_verified date,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  closed_at timestamptz,
  CONSTRAINT deadline_after_opening CHECK (deadline >= opening_date),
  CONSTRAINT kind_requirements CHECK (
    (kind = 'internal' AND org_id IS NOT NULL)
    OR (kind = 'external' AND source_id IS NOT NULL AND source_url <> '' AND official_apply_url <> '')
  )
);
CREATE TRIGGER opportunities_updated BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX opportunities_status_deadline_idx ON public.opportunities(status, deadline);
CREATE INDEX opportunities_org_idx ON public.opportunities(org_id);

CREATE TABLE public.opportunity_skills (
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  PRIMARY KEY (opportunity_id, skill_id)
);

CREATE TABLE public.saved_opportunities (
  talent_id uuid NOT NULL REFERENCES public.talent_profiles(user_id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (talent_id, opportunity_id)
);

-- ===== Applications =====
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE RESTRICT,
  talent_id uuid NOT NULL REFERENCES public.talent_profiles(user_id) ON DELETE CASCADE,
  status public.application_status NOT NULL DEFAULT 'SUBMITTED',
  cover_note text NOT NULL DEFAULT '' CHECK (char_length(cover_note) <= 1500),
  shared_sections text[] NOT NULL DEFAULT '{}',
  attachment_paths text[] NOT NULL DEFAULT '{}',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER applications_updated BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
-- One active application per talent per opportunity.
CREATE UNIQUE INDEX applications_one_active ON public.applications(opportunity_id, talent_id) WHERE status <> 'WITHDRAWN';
CREATE INDEX applications_talent_idx ON public.applications(talent_id);

CREATE TABLE public.application_passport_snapshots (
  application_id uuid PRIMARY KEY REFERENCES public.applications(id) ON DELETE CASCADE,
  snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.application_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  status public.application_status NOT NULL,
  actor text NOT NULL CHECK (actor IN ('talent', 'employer', 'system')),
  changed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX application_status_history_app_idx ON public.application_status_history(application_id, created_at);

-- Internal employer notes: never visible to the talent.
CREATE TABLE public.application_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  author_id uuid,
  author_name text NOT NULL DEFAULT '',
  body text NOT NULL CHECK (char_length(body) BETWEEN 2 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX application_notes_app_idx ON public.application_notes(application_id);

-- A visit to an official external site. Never an application.
CREATE TABLE public.external_application_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id uuid,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX external_clicks_user_idx ON public.external_application_clicks(user_id);

CREATE OR REPLACE FUNCTION public.application_org_id(_application_id uuid) RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT o.org_id FROM public.applications a JOIN public.opportunities o ON o.id = a.opportunity_id WHERE a.id = _application_id
$$;
CREATE OR REPLACE FUNCTION public.can_view_application(_application_id uuid, _user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.applications a WHERE a.id = _application_id AND a.talent_id = _user_id)
      OR public.is_org_member(public.application_org_id(_application_id), _user_id)
      OR public.has_role(_user_id, 'admin')
$$;

-- ===== Partnerships =====
CREATE TABLE public.partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'PROPOSED' CHECK (status IN ('PROPOSED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
  lead_org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER partnerships_updated BEFORE UPDATE ON public.partnerships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.partnership_members (
  partnership_id uuid NOT NULL REFERENCES public.partnerships(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  member_role text NOT NULL DEFAULT 'partner' CHECK (member_role IN ('lead', 'partner', 'funder')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (partnership_id, org_id)
);

CREATE TABLE public.partnership_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_id uuid NOT NULL REFERENCES public.partnerships(id) ON DELETE CASCADE,
  title text NOT NULL,
  details text NOT NULL DEFAULT '',
  occurred_on date NOT NULL DEFAULT current_date,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_partnership_member(_partnership_id uuid, _user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.partnership_members pm JOIN public.organization_members om ON om.org_id = pm.org_id
    WHERE pm.partnership_id = _partnership_id AND om.user_id = _user_id
  )
$$;
CREATE OR REPLACE FUNCTION public.can_manage_partnership(_partnership_id uuid, _user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.partnerships p WHERE p.id = _partnership_id AND public.can_edit_org(p.lead_org_id, _user_id))
$$;

-- ===== Platform =====
CREATE TABLE public.verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.verification_kind NOT NULL,
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  credential_id uuid REFERENCES public.credentials(id) ON DELETE CASCADE,
  submitted_by uuid,
  details jsonb NOT NULL DEFAULT '{}',
  document_paths text[] NOT NULL DEFAULT '{}',
  status public.request_status NOT NULL DEFAULT 'PENDING',
  review_note text NOT NULL DEFAULT '',
  reviewed_by uuid,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  CONSTRAINT verification_target CHECK ((kind = 'ORGANIZATION' AND org_id IS NOT NULL) OR (kind = 'CREDENTIAL' AND credential_id IS NOT NULL))
);
CREATE UNIQUE INDEX verification_one_pending_org ON public.verification_requests(org_id) WHERE status = 'PENDING' AND kind = 'ORGANIZATION';
CREATE INDEX verification_requests_status_idx ON public.verification_requests(status, kind);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  opportunity_id uuid REFERENCES public.opportunities(id) ON DELETE SET NULL,
  application_id uuid REFERENCES public.applications(id) ON DELETE SET NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications(user_id, created_at DESC);

CREATE TABLE public.audit_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_created_idx ON public.audit_logs(created_at DESC);

-- ===== Grants (column-level where status/ownership fields must only change through rule-checked functions) =====
GRANT SELECT ON public.roles TO anon, authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (display_name) ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, UPDATE (full_name, headline, location, about, career_interests) ON public.talent_profiles TO authenticated;
GRANT SELECT, UPDATE (contact_email, phone, district, dob, national_id, profile_image_path) ON public.talent_personal_details TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education_records, public.experience_records, public.portfolio_projects TO authenticated;
GRANT SELECT, DELETE ON public.credentials TO authenticated;
GRANT INSERT (talent_id, title, issuer, issued_on, file_path) ON public.credentials TO authenticated;
GRANT UPDATE (file_path) ON public.credentials TO authenticated;
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.talent_skills TO authenticated;
GRANT SELECT ON public.passports TO authenticated;
GRANT SELECT, INSERT ON public.passport_section_visibility TO authenticated;
GRANT UPDATE (visibility) ON public.passport_section_visibility TO authenticated;
GRANT SELECT, INSERT ON public.passport_shares TO authenticated;
GRANT UPDATE (revoked_at) ON public.passport_shares TO authenticated;
GRANT SELECT ON public.organizations TO anon, authenticated;
GRANT UPDATE (name, org_type, sector, location, website, about) ON public.organizations TO authenticated;
GRANT SELECT ON public.organization_members TO authenticated;
GRANT SELECT ON public.opportunity_categories, public.opportunity_sources TO anon, authenticated;
GRANT SELECT ON public.opportunities TO anon, authenticated;
GRANT INSERT (kind, title, category_key, org_id, location, work_arrangement, opening_date, deadline, compensation, funding, summary, description, fields, eligibility_summary, min_education, eligible_programmes, eligible_locations, min_experience_months, created_by) ON public.opportunities TO authenticated;
GRANT UPDATE (title, category_key, location, work_arrangement, opening_date, deadline, compensation, funding, summary, description, fields, eligibility_summary, min_education, eligible_programmes, eligible_locations, min_experience_months) ON public.opportunities TO authenticated;
GRANT SELECT ON public.opportunity_skills TO anon, authenticated;
GRANT INSERT, DELETE ON public.opportunity_skills TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.saved_opportunities TO authenticated;
GRANT SELECT ON public.applications, public.application_passport_snapshots, public.application_status_history, public.application_notes, public.external_application_clicks TO authenticated;
GRANT SELECT, INSERT ON public.partnerships, public.partnership_members, public.partnership_activities TO authenticated;
GRANT UPDATE (title, description, status) ON public.partnerships TO authenticated;
GRANT SELECT ON public.verification_requests TO authenticated;
GRANT SELECT ON public.notifications TO authenticated;
GRANT UPDATE (read_at) ON public.notifications TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.roles, public.profiles, public.user_roles, public.admin_invites, public.organizations, public.organization_members,
  public.talent_profiles, public.talent_personal_details, public.education_records, public.experience_records, public.portfolio_projects,
  public.credentials, public.skills, public.talent_skills, public.passports, public.passport_section_visibility, public.passport_shares,
  public.opportunity_categories, public.opportunity_sources, public.opportunities, public.opportunity_skills, public.saved_opportunities,
  public.applications, public.application_passport_snapshots, public.application_status_history, public.application_notes,
  public.external_application_clicks, public.partnerships, public.partnership_members, public.partnership_activities,
  public.verification_requests, public.notifications, public.audit_logs TO service_role;

-- ===== Row Level Security =====
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_personal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passport_section_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passport_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_passport_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_application_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Reference data
CREATE POLICY "Anyone can read roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Anyone can read categories" ON public.opportunity_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read sources" ON public.opportunity_sources FOR SELECT USING (true);
CREATE POLICY "Anyone can read skills" ON public.skills FOR SELECT USING (true);
-- admin_invites: no policies = no app access.

-- Profiles & roles
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Organizations
CREATE POLICY "Anyone can read organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Org owners and admins update their organization" ON public.organizations FOR UPDATE TO authenticated
  USING (public.can_edit_org(id, auth.uid())) WITH CHECK (public.can_edit_org(id, auth.uid()));
CREATE POLICY "Members see their organization's members" ON public.organization_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_org_member(org_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- Talent (owner only; admins may read profiles and credentials for verification)
CREATE POLICY "Talent reads own profile" ON public.talent_profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Talent updates own profile" ON public.talent_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Talent reads own personal details" ON public.talent_personal_details FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Talent updates own personal details" ON public.talent_personal_details FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Talent manages own education" ON public.education_records FOR ALL TO authenticated USING (talent_id = auth.uid()) WITH CHECK (talent_id = auth.uid());
CREATE POLICY "Talent manages own experience" ON public.experience_records FOR ALL TO authenticated USING (talent_id = auth.uid()) WITH CHECK (talent_id = auth.uid());
CREATE POLICY "Talent manages own portfolio" ON public.portfolio_projects FOR ALL TO authenticated USING (talent_id = auth.uid()) WITH CHECK (talent_id = auth.uid());
CREATE POLICY "Talent reads own credentials" ON public.credentials FOR SELECT TO authenticated USING (talent_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Talent adds own credentials" ON public.credentials FOR INSERT TO authenticated WITH CHECK (talent_id = auth.uid());
CREATE POLICY "Talent updates own credential files" ON public.credentials FOR UPDATE TO authenticated USING (talent_id = auth.uid()) WITH CHECK (talent_id = auth.uid());
CREATE POLICY "Talent removes own credentials" ON public.credentials FOR DELETE TO authenticated USING (talent_id = auth.uid());
CREATE POLICY "Talent manages own skills" ON public.talent_skills FOR ALL TO authenticated USING (talent_id = auth.uid()) WITH CHECK (talent_id = auth.uid());

-- Passport
CREATE POLICY "Talent reads own passport" ON public.passports FOR SELECT TO authenticated USING (talent_id = auth.uid());
CREATE POLICY "Talent manages own visibility" ON public.passport_section_visibility FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.passports p WHERE p.id = passport_id AND p.talent_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.passports p WHERE p.id = passport_id AND p.talent_id = auth.uid()));
CREATE POLICY "Talent manages own shares" ON public.passport_shares FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.passports p WHERE p.id = passport_id AND p.talent_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.passports p WHERE p.id = passport_id AND p.talent_id = auth.uid()));
CREATE POLICY "Organizations see shares granted to them" ON public.passport_shares FOR SELECT TO authenticated
  USING (public.is_org_member(org_id, auth.uid()) AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > now()));

-- Opportunities
CREATE POLICY "Published and closed opportunities are public" ON public.opportunities FOR SELECT
  USING (status <> 'DRAFT' OR public.is_org_member(org_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Recruiters create draft opportunities for their organization" ON public.opportunities FOR INSERT TO authenticated
  WITH CHECK (kind = 'internal' AND status = 'DRAFT' AND created_by = auth.uid() AND public.can_recruit(org_id, auth.uid()) AND public.is_active_user(auth.uid()));
CREATE POLICY "Recruiters edit their organization's opportunities" ON public.opportunities FOR UPDATE TO authenticated
  USING (kind = 'internal' AND public.can_recruit(org_id, auth.uid()) AND public.is_active_user(auth.uid()))
  WITH CHECK (kind = 'internal' AND public.can_recruit(org_id, auth.uid()));
CREATE POLICY "Opportunity skills follow opportunity visibility" ON public.opportunity_skills FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id));
CREATE POLICY "Recruiters add opportunity skills" ON public.opportunity_skills FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND public.can_recruit(o.org_id, auth.uid())));
CREATE POLICY "Recruiters remove opportunity skills" ON public.opportunity_skills FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.opportunities o WHERE o.id = opportunity_id AND public.can_recruit(o.org_id, auth.uid())));
CREATE POLICY "Talent manages own saved opportunities" ON public.saved_opportunities FOR ALL TO authenticated USING (talent_id = auth.uid()) WITH CHECK (talent_id = auth.uid());

-- Applications (writes only through rule-checked functions)
CREATE POLICY "Talent and the receiving organization can read applications" ON public.applications FOR SELECT TO authenticated
  USING (talent_id = auth.uid() OR public.is_org_member(public.application_org_id(id), auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Snapshot readable with its application" ON public.application_passport_snapshots FOR SELECT TO authenticated
  USING (public.can_view_application(application_id, auth.uid()));
CREATE POLICY "History readable with its application" ON public.application_status_history FOR SELECT TO authenticated
  USING (public.can_view_application(application_id, auth.uid()));
CREATE POLICY "Only the receiving organization reads internal notes" ON public.application_notes FOR SELECT TO authenticated
  USING (public.is_org_member(public.application_org_id(application_id), auth.uid()));
CREATE POLICY "Users read own external visits" ON public.external_application_clicks FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Partnerships
CREATE POLICY "Partnership members read partnerships" ON public.partnerships FOR SELECT TO authenticated
  USING (public.is_org_member(lead_org_id, auth.uid()) OR public.is_partnership_member(id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Org admins create partnerships they lead" ON public.partnerships FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND public.can_edit_org(lead_org_id, auth.uid()));
CREATE POLICY "Lead org admins update partnerships" ON public.partnerships FOR UPDATE TO authenticated
  USING (public.can_edit_org(lead_org_id, auth.uid())) WITH CHECK (public.can_edit_org(lead_org_id, auth.uid()));
CREATE POLICY "Partnership members read members" ON public.partnership_members FOR SELECT TO authenticated
  USING (public.is_partnership_member(partnership_id, auth.uid()) OR public.can_manage_partnership(partnership_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Lead org admins add members" ON public.partnership_members FOR INSERT TO authenticated
  WITH CHECK (public.can_manage_partnership(partnership_id, auth.uid()));
CREATE POLICY "Partnership members read activities" ON public.partnership_activities FOR SELECT TO authenticated
  USING (public.is_partnership_member(partnership_id, auth.uid()) OR public.can_manage_partnership(partnership_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Partnership members log activities" ON public.partnership_activities FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND (public.is_partnership_member(partnership_id, auth.uid()) OR public.can_manage_partnership(partnership_id, auth.uid())));

-- Platform
CREATE POLICY "Submitters, org admins and platform admins read verification requests" ON public.verification_requests FOR SELECT TO authenticated
  USING (submitted_by = auth.uid() OR (org_id IS NOT NULL AND public.can_edit_org(org_id, auth.uid())) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users mark own notifications read" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins read audit log" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
