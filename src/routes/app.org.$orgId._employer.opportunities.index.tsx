import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorState, LoadingGrid } from "@/components/shared/States";
import { useAction } from "@/hooks/use-action";
import { closeOpportunity, orgOpportunitiesQuery, publishOpportunity } from "@/services/opportunities";
import { organizationQuery } from "@/services/organizations";

export const Route = createFileRoute("/app/org/$orgId/_employer/opportunities/")({ component: Manage });

function Manage() {
  const { orgId } = Route.useParams();
  const { data, isPending, isError, refetch } = useQuery(orgOpportunitiesQuery(orgId));
  const org = useQuery(organizationQuery(orgId));
  const publish = useAction((id: string) => publishOpportunity(orgId, id), { success: "Opportunity published" });
  const close = useAction((id: string) => closeOpportunity(orgId, id), { success: "Opportunity closed to new applications" });
  const verified = org.data?.verificationStatus === "VERIFIED";
  return (
    <>
      <PageHeader data="test" title="Manage opportunities" description={verified ? undefined : "Your organization isn't verified yet, so you can save drafts but not publish."} actions={<Button asChild><Link to="/app/org/$orgId/opportunities/new" params={{ orgId }}>New opportunity</Link></Button>} />
      {isPending ? <LoadingGrid count={3} /> : isError ? <ErrorState onRetry={() => refetch()} /> : (
        <DataTable rows={data} empty="No opportunities yet. Create your first one." columns={[
          { header: "Title", cell: (o) => <span className="font-medium text-heading">{o.title}</span> },
          { header: "Type", cell: (o) => o.type },
          { header: "Deadline", cell: (o) => o.deadline },
          { header: "Applicants", cell: (o) => o.applicantCount },
          { header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
          { header: "", className: "text-right", cell: (o) => (
            <div className="flex flex-wrap justify-end gap-2">
              <Button asChild size="sm" variant="ghost"><Link to="/app/org/$orgId/opportunities/$opportunityId/edit" params={{ orgId, opportunityId: o.id }}>Edit</Link></Button>
              {o.status !== "DRAFT" && <Button asChild size="sm" variant="ghost"><Link to="/opportunities/$id" params={{ id: o.id }}>View</Link></Button>}
              {o.status === "DRAFT" && <Button size="sm" disabled={!verified || publish.isPending} onClick={() => publish.mutate(o.id)}>Publish</Button>}
              {o.status === "CLOSED" && <Button size="sm" variant="outline" disabled={!verified || publish.isPending} onClick={() => publish.mutate(o.id)}>Reopen</Button>}
              {o.status === "PUBLISHED" && <Button size="sm" variant="outline" disabled={close.isPending} onClick={() => { if (window.confirm(`Close "${o.title}"? It will stop accepting applications.`)) close.mutate(o.id); }}>Close</Button>}
              <Button asChild size="sm" variant="outline"><Link to="/app/org/$orgId/applicants" params={{ orgId }} search={{ opportunity: o.id }}>Applicants</Link></Button>
            </div>
          ) },
        ]} />
      )}
    </>
  );
}
