import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Field, TextareaField } from "@/components/shared/FormField";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { EmptyState } from "@/components/shared/States";
import { formValues, useAction } from "@/hooks/use-action";
import { organizationQuery, updateOrganization } from "@/services/organizations";

export const Route = createFileRoute("/app/org/$orgId/_employer/profile")({ component: Profile });

function Profile() {
  const { orgId } = Route.useParams();
  const { data: org, isPending } = useQuery(organizationQuery(orgId));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const save = useAction((raw: Record<string, string>) => updateOrganization(orgId, raw), { success: "Organization profile saved", onFieldErrors: setErrors });
  if (isPending) return <Skeleton className="h-96" />;
  if (!org) return <EmptyState title="Organization not found" />;
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); save.mutate(formValues(e.currentTarget)); }}>
      <PageHeader data="test" title="Organization profile" description="Shown on your opportunities." actions={<Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>} />
      <SectionCard title="Details">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="name" label="Organization name" defaultValue={org.name} error={errors["name"]} />
          <Field id="sector" label="Sector" defaultValue={org.sector} error={errors["sector"]} />
          <Field id="location" label="Head office" defaultValue={org.location} error={errors["location"]} />
          <Field id="website" label="Website" type="url" defaultValue={org.website} error={errors["website"]} placeholder="https://" />
          <TextareaField id="about" label="About" defaultValue={org.about} error={errors["about"]} className="md:col-span-2" />
        </div>
      </SectionCard>
    </form>
  );
}
