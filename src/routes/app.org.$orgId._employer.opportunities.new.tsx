import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/shared/FormField";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { SuccessState } from "@/components/shared/States";

export const Route = createFileRoute("/app/org/$orgId/_employer/opportunities/new")({ component: NewOpp });

function NewOpp() {
  const { orgId } = Route.useParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  if (done) return <SuccessState title="Opportunity saved as draft (preview)" text="Publishing connects in Phase 3." action={<Button asChild><Link to="/app/org/$orgId/opportunities" params={{ orgId }}>Back to opportunities</Link></Button>} />;
  return (
    <>
      <PageHeader title="Create opportunity" description="Direct opportunities receive applications on SkillBridge." />
      <form noValidate onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget); const n: Record<string, string> = {};
        if (String(f.get("title")).trim().length < 4) n["title"] = "Add a clear title.";
        if (!f.get("deadline")) n["deadline"] = "Choose a closing date.";
        setErrors(n); if (!Object.keys(n).length) setDone(true);
      }} className="space-y-6">
        <SectionCard title="Basics">
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="title" label="Title" error={errors["title"]} placeholder="e.g. Junior Data Analyst Intern" />
            <div className="space-y-1.5"><Label>Type</Label>
              <Select defaultValue="Internship"><SelectTrigger className="h-11 bg-card"><SelectValue /></SelectTrigger>
                <SelectContent>{["Internship", "Graduate job", "Apprenticeship", "Volunteer", "Fellowship"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Field id="location" label="Location" placeholder="Kampala" />
            <Field id="deadline" label="Closing date" type="date" error={errors["deadline"]} />
            <Field id="compensation" label="Compensation / stipend" placeholder="UGX per month" />
            <Field id="skills" label="Skills (comma separated)" />
            <div className="space-y-1.5 md:col-span-2"><Label htmlFor="desc">Description</Label><Textarea id="desc" rows={5} className="bg-card" /></div>
          </div>
        </SectionCard>
        <div className="flex justify-end gap-2">
          <Button asChild variant="outline"><Link to="/app/org/$orgId/opportunities" params={{ orgId }}>Cancel</Link></Button>
          <Button type="submit">Save draft</Button>
        </div>
      </form>
    </>
  );
}
