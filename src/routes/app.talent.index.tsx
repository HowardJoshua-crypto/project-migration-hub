import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Bookmark, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import { myApplications, notifications, opportunities, talent } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/")({ component: Dashboard });

function Dashboard() {
  return (
    <>
      <PageHeader title="Welcome back, Amara" description="Here's what's happening with your passport and applications." actions={<Button asChild><Link to="/app/talent/opportunities">Find opportunities</Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Passport complete" value={`${talent.completeness}%`} icon={Sparkles} />
        <StatCard label="Active applications" value={2} icon={FileText} />
        <StatCard label="Saved opportunities" value={talent.savedIds.length} icon={Bookmark} />
        <StatCard label="Verified credentials" value={1} hint="1 pending" icon={BadgeCheck} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Complete your passport" action={<Button asChild variant="link"><Link to="/app/talent/passport">Open passport</Link></Button>}>
            <Progress value={talent.completeness} />
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Add your work experience details</li>
              <li>• Upload your academic transcript for verification</li>
              <li>• Review your privacy settings</li>
            </ul>
          </SectionCard>
          <SectionCard title="Recent applications" action={<Button asChild variant="link"><Link to="/app/talent/applications">View all</Link></Button>}>
            <ul className="divide-y">
              {myApplications.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div><div className="font-medium text-heading">{a.opportunity}</div><div className="text-sm text-muted-foreground">{a.org}</div></div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
        <SectionCard title="Notifications" action={<Button asChild variant="link"><Link to="/app/talent/notifications">All</Link></Button>}>
          <ul className="space-y-3">{notifications.map((n) => <li key={n.id} className="text-sm"><div className={n.unread ? "font-medium text-heading" : ""}>{n.title}</div><div className="text-xs text-muted-foreground">{n.time}</div></li>)}</ul>
        </SectionCard>
      </div>
      <h2 className="mb-4 mt-10 text-xl font-semibold">Recommended for you</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{opportunities.slice(0, 3).map((o) => <OpportunityCard key={o.id} op={o} inApp />)}</div>
    </>
  );
}
