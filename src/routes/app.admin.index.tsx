import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Building2, Flag, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { adminQueues } from "@/mocks/data";

export const Route = createFileRoute("/app/admin/")({
  component: () => (
    <>
      <PageHeader title="Platform overview" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value="12,431" icon={Users} />
        <StatCard label="Orgs awaiting verification" value={adminQueues.orgs.length} icon={Building2} />
        <StatCard label="External drafts to review" value={adminQueues.externalDrafts.length} icon={Flag} />
        <StatCard label="Credentials to verify" value={adminQueues.credentials.length} icon={BadgeCheck} />
      </div>
      <div className="mt-6"><SectionCard title="Recent sensitive actions" action={<Link to="/app/admin/reports" className="text-sm font-medium text-primary">Audit log</Link>}>
        <ul className="divide-y">{adminQueues.audit.map((a) => <li key={a.at} className="py-3 text-sm"><span className="font-medium text-heading">{a.action}</span> · {a.target}<div className="text-xs text-muted-foreground">{a.actor} · {a.at}</div></li>)}</ul>
      </SectionCard></div>
    </>
  ),
});
