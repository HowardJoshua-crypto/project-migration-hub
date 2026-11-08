import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EditSection } from "@/components/shared/EditSection";
import { Field } from "@/components/shared/FormField";
import { talent } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/passport/personal")({ component: Personal });

function Personal() {
  const p = talent.personal;
  return (
    <div className="space-y-6">
      <EditSection title="About" visibility="PUBLIC">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="name" label="Full name" defaultValue={talent.name} />
          <Field id="headline" label="Headline" defaultValue={talent.headline} />
          <div className="space-y-1.5 md:col-span-2"><Label htmlFor="about">Summary</Label><Textarea id="about" defaultValue={talent.about} rows={4} className="bg-card" /></div>
        </div>
      </EditSection>
      <EditSection title="Contact & identity" visibility="PRIVATE">
        <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"><Lock className="size-4" />Always private. Never shown on your public passport.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="email" label="Email" defaultValue={p.email} />
          <Field id="phone" label="Phone" defaultValue={p.phone} />
          <Field id="district" label="District" defaultValue={p.district} />
          <Field id="dob" label="Date of birth" type="date" defaultValue={p.dob} />
          <Field id="nin" label="National ID (NIN)" defaultValue={p.nationalId} />
        </div>
      </EditSection>
    </div>
  );
}
