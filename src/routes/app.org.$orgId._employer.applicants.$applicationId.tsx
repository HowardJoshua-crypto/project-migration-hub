import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { TestDataBadge } from "@/components/shared/MockBadge";
import { PassportView } from "@/components/shared/PassportView";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState, ErrorState } from "@/components/shared/States";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { employerOptions, FINAL_STATUSES, STATUS_LABELS } from "@/domain/applications";
import type { ApplicationStatus } from "@/domain/types";
import { useAction } from "@/hooks/use-action";
import { addApplicationNote, orgApplicationQuery, setApplicationStatus } from "@/services/applications";

export const Route = createFileRoute("/app/org/$orgId/_employer/applicants/$applicationId")({ component: Review });

function Review() {
  const { orgId, applicationId } = Route.useParams();
  const { data: a, isPending, isError, refetch } = useQuery(orgApplicationQuery(orgId, applicationId));
  const [next, setNext] = useState<ApplicationStatus | "">("");
  const [note, setNote] = useState("");
  const update = useAction((s: ApplicationStatus) => setApplicationStatus(orgId, applicationId, s), { success: (r) => `Status changed to ${STATUS_LABELS[r.status]}`, onSuccess: () => setNext("") });
  const addNote = useAction((t: string) => addApplicationNote(orgId, applicationId, t), { success: "Note added", onSuccess: () => setNote("") });

  const back = <Link to="/app/org/$orgId/applicants" params={{ orgId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-heading"><ArrowLeft className="size-4" />Applicants</Link>;
  if (isPending) return <div className="space-y-4"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-96" /></div>;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!a) return <>{back}<EmptyState title="Application not found" /></>;
  const options = employerOptions(a.status);

  return (
    <>
      {back}
      <div className="mb-4 flex flex-wrap items-center gap-2"><TestDataBadge /><span className="text-sm text-muted-foreground">Applied to <b className="text-heading">{a.opportunityTitle}</b></span><StatusBadge status={a.status} /></div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {a.coverNote && <SectionCard title="Applicant's note"><p className="whitespace-pre-line text-sm">{a.coverNote}</p></SectionCard>}
          <PassportView data={a.snapshot} note={`Submitted snapshot · ${a.submittedAt}. This is exactly what the applicant chose to share and can't be changed by later passport edits.`} />
        </div>
        <div className="space-y-6">
          <SectionCard title="Hiring status">
            {FINAL_STATUSES.has(a.status) ? (
              <p className="text-sm text-muted-foreground">This application is {STATUS_LABELS[a.status].toLowerCase()}. Its status can no longer change.</p>
            ) : (
              <>
                {options.includes("SHORTLISTED") && a.status !== "INTERVIEW" && <Button variant="outline" className="mb-3 w-full" disabled={update.isPending} onClick={() => update.mutate("SHORTLISTED")}>Shortlist</Button>}
                <Label htmlFor="status">Move to</Label>
                <Select value={next} onValueChange={(v) => setNext(v as ApplicationStatus)}>
                  <SelectTrigger id="status" className="mt-1.5 bg-card"><SelectValue placeholder="Choose a status" /></SelectTrigger>
                  <SelectContent>{options.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}</SelectContent>
                </Select>
                <p className="mt-2 text-xs text-muted-foreground">The applicant is notified and sees the new status. Accepted and rejected are final.</p>
                <Button className="mt-4 w-full" disabled={!next || update.isPending} onClick={() => { if (!next) return; if ((next === "REJECTED" || next === "ACCEPTED") && !window.confirm(`Mark as ${STATUS_LABELS[next].toLowerCase()}? This is final.`)) return; update.mutate(next); }}>Update status</Button>
              </>
            )}
            <h3 className="mb-2 mt-5 text-sm font-semibold">History</h3>
            <ol className="space-y-1 border-l pl-3 text-xs">
              {a.history.map((h, i) => <li key={i}><span className="font-medium text-heading">{STATUS_LABELS[h.status]}</span> <span className="text-muted-foreground">· {h.at.slice(0, 10)} · {h.by === "talent" ? "applicant" : "your team"}</span></li>)}
            </ol>
          </SectionCard>
          <SectionCard title="Internal evaluation notes">
            <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground"><Lock className="size-3" />Never visible to the applicant</p>
            {a.notes.length > 0 && <ul className="mb-3 space-y-2">{a.notes.map((n, i) => <li key={i} className="rounded-lg bg-muted p-3 text-sm"><p>{n.text}</p><p className="mt-1 text-xs text-muted-foreground">{n.author} · {n.at.slice(0, 10)}</p></li>)}</ul>}
            <Label htmlFor="note" className="sr-only">Note</Label>
            <Textarea id="note" rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} className="bg-card" placeholder="Strong SQL; ask about dashboard project." />
            <Button variant="outline" className="mt-3 w-full" disabled={addNote.isPending || note.trim().length < 2} onClick={() => addNote.mutate(note)}>Add note</Button>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
