import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, FileLock2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Field } from "@/components/shared/FormField";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/States";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formValues, useAction } from "@/hooks/use-action";
import { organizationQuery, submitVerification } from "@/services/organizations";

export const Route = createFileRoute("/app/org/$orgId/_employer/verification")({ component: Verification });

function Verification() {
  const { orgId } = Route.useParams();
  const { data: org, isPending } = useQuery(organizationQuery(orgId));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = useAction((raw: Record<string, string>) => submitVerification(orgId, raw), { success: "Verification details submitted for review", onFieldErrors: setErrors });
  if (isPending) return <Skeleton className="h-96" />;
  if (!org) return <EmptyState title="Organization not found" />;
  const s = org.verificationStatus;
  const steps: [string, boolean][] = [
    ["Organization details", true],
    ["Registration and tax details submitted", s !== "NOT_SUBMITTED"],
    ["SkillBridge admin review", s === "VERIFIED"],
  ];
  const v = org.verification;
  return (
    <>
      <PageHeader data="test" title="Organization verification" description="Verified organizations get a badge and can publish opportunities." actions={<StatusBadge status={s} />} />
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Progress">
          <ol className="space-y-3">{steps.map(([l, done]) => <li key={l} className="flex items-center gap-2">{done ? <CheckCircle2 className="size-5 text-primary" /> : <Circle className="size-5 text-muted-foreground" />}{l}</li>)}</ol>
          {s === "PENDING_REVIEW" && <p className="mt-4 text-sm text-muted-foreground">Submitted {v?.submittedAt}. An admin reviews it in Phase 4 — in this test version nobody approves it automatically.</p>}
          {s === "VERIFIED" && <p className="mt-4 text-sm text-muted-foreground">Verified. You can publish opportunities.</p>}
        </SectionCard>
        {s === "NOT_SUBMITTED" || s === "REJECTED" ? (
          <form noValidate onSubmit={(e) => { e.preventDefault(); submit.mutate(formValues(e.currentTarget)); }}>
            <SectionCard title="Submit verification details">
              <div className="grid gap-4">
                <Field id="registrationNumber" label="URSB registration number" error={errors["registrationNumber"]} defaultValue={v?.registrationNumber} />
                <Field id="tin" label="TIN (10 digits)" error={errors["tin"]} defaultValue={v?.tin} />
                <Field id="contactName" label="Contact person" error={errors["contactName"]} defaultValue={v?.contactName} />
                <Field id="contactEmail" label="Contact email" type="email" error={errors["contactEmail"]} defaultValue={v?.contactEmail} />
                <Field id="documents" label="Documents you'll provide (comma separated)" placeholder="URSB certificate, TIN certificate" error={errors["documents"]} defaultValue={v?.documents.join(", ")} hint="File uploads arrive in Phase 4; list them for now." />
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><FileLock2 className="mt-0.5 size-4 shrink-0" />Stored separately from personal passport documents. Only your owners/managers and SkillBridge admins can view them.</p>
              <Button type="submit" className="mt-4" disabled={submit.isPending}>{submit.isPending ? "Submitting…" : "Submit for review"}</Button>
            </SectionCard>
          </form>
        ) : (
          <SectionCard title="Submitted details">
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-muted-foreground">Registration number</dt><dd>{v?.registrationNumber ?? "—"}</dd>
              <dt className="text-muted-foreground">TIN</dt><dd>{v?.tin ?? "—"}</dd>
              <dt className="text-muted-foreground">Contact</dt><dd>{v ? `${v.contactName} (${v.contactEmail})` : "—"}</dd>
              <dt className="text-muted-foreground">Documents</dt><dd>{v?.documents.join(", ") ?? "—"}</dd>
            </dl>
          </SectionCard>
        )}
      </div>
    </>
  );
}
