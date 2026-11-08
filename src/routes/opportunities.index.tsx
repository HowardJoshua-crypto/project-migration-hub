import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { TestDataBadge } from "@/components/shared/MockBadge";
import { OpportunityBrowser, validateOpportunitySearch } from "@/components/shared/OpportunityBrowser";

export const Route = createFileRoute("/opportunities/")({
  validateSearch: validateOpportunitySearch,
  head: () => ({
    meta: [
      { title: "Jobs, internships & fellowships in Uganda — SkillBridge Uganda" },
      { name: "description", content: "Search graduate jobs, internships, apprenticeships, fellowships and scholarships open to young Ugandans." },
      { property: "og:title", content: "Opportunities — SkillBridge Uganda" },
      { property: "og:description", content: "Search graduate jobs, internships, fellowships and scholarships open to young Ugandans." },
    ],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <TestDataBadge />
        <h1 className="mt-2 text-4xl font-bold">Jobs & opportunities</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Opportunities posted by verified organisations and curated from official sources by the SkillBridge research team.</p>
        <div className="mt-8"><OpportunityBrowser filters={filters} onChange={(f) => navigate({ search: f })} searchTo="/opportunities" /></div>
      </div>
    </PublicLayout>
  );
}
