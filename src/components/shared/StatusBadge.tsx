import { Badge, type BadgeProps } from "@/components/ui/badge";

const map: Record<string, BadgeProps["variant"]> = {
  // Application statuses
  SUBMITTED: "info", UNDER_REVIEW: "warning", SHORTLISTED: "clay", INTERVIEW: "clay", ACCEPTED: "success", REJECTED: "muted", WITHDRAWN: "muted",
  // Credential verification
  verified: "success", pending: "warning",
  // Passport visibility
  PUBLIC: "success", PRIVATE: "muted", SHARED_ONLY: "info",
  // Opportunity lifecycle
  DRAFT: "muted", PUBLISHED: "success", CLOSED: "outline",
  // Organization verification
  NOT_SUBMITTED: "muted", PENDING_REVIEW: "warning", VERIFIED: "success",
  // Sample admin/partner rows
  Active: "success", Flagged: "destructive", Planning: "warning", Draft: "muted", Granted: "success",
};
const labels: Record<string, string> = {
  PUBLIC: "Public", PRIVATE: "Private", SHARED_ONLY: "Shared only",
  SUBMITTED: "Submitted", UNDER_REVIEW: "Under review", SHORTLISTED: "Shortlisted", INTERVIEW: "Interview", ACCEPTED: "Accepted", REJECTED: "Rejected", WITHDRAWN: "Withdrawn",
  DRAFT: "Draft", PUBLISHED: "Published", CLOSED: "Closed",
  NOT_SUBMITTED: "Not submitted", PENDING_REVIEW: "Pending review", VERIFIED: "Verified",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={map[status] ?? "outline"}>
      {labels[status] ?? status}
    </Badge>
  );
}
