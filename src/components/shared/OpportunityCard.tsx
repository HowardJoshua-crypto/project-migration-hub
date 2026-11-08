import { Link } from "@tanstack/react-router";
import { Calendar, ExternalLink, MapPin, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Opportunity } from "@/mocks/data";

export function OpportunityCard({ op, inApp = false }: { op: Opportunity; inApp?: boolean }) {
  return (
    <Link
      to={inApp ? "/app/talent/opportunities/$id" : "/opportunities/$id"}
      params={{ id: op.id }}
      className="group flex flex-col rounded-xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{op.type}</Badge>
        {op.kind === "external" ? (
          <Badge variant="info" className="gap-1"><ExternalLink className="size-3" /> External</Badge>
        ) : (
          <Badge variant="success">Apply on SkillBridge</Badge>
        )}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary">{op.title}</h3>
      <p className="text-sm text-muted-foreground">{op.orgName}</p>
      <p className="mt-3 line-clamp-2 text-sm">{op.summary}</p>
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="size-3" />{op.location}{op.remote && " · Remote"}</span>
        <span className="flex items-center gap-1"><Calendar className="size-3" />Closes {op.deadline}</span>
        <span className="flex items-center gap-1"><Wallet className="size-3" />{op.compensation}</span>
      </div>
    </Link>
  );
}
