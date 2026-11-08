import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditSection } from "@/components/shared/EditSection";
import { talent } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/passport/skills")({ component: Skills });

function Skills() {
  const [skills, setSkills] = useState(talent.skills);
  const [v, setV] = useState("");
  return (
    <EditSection title="Skills" visibility="PUBLIC">
      <form className="mb-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (v.trim() && !skills.includes(v.trim())) setSkills([...skills, v.trim()]); setV(""); }}>
        <Input value={v} onChange={(e) => setV(e.target.value)} placeholder="Add a skill, e.g. Excel" className="bg-card" aria-label="New skill" />
        <Button type="submit" variant="outline">Add</Button>
      </form>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <Badge key={s} variant="secondary" className="gap-1 py-1">{s}
            <button type="button" aria-label={`Remove ${s}`} onClick={() => setSkills(skills.filter((x) => x !== s))}><X className="size-3" /></button>
          </Badge>
        ))}
      </div>
    </EditSection>
  );
}
