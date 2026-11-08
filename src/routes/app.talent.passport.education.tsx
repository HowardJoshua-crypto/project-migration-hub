import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { RecordListEditor } from "@/components/shared/RecordListEditor";
import { WithPassport } from "@/components/shared/WithPassport";
import { EDUCATION_LEVELS, type EducationRecord } from "@/domain/types";
import { removeItem, saveEducation } from "@/services/passport";

export const Route = createFileRoute("/app/talent/passport/education")({ component: Education });

function Education() {
  return (
    <WithPassport>{(p) => (
      <RecordListEditor<EducationRecord>
        title="Education" noun="Education" visibility={p.visibility.education} items={p.education}
        emptyText="Add your school, college or university."
        fields={[
          { name: "institution", label: "School or university", full: true },
          { name: "award", label: "Award", placeholder: "BSc Computer Science" },
          { name: "level", label: "Level", type: "select", options: EDUCATION_LEVELS },
          { name: "programme", label: "Programme / field of study", placeholder: "Computer Science", full: true, hint: "Used to match you to opportunities open to your programme." },
          { name: "startYear", label: "Start year", placeholder: "2022" },
          { name: "endYear", label: "End year (or expected)", placeholder: "2026" },
        ]}
        toValues={(e) => ({ ...e })}
        save={({ raw, id }) => saveEducation(raw, id)}
        remove={(id) => removeItem("education", id)}
        render={(e) => (
          <div className="flex gap-3"><GraduationCap className="size-5 shrink-0 text-primary" /><div><div className="font-medium text-heading">{e.award}</div><div className="text-sm text-muted-foreground">{e.institution} · {e.level} · {e.programme} · {e.startYear} – {e.endYear}</div></div></div>
        )}
      />
    )}</WithPassport>
  );
}
