import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { OpportunityForm } from "@/components/shared/OpportunityForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, ErrorState } from "@/components/shared/States";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toFormValues } from "@/domain/opportunities";
import { useAction } from "@/hooks/use-action";
import { orgOpportunityQuery, publishOpportunity, updateOpportunity } from "@/services/opportunities";
import { organizationQuery } from "@/services/organizations";

export const Route = createFileRoute("/app/org/$orgId/_employer/opportunities/$opportunityId/edit")({ component: EditOpp });

function EditOpp() {
  const { orgId, opportunityId } = Route.useParams();
  const navigate = useNavigate();
  const op = useQuery(orgOpportunityQuery(orgId, opportunityId));
  const org = useQuery(organizationQuery(orgId));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const save = useAction(async ({ raw, publish }: { raw: Record<string, string>; publish: boolean }) => {
    const updated = await updateOpportunity(orgId, opportunityId, raw);
    return publish ? publishOpportunity(orgId, opportunityId) : updated;
  }, {
    success: (o) => (o.status === "PUBLISHED" ? "Changes saved and published" : "Changes saved"),
    onFieldErrors: setErrors,
    onSuccess: () => navigate({ to: "/app/org/$orgId/opportunities", params: { orgId } }),
  });

  const back = <Link to="/app/org/$orgId/opportunities" params={{ orgId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-heading"><ArrowLeft className="size-4" />Opportunities</Link>;
  if (op.isPending) return <Skeleton className="h-96" />;
  if (op.isError) return <ErrorState onRetry={() => op.refetch()} />;
  if (!op.data) return <>{back}<EmptyState title="Opportunity not found" /></>;
  const o = op.data;
  const canPublishNow = org.data?.verificationStatus === "VERIFIED" && o.status === "DRAFT";
  return (
    <>
      {back}
      <PageHeader data="test" title={`Edit: ${o.title}`} description="Changes to a published opportunity show immediately. Existing applications keep what applicants submitted." actions={<StatusBadge status={o.status} />} />
      <OpportunityForm key={o.id} orgId={orgId} initial={toFormValues(o)} errors={errors} pending={save.isPending} allowPublish={canPublishNow} submitLabel="Save changes" onSubmit={(raw, publish) => save.mutate({ raw, publish })} />
    </>
  );
}
