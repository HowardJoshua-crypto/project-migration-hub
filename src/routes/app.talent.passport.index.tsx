import { createFileRoute, Link } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { talent } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/passport/")({ component: Overview });

const sectionLinks: Record<string, string> = { about: "personal", contact: "personal", education: "education", skills: "skills", credentials: "credentials", portfolio: "portfolio", documents: "credentials" };

function Overview() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between text-sm"><span className="font-medium text-heading">Passport strength</span><span>{talent.completeness}%</span></div>
        <Progress value={talent.completeness} className="mt-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {talent.sections.map((s) => (
          <Link key={s.key} to={`/app/talent/passport/${sectionLinks[s.key]}` as "/app/talent/passport/personal"} className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-soft transition hover:shadow-lift">
            <span className="font-medium text-heading">{s.label}</span>
            <StatusBadge status={s.visibility} />
          </Link>
        ))}
      </div>
    </div>
  );
}
