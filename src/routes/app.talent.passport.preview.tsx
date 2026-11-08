import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PassportView } from "@/components/shared/PassportView";
import { WithPassport } from "@/components/shared/WithPassport";
import { viewFor, type Audience } from "@/domain/passport";

export const Route = createFileRoute("/app/talent/passport/preview")({ component: Preview });

const notes: Record<Audience, string> = {
  public: "Anyone with your passport link sees only Public sections. Contact details and documents are never shown here.",
  shared: "People you authorise (for example your university career office) see Public and Shared-only sections.",
  owner: "Only you see everything. Employers see only the sections you tick when you apply.",
};

function Preview() {
  const [audience, setAudience] = useState<Audience>("public");
  return (
    <WithPassport>{(p) => (
      <div className="space-y-4">
        <Tabs value={audience} onValueChange={(v) => setAudience(v as Audience)}>
          <TabsList>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="shared">Shared with authorised people</TabsTrigger>
            <TabsTrigger value="owner">Only me</TabsTrigger>
          </TabsList>
        </Tabs>
        <PassportView data={viewFor(p, audience)} note={notes[audience]} />
      </div>
    )}</WithPassport>
  );
}
