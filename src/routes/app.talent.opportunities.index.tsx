import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { OpportunityBrowser, validateOpportunitySearch } from "@/components/shared/OpportunityBrowser";

export const Route = createFileRoute("/app/talent/opportunities/")({ validateSearch: validateOpportunitySearch, component: Page });

function Page() {
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <>
      <PageHeader title="Browse opportunities" description="Matched to your passport skills and location." />
      <OpportunityBrowser filters={filters} onChange={(f) => navigate({ search: f })} searchTo="/app/talent/opportunities" />
    </>
  );
}
