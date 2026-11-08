import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { TestDataBadge } from "@/components/shared/MockBadge";
import { PassportView } from "@/components/shared/PassportView";
import { EmptyState, ErrorState } from "@/components/shared/States";
import { publicPassportQuery } from "@/services/passport";

export const Route = createFileRoute("/talent/$handle")({
  head: () => ({
    meta: [
      { title: "Public Talent Passport — SkillBridge Uganda" },
      { name: "description", content: "A public Digital Talent Passport on SkillBridge Uganda." },
      { property: "og:title", content: "Public Talent Passport — SkillBridge Uganda" },
      { property: "og:description", content: "A public Digital Talent Passport on SkillBridge Uganda." },
    ],
  }),
  component: Page,
});

function Page() {
  const { handle } = Route.useParams();
  const { data, isPending, isError, refetch } = useQuery(publicPassportQuery(handle));
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <TestDataBadge />
        <div className="mt-4">
          {isPending ? <Skeleton className="h-64 rounded-xl" /> : isError ? <ErrorState onRetry={() => refetch()} /> : !data ? <EmptyState title="Passport not found" text="This link may be wrong or the passport was removed." /> : (
            <PassportView data={data} note="Only sections marked Public are shown. Contact details, documents and shared-only sections are never visible here." />
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
