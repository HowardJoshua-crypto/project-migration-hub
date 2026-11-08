import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { EditSection } from "@/components/shared/EditSection";
import { talent } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/passport/education")({
  component: () => (
    <EditSection title="Education" visibility="PUBLIC" onAdd="Add education">
      <ul className="space-y-3">{talent.education.map((e) => (
        <li key={e.school} className="flex gap-3 rounded-lg border p-4"><GraduationCap className="size-5 text-primary" /><div><div className="font-medium text-heading">{e.award}</div><div className="text-sm text-muted-foreground">{e.school} · {e.years}</div></div></li>
      ))}</ul>
    </EditSection>
  ),
});
