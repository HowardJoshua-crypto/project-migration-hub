import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { MockBadge } from "@/components/shared/MockBadge";
import { SectionCard } from "@/components/shared/SectionCard";
import { WithPassport } from "@/components/shared/WithPassport";
import { NEVER_PUBLIC, SECTION_KEYS, SECTION_LABELS, type SectionKey, type TalentProfile, type Visibility } from "@/domain/types";
import { useAction } from "@/hooks/use-action";
import { setVisibility } from "@/services/passport";
import { partnerData } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/passport/privacy")({ component: () => <WithPassport>{(p) => <Privacy p={p} />}</WithPassport> });

const options: { v: Visibility; label: string }[] = [
  { v: "PUBLIC", label: "Public" },
  { v: "SHARED_ONLY", label: "Shared only" },
  { v: "PRIVATE", label: "Private" },
];

function Privacy({ p }: { p: TalentProfile }) {
  const [vis, setVis] = useState<Record<SectionKey, Visibility>>(p.visibility);
  const dirty = SECTION_KEYS.some((k) => vis[k] !== p.visibility[k]);
  const save = useAction(setVisibility, { success: "Privacy settings saved" });
  return (
    <div className="space-y-6">
      <SectionCard title="Section visibility" action={<Button onClick={() => save.mutate(vis)} disabled={!dirty || save.isPending}>{save.isPending ? "Saving…" : dirty ? "Save changes" : "Saved"}</Button>}>
        <p className="mb-2 text-sm text-muted-foreground"><b>Public</b>: anyone with your passport link. <b>Shared only</b>: people you authorise. <b>Private</b>: only you. Applications share only what you tick each time.</p>
        <div className="divide-y">
          {SECTION_KEYS.map((k) => (
            <div key={k} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
              <div><div className="font-medium text-heading">{SECTION_LABELS[k]}</div>{NEVER_PUBLIC.has(k) && <div className="text-xs text-muted-foreground">Can never be public</div>}</div>
              <RadioGroup value={vis[k]} onValueChange={(v) => setVis({ ...vis, [k]: v as Visibility })} className="flex flex-wrap gap-4" aria-label={`${SECTION_LABELS[k]} visibility`}>
                {options.map((o) => (
                  <div key={o.v} className="flex items-center gap-2">
                    <RadioGroupItem value={o.v} id={`${k}-${o.v}`} disabled={NEVER_PUBLIC.has(k) && o.v === "PUBLIC"} />
                    <Label htmlFor={`${k}-${o.v}`} className="text-sm font-normal">{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
        <Button asChild variant="link" className="px-0"><Link to="/app/talent/passport/preview">Preview what others see</Link></Button>
      </SectionCard>
      <SectionCard title="Active share grants" action={<MockBadge />}>
        <DataTable rows={partnerData.cohort.slice(0, 1)} columns={[
          { header: "Shared with", cell: (r) => r.program },
          { header: "Expires", cell: (r) => r.expires },
          { header: "", cell: () => <Button size="sm" variant="outline" onClick={() => toast.info("Share grants connect in Phase 4", { description: "Nothing was changed." })}>Revoke now</Button>, className: "text-right" },
        ]} />
      </SectionCard>
    </div>
  );
}
