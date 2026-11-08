import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { SectionCard } from "@/components/shared/SectionCard";
import { talent, partnerData } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/passport/privacy")({ component: Privacy });

const options = [
  { v: "PUBLIC", label: "Public", hint: "On your public passport" },
  { v: "SHARED_ONLY", label: "Shared only", hint: "Only people you authorise" },
  { v: "PRIVATE", label: "Private", hint: "Only you" },
];
const locked = new Set(["contact", "documents"]);

function Privacy() {
  const [vis, setVis] = useState<Record<string, string>>(Object.fromEntries(talent.sections.map((s) => [s.key, s.visibility])));
  return (
    <div className="space-y-6">
      <SectionCard title="Section visibility" action={<Button onClick={() => toast.success("Privacy settings saved (preview)")}>Save</Button>}>
        <div className="divide-y">
          {talent.sections.map((s) => (
            <div key={s.key} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
              <div><div className="font-medium text-heading">{s.label}</div>{locked.has(s.key) && <div className="text-xs text-muted-foreground">Can never be public</div>}</div>
              <RadioGroup value={vis[s.key] ?? "PRIVATE"} onValueChange={(v) => setVis({ ...vis, [s.key]: v })} className="flex flex-wrap gap-4" aria-label={`${s.label} visibility`}>
                {options.map((o) => (
                  <div key={o.v} className="flex items-center gap-2">
                    <RadioGroupItem value={o.v} id={`${s.key}-${o.v}`} disabled={locked.has(s.key) && o.v === "PUBLIC"} />
                    <Label htmlFor={`${s.key}-${o.v}`} className="text-sm font-normal">{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Active share grants">
        <DataTable rows={partnerData.cohort.slice(0, 1)} columns={[
          { header: "Shared with", cell: (r) => r.program },
          { header: "Expires", cell: (r) => r.expires },
          { header: "", cell: () => <Button size="sm" variant="outline" onClick={() => toast.success("Access revoked (preview)")}>Revoke now</Button>, className: "text-right" },
        ]} />
      </SectionCard>
    </div>
  );
}
