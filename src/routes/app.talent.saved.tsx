import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import { SaveButton } from "@/components/shared/SaveButton";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/shared/States";
import { savedOpportunitiesQuery } from "@/services/talent-extras";

export const Route = createFileRoute("/app/talent/saved")({ component: Saved });

function Saved() {
  const { data, isPending, isError, refetch } = useQuery(savedOpportunitiesQuery());
  return (
    <>
      <PageHeader data="test" title="Saved opportunities" description="Opportunities you bookmarked to revisit." />
      {isPending ? <LoadingGrid count={3} /> : isError ? <ErrorState onRetry={() => refetch()} /> : data.length === 0 ? (
        <EmptyState title="Nothing saved yet" text="Use Save on any opportunity to keep it here." action={<Button asChild><Link to="/app/talent/opportunities">Browse opportunities</Link></Button>} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{data.map((o) => <OpportunityCard key={o.id} op={o} inApp action={<SaveButton opportunityId={o.id} size="sm" />} />)}</div>
      )}
    </>
  );
}
