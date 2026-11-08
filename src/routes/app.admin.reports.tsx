import { createFileRoute } from "@tanstack/react-router";
import { SimpleTablePage } from "@/components/shared/SimpleTablePage";
import { adminQueues } from "@/mocks/data";

export const Route = createFileRoute("/app/admin/reports")({
  component: () => <SimpleTablePage title="Reports & audit log" description="Sensitive administrative actions are recorded permanently." rows={adminQueues.audit} columns={[
    { header: "When", cell: (a) => a.at }, { header: "Actor", cell: (a) => a.actor },
    { header: "Action", cell: (a) => <span className="font-medium text-heading">{a.action}</span> }, { header: "Target", cell: (a) => a.target },
  ]} />,
});
