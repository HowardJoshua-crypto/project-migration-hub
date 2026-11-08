import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { EditSection } from "@/components/shared/EditSection";
import { talent } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/passport/experience")({
  component: () => (
    <EditSection title="Experience" visibility="PUBLIC" onAdd="Add experience">
      <ul className="space-y-3">{talent.experience.map((x) => (
        <li key={x.role} className="flex gap-3 rounded-lg border p-4"><Briefcase className="size-5 text-primary" /><div><div className="font-medium text-heading">{x.role} · {x.org}</div><div className="text-xs text-muted-foreground">{x.period}</div><p className="mt-1 text-sm">{x.summary}</p></div></li>
      ))}</ul>
    </EditSection>
  ),
});
