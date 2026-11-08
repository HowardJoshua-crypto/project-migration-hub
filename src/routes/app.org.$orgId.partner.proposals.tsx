import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SimpleTablePage } from "@/components/shared/SimpleTablePage";

const rows = [
  { title: "Joint internship placement scheme", with: "Pearl Fintech", sent: "2026-10-30", status: "pending" },
  { title: "Digital skills bootcamp co-funding", with: "UNDP Uganda", sent: "2026-10-12", status: "Active" },
];
export const Route = createFileRoute("/app/org/$orgId/partner/proposals")({
  component: () => <SimpleTablePage title="Collaboration proposals" actions={<Button onClick={() => toast.info("Proposals connect in a later phase")}>New proposal</Button>} rows={rows} columns={[
    { header: "Proposal", cell: (r) => <span className="font-medium text-heading">{r.title}</span> },
    { header: "With", cell: (r) => r.with }, { header: "Sent", cell: (r) => r.sent },
    { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ]} />,
});
