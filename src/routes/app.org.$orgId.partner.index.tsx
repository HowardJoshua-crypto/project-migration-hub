import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Handshake, UserCheck, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard } from "@/components/shared/StatCard";
import { partnerData } from "@/mocks/data";

export const Route = createFileRoute("/app/org/$orgId/partner/")({
  component: () => (
    <>
      <PageHeader title="Partner dashboard" description="Makerere University Career Office" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active partnerships" value={4} icon={Handshake} />
        <StatCard label="Consented learners" value={325} icon={UsersRound} />
        <StatCard label="Verification requests" value={partnerData.verification.length} icon={BadgeCheck} />
        <StatCard label="Confirmed placements" value={58} hint="talent-confirmed" icon={UserCheck} />
      </div>
      <div className="mt-6"><SectionCard title="Programmes">
        <ul className="divide-y">{partnerData.programs.map((p) => <li key={p.name} className="flex justify-between py-3"><span className="font-medium text-heading">{p.name}</span><span className="text-sm text-muted-foreground">{p.cohort} learners · {p.status}</span></li>)}</ul>
      </SectionCard></div>
      <p className="mt-6 text-sm text-muted-foreground">Partner representatives manage partnership activity only — recruitment applications and candidate records are not visible here.</p>
    </>
  ),
});
