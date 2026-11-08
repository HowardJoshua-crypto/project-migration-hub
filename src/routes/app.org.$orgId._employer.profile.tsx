import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/shared/FormField";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";

export const Route = createFileRoute("/app/org/$orgId/_employer/profile")({
  component: () => (
    <>
      <PageHeader title="Organization profile" description="Shown on your public organization page and opportunities." actions={<Button onClick={() => toast.success("Profile saved (preview)")}>Save</Button>} />
      <SectionCard title="Details">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="name" label="Organization name" defaultValue="Pearl Fintech" />
          <Field id="sector" label="Sector" defaultValue="Financial services" />
          <Field id="location" label="Head office" defaultValue="Kampala" />
          <Field id="website" label="Website" defaultValue="https://pearl.ug" />
          <div className="space-y-1.5 md:col-span-2"><Label htmlFor="about">About</Label><Textarea id="about" rows={4} defaultValue="Digital payments for Ugandan SMEs." className="bg-card" /></div>
        </div>
      </SectionCard>
    </>
  ),
});
