import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, ClipboardList, Star, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { orgApplicationsQuery } from "@/services/applications";
import { orgOpportunitiesQuery } from "@/services/opportunities";
import { organizationQuery } from "@/services/organizations";

export const Route = createFileRoute("/app/org/$orgId/_employer/")({ component: Dash });

function Dash() {
  const { orgId } = Route.useParams();
  const org = useQuery(organizationQuery(orgId));
  const ops = useQuery(orgOpportunitiesQuery(orgId));
  const apps = useQuery(orgApplicationsQuery(orgId));
  const count = (s: string) => apps.data?.filter((a) => a.status === s).length ?? "…";
  return (
    <>
      <PageHeader data="test" title={org.data?.name ?? "Organization"} description="Recruitment overview for your organization." actions={<Button asChild><Link to="/app/org/$orgId/opportunities/new" params={{ orgId }}>Post opportunity</Link></Button>} />
      {org.data && org.data.verificationStatus !== "VERIFIED" && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <span className="flex items-center gap-2">Verification: <StatusBadge status={org.data.verificationStatus} /> You can publish once verified.</span>
          <Button asChild size="sm" variant="outline"><Link to="/app/org/$orgId/verification" params={{ orgId }}>Go to verification</Link></Button>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published opportunities" value={ops.data?.filter((o) => o.status === "PUBLISHED").length ?? "…"} hint={ops.data ? `${ops.data.filter((o) => o.status === "DRAFT").length} drafts` : undefined} icon={Briefcase} />
        <StatCard label="New applicants" value={count("SUBMITTED")} hint="Not yet reviewed" icon={ClipboardList} />
        <StatCard label="Shortlisted" value={count("SHORTLISTED")} icon={Star} />
        <StatCard label="Accepted" value={count("ACCEPTED")} icon={UserCheck} />
      </div>
      <div className="mt-6">
        <SectionCard title="Latest applicants" action={<Button asChild variant="link"><Link to="/app/org/$orgId/applicants" params={{ orgId }}>View all</Link></Button>}>
          <DataTable rows={(apps.data ?? []).slice(0, 5)} empty={apps.isPending ? "Loading…" : "No applicants yet."} columns={[
            { header: "Name", cell: (a) => <Link to="/app/org/$orgId/applicants/$applicationId" params={{ orgId, applicationId: a.id }} className="font-medium text-heading hover:text-primary">{a.snapshot.name}</Link> },
            { header: "Opportunity", cell: (a) => a.opportunityTitle },
            { header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
          ]} />
        </SectionCard>
      </div>
    </>
  );
}
