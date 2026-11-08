import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SimpleTablePage } from "@/components/shared/SimpleTablePage";

const rows = [
  { partner: "Pearl Fintech", kind: "Internship pipeline", since: "2025-09", status: "Active" },
  { partner: "UNDP Uganda", kind: "Programme funding", since: "2026-01", status: "Active" },
  { partner: "Gulu Health Alliance", kind: "Volunteer placements", since: "2026-11", status: "Planning" },
];
export const Route = createFileRoute("/app/org/$orgId/partner/partnerships")({
  component: () => <SimpleTablePage title="Partnership management" rows={rows} columns={[
    { header: "Partner", cell: (r) => <span className="font-medium text-heading">{r.partner}</span> },
    { header: "Type", cell: (r) => r.kind }, { header: "Since", cell: (r) => r.since },
    { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ]} />,
});
