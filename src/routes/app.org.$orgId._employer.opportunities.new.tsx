import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { OpportunityForm } from "@/components/shared/OpportunityForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAction } from "@/hooks/use-action";
import { createOpportunity } from "@/services/opportunities";
import { organizationQuery } from "@/services/organizations";

export const Route = createFileRoute("/app/org/$orgId/_employer/opportunities/new")({ component: NewOpp });

function NewOpp() {
  const { orgId } = Route.useParams();
  const navigate = useNavigate();
  const org = useQuery(organizationQuery(orgId));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const create = useAction(({ raw, publish }: { raw: Record<string, string>; publish: boolean }) => createOpportunity(orgId, raw, publish), {
    success: (op) => (op.status === "PUBLISHED" ? "Opportunity published" : "Draft saved"),
    onFieldErrors: setErrors,
    onSuccess: () => navigate({ to: "/app/org/$orgId/opportunities", params: { orgId } }),
  });
  const verified = org.data?.verificationStatus === "VERIFIED";
  return (
    <>
      <PageHeader data="test" title="Create opportunity" description={verified ? "Save a draft to finish later, or publish now." : "You can save drafts now. Publishing unlocks once your organization is verified."} />
      <OpportunityForm orgId={orgId} errors={errors} pending={create.isPending} allowPublish={verified} onSubmit={(raw, publish) => create.mutate({ raw, publish })} />
    </>
  );
}
