import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";

export const Route = createFileRoute("/app/org/$orgId/_employer/analytics")({ component: Analytics });

const funnel = [["Views", 1240], ["Applications", 42], ["Interviews", 9], ["Offers", 3], ["Hires (employer-reported)", 2], ["Hires (talent-confirmed)", 1]] as const;

function Analytics() {
  const max = funnel[0][1];
  return (
    <>
      <PageHeader title="Organization analytics" description="Last 90 days across all opportunities." />
      <SectionCard title="Hiring funnel">
        <div className="space-y-3">
          {funnel.map(([l, v]) => (
            <div key={l}>
              <div className="flex justify-between text-sm"><span>{l}</span><span className="font-semibold text-heading">{v}</span></div>
              <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(2, (v / max) * 100)}%` }} /></div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
