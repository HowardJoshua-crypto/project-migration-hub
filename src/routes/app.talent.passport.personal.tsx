import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditSection } from "@/components/shared/EditSection";
import { Field, TextareaField } from "@/components/shared/FormField";
import { WithPassport } from "@/components/shared/WithPassport";
import { formValues, useAction } from "@/hooks/use-action";
import { updatePersonal, updateProfile } from "@/services/passport";

export const Route = createFileRoute("/app/talent/passport/personal")({ component: Personal });

function Personal() {
  const [aboutErr, setAboutErr] = useState<Record<string, string>>({});
  const [contactErr, setContactErr] = useState<Record<string, string>>({});
  const saveAbout = useAction(updateProfile, { success: "Profile saved", onFieldErrors: setAboutErr });
  const saveContact = useAction(updatePersonal, { success: "Contact details saved", onFieldErrors: setContactErr });
  return (
    <WithPassport>{(p) => (
      <div className="space-y-6">
        <form noValidate onSubmit={(e) => { e.preventDefault(); saveAbout.mutate(formValues(e.currentTarget)); }}>
          <EditSection title="Profile" visibility={p.visibility.about} actions={<Button type="submit" disabled={saveAbout.isPending}>{saveAbout.isPending ? "Saving…" : "Save"}</Button>}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="name" label="Full name" defaultValue={p.name} error={aboutErr["name"]} />
              <Field id="headline" label="Headline" defaultValue={p.headline} error={aboutErr["headline"]} hint="e.g. BSc Computer Science, Makerere University '26" />
              <Field id="location" label="Where you live (town or district)" defaultValue={p.location} error={aboutErr["location"]} hint="Used to match you to nearby opportunities." />
              <Field id="careerInterests" label="Career interests (comma separated)" defaultValue={p.careerInterests.join(", ")} error={aboutErr["careerInterests"]} hint="e.g. Data, Software, Finance" />
              <TextareaField id="about" label="Summary" defaultValue={p.about} error={aboutErr["about"]} className="md:col-span-2" />
            </div>
          </EditSection>
        </form>
        <form noValidate onSubmit={(e) => { e.preventDefault(); saveContact.mutate(formValues(e.currentTarget)); }}>
          <EditSection title="Contact & identity" visibility="PRIVATE" actions={<Button type="submit" disabled={saveContact.isPending}>{saveContact.isPending ? "Saving…" : "Save"}</Button>}>
            <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Lock className="size-4" />Never shown on your public passport. You choose whether to share email and phone with each application.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="email" label="Email" type="email" defaultValue={p.personal.email} error={contactErr["email"]} />
              <Field id="phone" label="Phone" type="tel" defaultValue={p.personal.phone} error={contactErr["phone"]} />
              <Field id="district" label="District" defaultValue={p.personal.district} error={contactErr["district"]} />
              <Field id="dob" label="Date of birth" type="date" defaultValue={p.personal.dob} error={contactErr["dob"]} />
              <Field id="nationalId" label="National ID (NIN)" defaultValue={p.personal.nationalId} error={contactErr["nationalId"]} />
            </div>
          </EditSection>
        </form>
      </div>
    )}</WithPassport>
  );
}
