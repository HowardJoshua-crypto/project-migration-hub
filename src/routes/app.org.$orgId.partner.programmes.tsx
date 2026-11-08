import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SimpleTablePage } from "@/components/shared/SimpleTablePage";
import { partnerData } from "@/mocks/data";

export const Route = createFileRoute("/app/org/$orgId/partner/programmes")({
  component: () => <SimpleTablePage title="Programmes & initiatives" description="Learners join cohorts only with their consent; access expires automatically." rows={partnerData.programs} columns={[
    { header: "Programme", cell: (r) => <span className="font-medium text-heading">{r.name}</span> },
    { header: "Cohort size", cell: (r) => r.cohort },
    { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ]} />,
});
