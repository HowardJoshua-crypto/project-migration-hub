import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WithPassport } from "@/components/shared/WithPassport";
import { COMPLETENESS_CHECKS, completeness } from "@/domain/passport";
import { SECTION_LABELS, type SectionKey } from "@/domain/types";

export const Route = createFileRoute("/app/talent/passport/")({ component: Overview });

const sectionLinks = {
  about: "/app/talent/passport/personal", contact: "/app/talent/passport/personal", education: "/app/talent/passport/education",
  experience: "/app/talent/passport/experience", skills: "/app/talent/passport/skills", credentials: "/app/talent/passport/credentials",
  portfolio: "/app/talent/passport/portfolio", documents: "/app/talent/passport/credentials",
} as const satisfies Record<SectionKey, string>;

function Overview() {
  return (
    <WithPassport>{(p) => {
      const c = completeness(p);
      return (
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between text-sm"><span className="font-medium text-heading">Passport strength</span><span>{c.percent}%</span></div>
            <Progress value={c.percent} className="mt-2" aria-label="Passport strength" />
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {COMPLETENESS_CHECKS.map((chk) => {
                const done = chk.done(p);
                return <li key={chk.label} className={done ? "flex items-center gap-2 text-muted-foreground" : "flex items-center gap-2"}>{done ? <CheckCircle2 className="size-4 text-success" /> : <Circle className="size-4" />}{chk.label}</li>;
              })}
            </ul>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(sectionLinks) as SectionKey[]).map((k) => (
              <Link key={k} to={sectionLinks[k]} className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-soft transition hover:shadow-lift">
                <span className="font-medium text-heading">{SECTION_LABELS[k]}</span>
                <StatusBadge status={p.visibility[k]} />
              </Link>
            ))}
          </div>
        </div>
      );
    }}</WithPassport>
  );
}
