import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditSection } from "@/components/shared/EditSection";
import { WithPassport } from "@/components/shared/WithPassport";
import { useAction } from "@/hooks/use-action";
import { addSkill, removeSkill } from "@/services/passport";

export const Route = createFileRoute("/app/talent/passport/skills")({ component: Skills });

function Skills() {
  const [v, setV] = useState("");
  const add = useAction(addSkill, { success: "Skill added", onSuccess: () => setV("") });
  const remove = useAction(removeSkill, { success: "Skill removed" });
  return (
    <WithPassport>{(p) => (
      <EditSection title="Skills" visibility={p.visibility.skills}>
        <form className="mb-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); add.mutate(v); }}>
          <Input value={v} onChange={(e) => setV(e.target.value)} placeholder="Add a skill, e.g. Excel" className="bg-card" aria-label="New skill" maxLength={40} />
          <Button type="submit" variant="outline" disabled={add.isPending}>Add</Button>
        </form>
        {p.skills.length === 0 ? <p className="text-sm text-muted-foreground">No skills yet. Skills are the biggest part of your match score.</p> : (
          <div className="flex flex-wrap gap-2">
            {p.skills.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1 py-1">{s}
                <button type="button" aria-label={`Remove ${s}`} disabled={remove.isPending} onClick={() => remove.mutate(s)}><X className="size-3" /></button>
              </Badge>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">{p.skills.length} of 30 skills</p>
      </EditSection>
    )}</WithPassport>
  );
}
