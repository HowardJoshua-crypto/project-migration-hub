import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { opportunities } from "@/mocks/data";

export const Route = createFileRoute("/app/org/$orgId/_employer/opportunities/")({ component: Manage });

function Manage() {
  const { orgId } = Route.useParams();
  const rows = opportunities.filter((o) => o.kind === "direct").slice(0, 3).map((o, i) => ({ ...o, applicants: [14, 6, 22][i], state: ["Published", "Published", "Draft"][i] }));
  return (
    <>
      <PageHeader title="Manage opportunities" actions={<Button asChild><Link to="/app/org/$orgId/opportunities/new" params={{ orgId }}>New opportunity</Link></Button>} />
      <DataTable rows={rows} columns={[
        { header: "Title", cell: (o) => <span className="font-medium text-heading">{o.title}</span> },
        { header: "Type", cell: (o) => o.type },
        { header: "Deadline", cell: (o) => o.deadline },
        { header: "Applicants", cell: (o) => o.applicants },
        { header: "Status", cell: (o) => <Badge variant={o.state === "Published" ? "success" : "muted"}>{o.state}</Badge> },
        { header: "", className: "text-right", cell: () => <Button asChild size="sm" variant="outline"><Link to="/app/org/$orgId/applicants" params={{ orgId }}>Applicants</Link></Button> },
      ]} />
    </>
  );
}
