import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EDUCATION_LEVELS, OPPORTUNITY_TYPES, WORK_ARRANGEMENTS } from "@/domain/types";
import { formValues } from "@/hooks/use-action";
import { Field, SelectField, TextareaField } from "./FormField";
import { SectionCard } from "./SectionCard";

/** Create / edit form for organization-posted (internal) opportunities. Validation messages come from the service. */
export function OpportunityForm({ orgId, initial = {}, errors, pending, onSubmit, allowPublish, submitLabel = "Save draft" }: {
  orgId: string;
  initial?: Record<string, string>;
  errors: Record<string, string>;
  pending: boolean;
  onSubmit: (raw: Record<string, string>, publish: boolean) => void;
  allowPublish: boolean;
  submitLabel?: string;
}) {
  const [publish, setPublish] = useState(false);
  const v = (k: string) => initial[k];
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(formValues(e.currentTarget), publish); }} className="space-y-6">
      {errors["form"] && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{errors["form"]}</p>}
      <SectionCard title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="title" label="Title" error={errors["title"]} placeholder="e.g. Junior Data Analyst Intern" defaultValue={v("title")} className="md:col-span-2" />
          <SelectField id="type" label="Opportunity type" options={OPPORTUNITY_TYPES} defaultValue={v("type") ?? "Internship"} error={errors["type"]} />
          <SelectField id="workArrangement" label="Work arrangement" options={WORK_ARRANGEMENTS} defaultValue={v("workArrangement") ?? "On-site"} error={errors["workArrangement"]} />
          <Field id="location" label="Location" placeholder="Kampala" defaultValue={v("location")} error={errors["location"]} />
          <Field id="fields" label="Career fields (comma separated)" placeholder="Data, Finance" defaultValue={v("fields")} error={errors["fields"]} hint="Used to match people's career interests." />
          <Field id="openingDate" label="Opening date" type="date" defaultValue={v("openingDate")} error={errors["openingDate"]} />
          <Field id="deadline" label="Closing date" type="date" defaultValue={v("deadline")} error={errors["deadline"]} />
          <Field id="compensation" label="Compensation / stipend" placeholder="UGX 800,000 / month" defaultValue={v("compensation")} error={errors["compensation"]} />
          <Field id="funding" label="Funding (optional)" placeholder="Fully funded" defaultValue={v("funding")} error={errors["funding"]} />
          <TextareaField id="summary" label="One-line summary" rows={2} defaultValue={v("summary")} error={errors["summary"]} className="md:col-span-2" />
          <TextareaField id="description" label="Full description" rows={5} defaultValue={v("description")} error={errors["description"]} className="md:col-span-2" />
          <Field id="skills" label="Skills (comma separated)" placeholder="SQL, Excel, Power BI" defaultValue={v("skills")} error={errors["skills"]} className="md:col-span-2" />
        </div>
      </SectionCard>
      <SectionCard title="Eligibility">
        <div className="grid gap-4 md:grid-cols-2">
          <TextareaField id="eligibilitySummary" label="Who can apply" rows={2} defaultValue={v("eligibilitySummary")} error={errors["eligibilitySummary"]} className="md:col-span-2" />
          <SelectField id="minEducation" label="Minimum education" options={[{ value: "", label: "Any level" }, ...EDUCATION_LEVELS]} defaultValue={v("minEducation") || "_none"} error={errors["minEducation"]} />
          <Field id="minExperienceMonths" label="Minimum experience (months)" type="number" defaultValue={v("minExperienceMonths") ?? "0"} error={errors["minExperienceMonths"]} />
          <Field id="programmes" label="Academic programmes (comma separated)" placeholder="Leave empty for any" defaultValue={v("programmes")} error={errors["programmes"]} />
          <Field id="locations" label="Applicants must live in (comma separated)" placeholder="Leave empty for anywhere" defaultValue={v("locations")} error={errors["locations"]} />
        </div>
      </SectionCard>
      <p className="text-sm text-muted-foreground">Application method: <b>Apply on SkillBridge</b>. Applicants share passport sections they choose; you review them under Applicants.</p>
      <div className="flex flex-wrap justify-end gap-2">
        <Button asChild variant="outline"><Link to="/app/org/$orgId/opportunities" params={{ orgId }}>Cancel</Link></Button>
        <Button type="submit" variant={allowPublish ? "outline" : "default"} disabled={pending} onClick={() => setPublish(false)}>{pending && !publish ? "Saving…" : submitLabel}</Button>
        {allowPublish && <Button type="submit" disabled={pending} onClick={() => setPublish(true)}>{pending && publish ? "Publishing…" : "Save and publish"}</Button>}
      </div>
    </form>
  );
}
