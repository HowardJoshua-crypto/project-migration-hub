import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, FileLock2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";

const steps = [["Organization details", true], ["Registration certificate (URSB)", true], ["TIN certificate", false], ["Admin review", false]] as const;

export const Route = createFileRoute("/app/org/$orgId/_employer/verification")({
  component: () => (
    <>
      <PageHeader title="Organization verification" description="Verified organizations get a badge and can publish opportunities." />
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Progress">
          <ol className="space-y-3">{steps.map(([l, done]) => <li key={l} className="flex items-center gap-2">{done ? <CheckCircle2 className="size-5 text-primary" /> : <Circle className="size-5 text-muted-foreground" />}{l}</li>)}</ol>
        </SectionCard>
        <SectionCard title="Verification documents">
          <p className="flex items-start gap-2 text-sm text-muted-foreground"><FileLock2 className="mt-0.5 size-4 shrink-0" />Stored privately and separately from personal passport documents. Only your owners/managers and SkillBridge admins can view them.</p>
          <Button className="mt-4" onClick={() => toast.info("Secure uploads arrive in Phase 4")}>Upload document</Button>
        </SectionCard>
      </div>
    </>
  ),
});
