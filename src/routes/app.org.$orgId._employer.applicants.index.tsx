import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorState, LoadingGrid } from "@/components/shared/States";
import { canEmployerSet, STATUS_LABELS } from "@/domain/applications";
import { APPLICATION_STATUSES } from "@/domain/types";
import { useAction } from "@/hooks/use-action";
import { orgApplicationsQuery, setApplicationStatus } from "@/services/applications";
import { orgOpportunitiesQuery } from "@/services/opportunities";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/org/$orgId/_employer/applicants/")({
  validateSearch: (s: Record<string, unknown>): { opportunity?: string | undefined; status?: string | undefined } => ({
    opportunity: typeof s["opportunity"] === "string" ? s["opportunity"] : undefined,
    status: typeof s["status"] === "string" ? s["status"] : undefined,
  }),
  component: List,
});

function List() {
  const { orgId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const ops = useQuery(orgOpportunitiesQuery(orgId));
  const apps = useQuery(orgApplicationsQuery(orgId, search.opportunity));
  const shortlist = useAction((id: string) => setApplicationStatus(orgId, id, "SHORTLISTED"), { success: "Applicant shortlisted" });
  const rows = (apps.data ?? []).filter((a) => !search.status || a.status === search.status);
  const selected = ops.data?.find((o) => o.id === search.opportunity);
  return (
    <>
      <PageHeader data="test" title="Applicants" description={`${selected ? selected.title : "All opportunities"} · ${apps.data?.length ?? "…"} applicants`} />
      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={search.opportunity ?? "all"} onValueChange={(v) => navigate({ search: { ...search, opportunity: v === "all" ? undefined : v } })}>
          <SelectTrigger className="w-72 bg-card" aria-label="Opportunity"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All opportunities</SelectItem>
            {ops.data?.map((o) => <SelectItem key={o.id} value={o.id}>{o.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {APPLICATION_STATUSES.map((s) => {
          const active = search.status === s;
          return (
            <button key={s} type="button" aria-pressed={active} onClick={() => navigate({ search: { ...search, status: active ? undefined : s } })} className={cn("rounded-xl border bg-card p-3 text-left transition hover:shadow-soft", active && "border-primary ring-1 ring-primary")}>
              <div className="text-xs text-muted-foreground">{STATUS_LABELS[s]}</div>
              <div className="text-2xl font-bold text-heading">{apps.data?.filter((a) => a.status === s).length ?? "…"}</div>
            </button>
          );
        })}
      </div>
      {apps.isPending ? <LoadingGrid count={3} /> : apps.isError ? <ErrorState onRetry={() => apps.refetch()} /> : (
        <DataTable rows={rows} empty="No applicants match." columns={[
          { header: "Applicant", cell: (a) => <span className="font-medium text-heading">{a.snapshot.name}</span> },
          { header: "Opportunity", cell: (a) => a.opportunityTitle },
          { header: "Submitted", cell: (a) => a.submittedAt },
          { header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
          { header: "", className: "text-right", cell: (a) => (
            <div className="flex justify-end gap-2">
              {canEmployerSet(a.status, "SHORTLISTED") && a.status !== "INTERVIEW" && <Button size="sm" variant="ghost" disabled={shortlist.isPending} onClick={() => shortlist.mutate(a.id)}>Shortlist</Button>}
              <Button asChild size="sm" variant="outline"><Link to="/app/org/$orgId/applicants/$applicationId" params={{ orgId, applicationId: a.id }}>Review</Link></Button>
            </div>
          ) },
        ]} />
      )}
    </>
  );
}
