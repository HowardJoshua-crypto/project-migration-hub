import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import { EmptyState } from "@/components/shared/States";
import { opportunities, talent } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/saved")({ component: Saved });

function Saved() {
  const saved = opportunities.filter((o) => talent.savedIds.includes(o.id));
  return (
    <>
      <PageHeader title="Saved opportunities" description="Opportunities you bookmarked to revisit." />
      {saved.length === 0 ? <EmptyState title="Nothing saved yet" action={<Button asChild><Link to="/app/talent/opportunities">Browse opportunities</Link></Button>} /> : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{saved.map((o) => <OpportunityCard key={o.id} op={o} inApp />)}</div>
      )}
    </>
  );
}
