import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { OpportunityDetail } from "@/components/shared/OpportunityDetail";

export const Route = createFileRoute("/opportunities/$id")({
  head: () => ({
    meta: [
      { title: "Opportunity details — SkillBridge Uganda" },
      { name: "description", content: "Details, eligibility and how to apply for this opportunity on SkillBridge Uganda." },
      { property: "og:title", content: "Opportunity details — SkillBridge Uganda" },
      { property: "og:description", content: "Details, eligibility and how to apply for this opportunity." },
    ],
  }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link to="/opportunities" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All opportunities</Link>
        <OpportunityDetail id={id} />
      </div>
    </PublicLayout>
  );
}
