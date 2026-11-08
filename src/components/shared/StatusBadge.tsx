import { Badge, type BadgeProps } from "@/components/ui/badge";

const map: Record<string, BadgeProps["variant"]> = {
  submitted: "info", screening: "warning", interview: "clay", offer: "success", hired: "success",
  rejected: "muted", withdrawn: "muted", verified: "success", pending: "warning",
  PUBLIC: "success", PRIVATE: "muted", SHARED_ONLY: "info",
  Active: "success", Flagged: "destructive", Planning: "warning", Draft: "muted", Granted: "success",
};
const labels: Record<string, string> = { PUBLIC: "Public", PRIVATE: "Private", SHARED_ONLY: "Shared only" };

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={map[status] ?? "outline"} className="capitalize">
      {labels[status] ?? status}
    </Badge>
  );
}
