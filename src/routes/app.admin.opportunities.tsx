import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SimpleTablePage } from "@/components/shared/SimpleTablePage";
import { adminQueues } from "@/mocks/data";

export const Route = createFileRoute("/app/admin/opportunities")({
  component: () => <SimpleTablePage title="Opportunity moderation" description="External opportunities drafted by researchers need admin approval before publishing." rows={adminQueues.externalDrafts} columns={[
    { header: "External opportunity", cell: (o) => <span className="font-medium text-heading">{o.title}</span> },
    { header: "Researcher", cell: (o) => o.researcher }, { header: "Last verified", cell: (o) => o.lastVerified },
    { header: "Status", cell: (o) => <Badge variant="warning">{o.status}</Badge> },
    { header: "", className: "text-right", cell: () => <Button size="sm" onClick={() => toast.success("Published (preview)")}>Approve & publish</Button> },
  ]} />,
});
