import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/PageHeader";
import { PassportView } from "@/components/shared/PassportView";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState, ErrorState } from "@/components/shared/States";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { isOpenForApplications } from "@/domain/matching";
import { buildSnapshot } from "@/domain/passport";
import { SECTION_LABELS, SHAREABLE_SECTIONS, type ShareableSection } from "@/domain/types";
import { useAction } from "@/hooks/use-action";
import { myApplicationForQuery, submitApplication } from "@/services/applications";
import { opportunityQuery } from "@/services/opportunities";
import { myPassportQuery } from "@/services/passport";
import { todayIso } from "@/services/store";

export const Route = createFileRoute("/app/talent/opportunities/$id_/apply")({ component: Apply });

const DEFAULT_SHARE: ShareableSection[] = ["about", "education", "experience", "skills", "credentials", "portfolio"];

function Apply() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const op = useQuery(opportunityQuery(id));
  const passport = useQuery(myPassportQuery());
  const existing = useQuery(myApplicationForQuery(id));
  const [sections, setSections] = useState<ShareableSection[]>(DEFAULT_SHARE);
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"choose" | "review">("choose");
  const submit = useAction(submitApplication, {
    success: "Application submitted",
    onSuccess: () => navigate({ to: "/app/talent/applications" }),
  });

  if (op.isPending || passport.isPending || existing.isPending) return <div className="space-y-4"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-72" /></div>;
  if (op.isError || passport.isError || !passport.data) return <ErrorState onRetry={() => { void op.refetch(); void passport.refetch(); }} />;
  const o = op.data;
  const back = <Link to="/app/talent/opportunities/$id" params={{ id }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-heading"><ArrowLeft className="size-4" />Back to opportunity</Link>;
  if (!o) return <EmptyState title="Opportunity not found" />;
  if (o.source === "external") return <>{back}<EmptyState title="Apply on the official website" text="External opportunities are applied for on the publisher's site. SkillBridge can't submit them for you." /></>;
  if (existing.data) return <>{back}<EmptyState title="You've already applied" text={`Submitted ${existing.data.submittedAt}.`} action={<div className="flex items-center gap-3"><StatusBadge status={existing.data.status} /><Button asChild variant="outline"><Link to="/app/talent/applications">Track application</Link></Button></div>} /></>;
  if (!isOpenForApplications(o, todayIso())) return <>{back}<EmptyState title="Not accepting applications" text="This opportunity is closed or not open yet." /></>;

  const toggle = (s: ShareableSection, on: boolean) => setSections((cur) => (on ? [...cur, s] : cur.filter((x) => x !== s)));
  const snapshot = buildSnapshot(passport.data, sections);

  return (
    <>
      {back}
      <PageHeader data="test" title={`Apply: ${o.title}`} description={`${o.orgName} · closes ${o.deadline}`} />
      <ol className="mb-6 flex gap-2 text-sm" aria-label="Steps">
        <li className={step === "choose" ? "font-semibold text-heading" : "text-muted-foreground"}>1. Choose what to share</li><li aria-hidden>→</li>
        <li className={step === "review" ? "font-semibold text-heading" : "text-muted-foreground"}>2. Review & submit</li>
      </ol>
      {step === "choose" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Sections to share">
            <p className="mb-3 text-sm text-muted-foreground">Only ticked sections are sent. Your privacy settings aren't changed.</p>
            <div className="space-y-3">
              {SHAREABLE_SECTIONS.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <Checkbox id={`share-${s}`} checked={sections.includes(s)} onCheckedChange={(c) => toggle(s, c === true)} />
                  <Label htmlFor={`share-${s}`} className="font-normal">{s === "contact" ? "Email and phone number" : SECTION_LABELS[s]}</Label>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-1.5">
              <Label htmlFor="cover">Short note to the employer (optional)</Label>
              <Textarea id="cover" rows={4} maxLength={1500} value={note} onChange={(e) => setNote(e.target.value)} className="bg-card" placeholder="Why you're interested and what you'd bring." />
              <p className="text-xs text-muted-foreground">{note.length} / 1500</p>
            </div>
            {sections.length === 0 && <p className="mt-3 text-sm text-destructive" role="alert">Choose at least one section.</p>}
            <Button className="mt-4 w-full" disabled={sections.length === 0} onClick={() => setStep("review")}>Review application</Button>
          </SectionCard>
          <div className="lg:col-span-2"><PassportView data={snapshot} note="Live preview of what the employer will receive." /></div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {note.trim() && <SectionCard title="Your note"><p className="whitespace-pre-line text-sm">{note.trim()}</p></SectionCard>}
            <PassportView data={snapshot} note="This exact copy is sent and locked. Later passport edits won't change it." />
          </div>
          <SectionCard title="Submit">
            <p className="flex items-start gap-2 text-sm text-muted-foreground"><Lock className="mt-0.5 size-4 shrink-0" />{o.orgName} will see {sections.length} section{sections.length === 1 ? "" : "s"}: {sections.map((s) => (s === "contact" ? "contact details" : SECTION_LABELS[s].toLowerCase())).join(", ")}.</p>
            <Button className="mt-4 w-full" disabled={submit.isPending} onClick={() => submit.mutate({ opportunityId: o.id, sections, coverNote: note })}>{submit.isPending ? "Submitting…" : "Submit application"}</Button>
            <Button variant="outline" className="mt-2 w-full" onClick={() => setStep("choose")}>Back</Button>
          </SectionCard>
        </div>
      )}
    </>
  );
}
