import type { LucideIcon } from "lucide-react";
import { seedOrganizations } from "@/mocks/data";
import {
  BadgeCheck, BarChart3, Bell, Bookmark, Briefcase, Building2, ClipboardList, FileSearch, FileText, Flag, Handshake,
  IdCard, LayoutDashboard, Lightbulb, LineChart, ScrollText, Search, ShieldCheck, Users, UsersRound,
} from "lucide-react";

export interface NavItem { label: string; icon: LucideIcon; to: string; params?: Record<string, string>; exact?: boolean }
export type AreaKey = "talent" | "employer" | "partner" | "admin";
export interface AreaConfig { key: AreaKey; label: string; subtitle: string; items: NavItem[] }

export const talentArea: AreaConfig = {
  key: "talent", label: "Talent", subtitle: "Amara Nakato",
  items: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/app/talent", exact: true },
    { label: "Digital Passport", icon: IdCard, to: "/app/talent/passport" },
    { label: "Opportunities", icon: Search, to: "/app/talent/opportunities" },
    { label: "Saved", icon: Bookmark, to: "/app/talent/saved" },
    { label: "My applications", icon: FileText, to: "/app/talent/applications" },
    { label: "Notifications", icon: Bell, to: "/app/talent/notifications" },
  ],
};

export const employerArea = (orgId: string): AreaConfig => ({
  key: "employer", label: "Employer", subtitle: seedOrganizations.find((o) => o.id === orgId)?.name ?? "Organization",
  items: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/app/org/$orgId", params: { orgId }, exact: true },
    { label: "Opportunities", icon: Briefcase, to: "/app/org/$orgId/opportunities", params: { orgId } },
    { label: "Applicants", icon: ClipboardList, to: "/app/org/$orgId/applicants", params: { orgId } },
    { label: "Talent discovery", icon: FileSearch, to: "/app/org/$orgId/talent", params: { orgId } },
    { label: "Analytics", icon: BarChart3, to: "/app/org/$orgId/analytics", params: { orgId } },
    { label: "Organization profile", icon: Building2, to: "/app/org/$orgId/profile", params: { orgId } },
    { label: "Team members", icon: Users, to: "/app/org/$orgId/members", params: { orgId } },
    { label: "Verification", icon: ShieldCheck, to: "/app/org/$orgId/verification", params: { orgId } },
  ],
});

export const partnerArea = (orgId: string): AreaConfig => ({
  key: "partner", label: "Partner", subtitle: "Makerere Career Office",
  items: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/app/org/$orgId/partner", params: { orgId }, exact: true },
    { label: "Institutional profile", icon: Building2, to: "/app/org/$orgId/partner/profile", params: { orgId } },
    { label: "Collaboration proposals", icon: Lightbulb, to: "/app/org/$orgId/partner/proposals", params: { orgId } },
    { label: "Partnerships", icon: Handshake, to: "/app/org/$orgId/partner/partnerships", params: { orgId } },
    { label: "Programmes", icon: UsersRound, to: "/app/org/$orgId/partner/programmes", params: { orgId } },
    { label: "Impact reports", icon: LineChart, to: "/app/org/$orgId/partner/reports", params: { orgId } },
  ],
});

export const adminArea: AreaConfig = {
  key: "admin", label: "Admin", subtitle: "Platform administration",
  items: [
    { label: "Overview", icon: LayoutDashboard, to: "/app/admin", exact: true },
    { label: "Users", icon: Users, to: "/app/admin/users" },
    { label: "Organization verification", icon: Building2, to: "/app/admin/organizations" },
    { label: "Opportunity moderation", icon: Flag, to: "/app/admin/opportunities" },
    { label: "Credential verification", icon: BadgeCheck, to: "/app/admin/credentials" },
    { label: "Reports & audit log", icon: ScrollText, to: "/app/admin/reports" },
  ],
};
