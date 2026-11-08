import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { AlertTriangle, CheckCircle2, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/app/org/$orgId/partner/reports")({
  component: () => (
    <>
      <PageHeader title="Impact reports" description="Placement outcomes for your programmes, by confirmation status." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Employer-reported hires" value={71} icon={ClipboardCheck} />
        <StatCard label="Talent-confirmed placements" value={58} icon={CheckCircle2} />
        <StatCard label="Disputed outcomes" value={3} icon={AlertTriangle} />
      </div>
    </>
  ),
});
