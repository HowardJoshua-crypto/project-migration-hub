import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Building2, Calendar, ExternalLink, Info, MapPin, ShieldCheck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { opportunityQuery } from "@/services/opportunities";
import { MockBadge } from "./MockBadge";
import { EmptyState, ErrorState } from "./States";

export function OpportunityDetail({ id, inApp = false }: { id: string; inApp?: boolean }) {
  const { data: op, isPending, isError, refetch } = useQuery(opportunityQuery(id));
  if (isPending) return <div className="space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-64" /></div>;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!op) return <EmptyState title="Opportunity not found" text="It may have closed or been removed." action={<Button asChild variant="outline"><Link to="/opportunities">Back to opportunities</Link></Button>} />;

  const external = op.kind === "external";
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="flex flex-wrap items-center gap-2">
          <MockBadge />
          <Badge variant="secondary">{op.type}</Badge>
          {external ? <Badge variant="info">External opportunity</Badge> : <Badge variant="success">Apply on SkillBridge</Badge>}
        </div>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">{op.title}</h1>
        <p className="mt-2 flex items-center gap-2 text-muted-foreground"><Building2 className="size-4" />{op.orgName}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Fact icon={MapPin} label="Location" value={`${op.location}${op.remote ? " · Remote" : ""}`} />
          <Fact icon={Calendar} label="Deadline" value={op.deadline} />
          <Fact icon={Wallet} label="Compensation" value={op.compensation} />
        </div>
        <section className="mt-8">
          <h2 className="text-xl font-semibold">About this opportunity</h2>
          <p className="mt-2">{op.summary}</p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">{op.skills.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}</div>
        </section>
        {external && (
          <section className="mt-8 rounded-xl border bg-card p-5">
            <h2 className="flex items-center gap-2 font-semibold"><Info className="size-4 text-info" />Source & eligibility</h2>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <dt className="text-muted-foreground">Original publisher</dt><dd>{op.publisher}</dd>
              <dt className="text-muted-foreground">Source</dt><dd><a href={op.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{op.sourceUrl}</a></dd>
              <dt className="text-muted-foreground">Ugandan eligibility</dt><dd>{op.ugandaEligibility}</dd>
              <dt className="text-muted-foreground">Last verified</dt><dd>{op.lastVerified}</dd>
            </dl>
          </section>
        )}
      </div>
      <aside className="h-fit rounded-xl border bg-card p-6 shadow-soft lg:sticky lg:top-24">
        {external ? (
          <>
            <h2 className="font-semibold">Apply on the official site</h2>
            <p className="mt-1 text-sm text-muted-foreground">This opportunity is run by {op.publisher}. SkillBridge records that you visited, but it is not an application.</p>
            <Button asChild className="mt-4 w-full"><a href={op.officialApplyUrl} target="_blank" rel="noopener noreferrer">Go to official application <ExternalLink /></a></Button>
          </>
        ) : (
          <>
            <h2 className="font-semibold">Apply with your Talent Passport</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose which passport sections and certificates to share. Your submission is locked once sent.</p>
            {inApp ? (
              <Button className="mt-4 w-full" onClick={() => toast.info("Applications open in Phase 3", { description: "You'll pick sections to share and submit here." })}>Start application</Button>
            ) : (
              <Button asChild className="mt-4 w-full"><Link to="/signup">Create a passport to apply</Link></Button>
            )}
          </>
        )}
        <Button variant="outline" className="mt-2 w-full" onClick={() => toast.success("Saved", { description: "Preview only — saving is connected in Phase 3." })}><Bookmark />Save</Button>
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
