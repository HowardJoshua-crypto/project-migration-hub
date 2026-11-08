import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SimpleTablePage } from "@/components/shared/SimpleTablePage";
import { adminQueues } from "@/mocks/data";

export const Route = createFileRoute("/app/admin/organizations")({
  component: () => <SimpleTablePage title="Organization verification" rows={adminQueues.orgs} columns={[
    { header: "Organization", cell: (o) => <span className="font-medium text-heading">{o.name}</span> },
    { header: "Type", cell: (o) => o.type }, { header: "Submitted", cell: (o) => o.submitted },
    { header: "Status", cell: (o) => <Badge variant={o.status === "Flagged" ? "destructive" : "warning"}>{o.status}</Badge> },
    { header: "", className: "text-right", cell: () => <div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => toast.info("Rejected (preview)")}>Reject</Button><Button size="sm" onClick={() => toast.success("Verified (preview)")}>Verify</Button></div> },
  ]} />,
});
