import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, ClipboardList, Eye, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { applicants } from "@/mocks/data";

export const Route = createFileRoute("/app/org/$orgId/_employer/")({ component: Dash });

function Dash() {
  const { orgId } = Route.useParams();
  return (
    <>
      <PageHeader title="Pearl Fintech" description="Recruitment overview for your organization." actions={<Button asChild><Link to="/app/org/$orgId/opportunities/new" params={{ orgId }}>Post opportunity</Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open opportunities" value={3} icon={Briefcase} />
        <StatCard label="New applicants" value={14} hint="This week" icon={ClipboardList} />
        <StatCard label="Profile views" value="1.2k" icon={Eye} />
        <StatCard label="Hires reported" value={2} hint="1 talent-confirmed" icon={UserCheck} />
      </div>
      <div className="mt-6">
        <SectionCard title="Latest applicants" action={<Button asChild variant="link"><Link to="/app/org/$orgId/applicants" params={{ orgId }}>View all</Link></Button>}>
          <DataTable rows={applicants} columns={[
            { header: "Name", cell: (a) => <Link to="/app/org/$orgId/applicants/$applicationId" params={{ orgId, applicationId: a.id }} className="font-medium text-heading hover:text-primary">{a.name}</Link> },
            { header: "School", cell: (a) => a.school },
            { header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
          ]} />
        </SectionCard>
      </div>
    </>
  );
}
