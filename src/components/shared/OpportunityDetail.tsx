import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Building2, Calendar, CalendarClock, CheckCircle2, ExternalLink, Info, MapPin, ShieldCheck, Sparkles, Wallet, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isOpenForApplications } from "@/domain/matching";
import { myApplicationForQuery } from "@/services/applications";
import { opportunityQuery, recordOutboundClick } from "@/services/opportunities";
import { todayIso } from "@/services/store";
import { matchQuery } from "@/services/talent-extras";
import { CURRENT_TALENT_ID } from "@/mocks/data";
import { TestDataBadge } from "./MockBadge";
import { SaveButton } from "./SaveButton";
import { StatusBadge } from "./StatusBadge";
import { EmptyState, ErrorState } from "./States";

export function OpportunityDetail({ id, inApp = false }: { id: string; inApp?: boolean }) {
  const qc = useQueryClient();
  const { data: op, isPending, isError, refetch } = useQuery(opportunityQuery(id));
  const mine = useQuery({ ...myApplicationForQuery(id), enabled: inApp });
  const match = useQuery({ ...matchQuery(id), enabled: inApp });
  if (isPending) return <div className="space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-64" /></div>;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!op) return <EmptyState title="Opportunity not found" text="It may have closed or been removed." action={<Button asChild variant="outline"><Link to={inApp ? "/app/talent/opportunities" : "/opportunities"}>Back to opportunities</Link></Button>} />;

  const external = op.source === "external";
  const open = isOpenForApplications(op, todayIso());
  const notYetOpen = op.status === "PUBLISHED" && op.openingDate > todayIso();
  const e = op.eligibility;

  const goExternal = () => {
    try {
      recordOutboundClick(op.id, inApp ? CURRENT_TALENT_ID : null);
      void qc.invalidateQueries({ queryKey: ["my-clicks"] });
      toast.info("Opened the official website", { description: "This is not an application. Finish applying on that site." });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't open the link.");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="flex flex-wrap items-center gap-2">
          <TestDataBadge />
          <Badge variant="secondary">{op.type}</Badge>
          {external ? <Badge variant="info">External opportunity</Badge> : <Badge variant="success">Apply on SkillBridge</Badge>}
          {op.status === "CLOSED" && <StatusBadge status="CLOSED" />}
        </div>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">{op.title}</h1>
        <p className="mt-2 flex items-center gap-2 text-muted-foreground"><Building2 className="size-4" />{op.orgName}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Fact icon={MapPin} label="Location" value={`${op.location} · ${op.workArrangement}`} />
          <Fact icon={CalendarClock} label="Opens" value={op.openingDate} />
          <Fact icon={Calendar} label="Deadline" value={op.deadline} />
          <Fact icon={Wallet} label="Compensation" value={op.compensation || "Not stated"} />
          {op.funding && <Fact icon={Wallet} label="Funding" value={op.funding} />}
        </div>

        {inApp && match.data && (
          <section className="mt-8 rounded-xl border bg-card p-5">
            <h2 className="flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-clay" />{match.data.eligible ? `${match.data.score}% match with your passport` : "You may not be eligible"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">Based on your skills, education, programme, experience, location and career interests.</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {match.data.reasons.map((r) => <li key={r} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />{r}</li>)}
              {match.data.gaps.map((g) => <li key={g} className="flex gap-2 text-muted-foreground"><XCircle className="mt-0.5 size-4 shrink-0" />{g}</li>)}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-xl font-semibold">About this opportunity</h2>
          <p className="mt-2">{op.summary}</p>
          {op.description && <p className="mt-3 whitespace-pre-line text-muted-foreground">{op.description}</p>}
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">{op.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}</div>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Eligibility</h2>
          <p className="mt-2">{e.summary}</p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Minimum education</dt><dd>{e.minEducation ?? "Any"}</dd>
            <dt className="text-muted-foreground">Programmes</dt><dd>{e.programmes.length ? e.programmes.join(", ") : "Any programme"}</dd>
            <dt className="text-muted-foreground">Where applicants live</dt><dd>{e.locations.length ? e.locations.join(", ") : "Anywhere"}</dd>
            <dt className="text-muted-foreground">Experience</dt><dd>{e.minExperienceMonths ? `${e.minExperienceMonths}+ months` : "None required"}</dd>
          </dl>
        </section>
        {external && (
          <section className="mt-8 rounded-xl border bg-card p-5">
            <h2 className="flex items-center gap-2 font-semibold"><Info className="size-4 text-info" />Original source</h2>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <dt className="text-muted-foreground">Original publisher</dt><dd>{op.publisher}</dd>
              <dt className="text-muted-foreground">Source page</dt><dd><a href={op.sourceUrl} target="_blank" rel="noopener noreferrer" className="break-all text-primary underline">{op.sourceUrl}</a></dd>
              <dt className="text-muted-foreground">Official application</dt><dd className="break-all">{op.officialApplyUrl}</dd>
              <dt className="text-muted-foreground">Last verified by SkillBridge</dt><dd>{op.lastVerified ?? "—"}</dd>
            </dl>
          </section>
        )}
      </div>

      <aside className="h-fit rounded-xl border bg-card p-6 shadow-soft lg:sticky lg:top-24">
        {op.status === "CLOSED" ? (
          <>
            <h2 className="font-semibold">Applications closed</h2>
            <p className="mt-1 text-sm text-muted-foreground">This opportunity is no longer accepting applications.</p>
          </>
        ) : external ? (
          <>
            <h2 className="font-semibold">Apply on the official site</h2>
            <p className="mt-1 text-sm text-muted-foreground">This opportunity is run by {op.publisher}. SkillBridge records that you visited, but it is not an application.</p>
            <Button asChild className="mt-4 w-full"><a href={op.officialApplyUrl} target="_blank" rel="noopener noreferrer" onClick={goExternal}>Apply externally <ExternalLink /></a></Button>
          </>
        ) : inApp ? (
          mine.data ? (
            <>
              <h2 className="font-semibold">You've applied</h2>
              <div className="mt-2 flex items-center gap-2 text-sm">Status: <StatusBadge status={mine.data.status} /></div>
              <p className="mt-1 text-xs text-muted-foreground">Submitted {mine.data.submittedAt}</p>
              <Button asChild variant="outline" className="mt-4 w-full"><Link to="/app/talent/applications">Track application</Link></Button>
            </>
          ) : (
            <>
              <h2 className="font-semibold">Apply with your Talent Passport</h2>
              <p className="mt-1 text-sm text-muted-foreground">Choose which passport sections to share. Your submission is locked once sent.</p>
              {open ? (
                <Button asChild className="mt-4 w-full"><Link to="/app/talent/opportunities/$id/apply" params={{ id: op.id }}>Start application</Link></Button>
              ) : (
                <Button className="mt-4 w-full" disabled>{notYetOpen ? `Opens ${op.openingDate}` : "Not accepting applications"}</Button>
              )}
            </>
          )
        ) : (
          <>
            <h2 className="font-semibold">Apply with your Talent Passport</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create a free passport to apply and track your application.</p>
            <Button asChild className="mt-4 w-full"><Link to="/signup">Create a passport to apply</Link></Button>
          </>
        )}
        {inApp ? <SaveButton opportunityId={op.id} className="mt-2 w-full" /> : <Button asChild variant="outline" className="mt-2 w-full"><Link to="/login"><Bookmark />Sign in to save</Link></Button>}
        <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 size-3.5 shrink-0" />{external ? "Never pay to apply. Report suspicious listings to SkillBridge." : "Posted by a verified SkillBridge organisation."}</p>
      </aside>
    </div>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-1 text-xs text-muted-foreground"><Icon className="size-3" />{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
