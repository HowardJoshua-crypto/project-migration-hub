import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MockBadge } from "@/components/shared/MockBadge";
import { PassportView } from "@/components/shared/PassportView";
import { SectionCard } from "@/components/shared/SectionCard";

export const Route = createFileRoute("/app/org/$orgId/_employer/applicants/$applicationId")({ component: Preview });

function Preview() {
  const { orgId } = Route.useParams();
  return (
    <>
      <Link to="/app/org/$orgId/applicants" params={{ orgId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-heading"><ArrowLeft className="size-4" />Applicants</Link>
      <div className="mb-4"><MockBadge /></div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PassportView visible={["about", "education", "skills", "credentials", "portfolio"]} note="Submitted snapshot · 1 Nov 2026. This is exactly what the applicant chose to share and cannot be changed by later passport edits." />
        </div>
        <div className="space-y-6">
          <SectionCard title="Hiring status">
            <Select defaultValue="interview"><SelectTrigger className="bg-card" aria-label="Status"><SelectValue /></SelectTrigger>
              <SelectContent>{["screening", "interview", "offer", "hired", "rejected"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">Recruiters, managers and owners can update status. Reviewers can only add notes.</p>
            <Button className="mt-4 w-full" onClick={() => toast.success("Status updated (preview)")}>Update status</Button>
          </SectionCard>
          <SectionCard title="Internal evaluation notes">
            <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground"><Lock className="size-3" />Never visible to the applicant</p>
            <Label htmlFor="note" className="sr-only">Note</Label>
            <Textarea id="note" rows={4} className="bg-card" placeholder="Strong SQL; ask about dashboard project." />
            <Button variant="outline" className="mt-3 w-full" onClick={() => toast.success("Note added (preview)")}>Add note</Button>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
