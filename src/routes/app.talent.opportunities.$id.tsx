import { createFileRoute } from "@tanstack/react-router";
import { OpportunityDetail } from "@/components/shared/OpportunityDetail";

export const Route = createFileRoute("/app/talent/opportunities/$id")({
  component: () => <OpportunityDetail id={Route.useParams().id} inApp />,
});
