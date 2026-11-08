import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { applicants } from "@/mocks/data";

export const Route = createFileRoute("/app/org/$orgId/_employer/applicants/")({ component: List });

const stages = ["submitted", "screening", "interview", "offer"];

function List() {
  const { orgId } = Route.useParams();
  return (
    <>
      <PageHeader title="Applicants" description="Junior Data Analyst Intern · 4 applicants" />
      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        {stages.map((s) => <div key={s} className="rounded-xl border bg-card p-4"><div className="text-xs capitalize text-muted-foreground">{s}</div><div className="text-2xl font-bold text-heading">{applicants.filter((a) => a.status === s).length}</div></div>)}
      </div>
      <DataTable rows={applicants} columns={[
        { header: "Applicant", cell: (a) => <span className="font-medium text-heading">{a.name}</span> },
        { header: "School", cell: (a) => a.school },
        { header: "Submitted", cell: (a) => a.submitted },
        { header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
        { header: "", className: "text-right", cell: (a) => <Button asChild size="sm" variant="outline"><Link to="/app/org/$orgId/applicants/$applicationId" params={{ orgId, applicationId: a.id }}>Review</Link></Button> },
      ]} />
    </>
  );
}
