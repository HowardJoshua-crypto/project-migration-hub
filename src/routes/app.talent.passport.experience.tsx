import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { RecordListEditor } from "@/components/shared/RecordListEditor";
import { WithPassport } from "@/components/shared/WithPassport";
import type { ExperienceRecord } from "@/domain/types";
import { removeItem, saveExperience } from "@/services/passport";

export const Route = createFileRoute("/app/talent/passport/experience")({ component: Experience });

function Experience() {
  return (
    <WithPassport>{(p) => (
      <RecordListEditor<ExperienceRecord>
        title="Experience" noun="Experience" visibility={p.visibility.experience} items={p.experience}
        emptyText="Internships, jobs, volunteering and student leadership all count."
        fields={[
          { name: "role", label: "Role", placeholder: "Data Intern" },
          { name: "org", label: "Organization" },
          { name: "start", label: "Start month", type: "month" },
          { name: "end", label: "End month", type: "month", hint: "Leave empty if you still do this." },
          { name: "summary", label: "What you did", type: "textarea", full: true },
        ]}
        toValues={(x) => ({ ...x })}
        save={({ raw, id }) => saveExperience(raw, id)}
        remove={(id) => removeItem("experience", id)}
        render={(x) => (
          <div className="flex gap-3"><Briefcase className="size-5 shrink-0 text-primary" /><div><div className="font-medium text-heading">{x.role} · {x.org}</div><div className="text-xs text-muted-foreground">{x.start} – {x.end || "present"}</div>{x.summary && <p className="mt-1 text-sm">{x.summary}</p>}</div></div>
        )}
      />
    )}</WithPassport>
  );
}
