import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Bookmark, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import { EmptyState, LoadingGrid } from "@/components/shared/States";
import { FINAL_STATUSES } from "@/domain/applications";
import { completeness } from "@/domain/passport";
import { myApplicationsQuery } from "@/services/applications";
import { myPassportQuery } from "@/services/passport";
import { notificationsQuery, recommendationsQuery, savedIdsQuery } from "@/services/talent-extras";

export const Route = createFileRoute("/app/talent/")({ component: Dashboard });

function Dashboard() {
  const passport = useQuery(myPassportQuery());
  const apps = useQuery(myApplicationsQuery());
  const saved = useQuery(savedIdsQuery());
  const notes = useQuery(notificationsQuery());
  const recs = useQuery(recommendationsQuery());
  const p = passport.data;
  const c = p ? completeness(p) : null;
  const verified = p?.credentials.filter((x) => x.status === "verified").length ?? 0;
  const pending = (p?.credentials.length ?? 0) - verified;
  const active = apps.data?.filter((a) => !FINAL_STATUSES.has(a.status)).length;

  return (
    <>
      <PageHeader data="test" title={p ? `Welcome back, ${p.name.split(" ")[0]}` : "Welcome back"} description="Here's what's happening with your passport and applications." actions={<Button asChild><Link to="/app/talent/opportunities">Find opportunities</Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Passport complete" value={c ? `${c.percent}%` : "…"} icon={Sparkles} />
        <StatCard label="Active applications" value={active ?? "…"} icon={FileText} />
        <StatCard label="Saved opportunities" value={saved.data?.length ?? "…"} icon={Bookmark} />
        <StatCard label="Verified credentials" value={p ? verified : "…"} hint={pending ? `${pending} pending` : undefined} icon={BadgeCheck} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Complete your passport" action={<Button asChild variant="link"><Link to="/app/talent/passport">Open passport</Link></Button>}>
            {c ? (
              <>
                <Progress value={c.percent} aria-label="Passport strength" />
                {c.missing.length ? <ul className="mt-4 space-y-2 text-sm">{c.missing.map((m) => <li key={m}>• {m}</li>)}</ul> : <p className="mt-4 text-sm text-muted-foreground">Your passport is complete. Keep it up to date.</p>}
              </>
            ) : <Skeleton className="h-16" />}
          </SectionCard>
          <SectionCard title="Recent applications" action={<Button asChild variant="link"><Link to="/app/talent/applications">View all</Link></Button>}>
            {apps.isPending ? <Skeleton className="h-24" /> : !apps.data?.length ? <p className="text-sm text-muted-foreground">No applications yet.</p> : (
              <ul className="divide-y">
                {apps.data.slice(0, 4).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                    <div><div className="font-medium text-heading">{a.opportunityTitle}</div><div className="text-sm text-muted-foreground">{a.orgName}</div></div>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
        <SectionCard title="Notifications" action={<Button asChild variant="link"><Link to="/app/talent/notifications">All</Link></Button>}>
          {notes.isPending ? <Skeleton className="h-24" /> : (
            <ul className="space-y-3">{notes.data?.slice(0, 4).map((n) => <li key={n.id} className="text-sm"><div className={n.unread ? "font-medium text-heading" : ""}>{n.title}</div><div className="text-xs text-muted-foreground">{n.at.slice(0, 10)}</div></li>)}</ul>
          )}
        </SectionCard>
      </div>
      <h2 className="mt-10 text-xl font-semibold">Recommended for you</h2>
      <p className="mb-4 text-sm text-muted-foreground">Ranked by your skills, education, programme, experience, location and career interests. Each card says why.</p>
      {recs.isPending ? <LoadingGrid count={3} /> : !recs.data?.length ? (
        <EmptyState title="No strong matches yet" text="Add more skills and career interests to your passport to get recommendations." action={<Button asChild variant="outline"><Link to="/app/talent/passport/skills">Add skills</Link></Button>} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{recs.data.slice(0, 6).map(({ op, match }) => <OpportunityCard key={op.id} op={op} inApp match={match} />)}</div>
      )}
    </>
  );
}
