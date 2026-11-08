import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/shared/FormField";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";

export const Route = createFileRoute("/app/org/$orgId/partner/profile")({
  component: () => (
    <>
      <PageHeader title="Institutional profile" actions={<Button onClick={() => toast.success("Saved (preview)")}>Save</Button>} />
      <SectionCard title="Institution">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="name" label="Institution name" defaultValue="Makerere University Career Office" />
          <Field id="type" label="Type" defaultValue="University" />
          <Field id="contact" label="Partnership contact" defaultValue="careers@mak.ac.ug" />
          <Field id="focus" label="Focus areas" defaultValue="Graduate readiness, internships" />
        </div>
      </SectionCard>
    </>
  ),
});
