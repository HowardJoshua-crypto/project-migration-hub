import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Calendar, ExternalLink, MapPin, Sparkles, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MatchResult } from "@/domain/matching";
import type { Opportunity } from "@/domain/types";

export function OpportunityCard({ op, inApp = false, match, action }: { op: Opportunity; inApp?: boolean; match?: MatchResult | undefined; action?: ReactNode }) {
  return (
    <div className="flex flex-col rounded-xl border bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
      <Link to={inApp ? "/app/talent/opportunities/$id" : "/opportunities/$id"} params={{ id: op.id }} className="group flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{op.type}</Badge>
          {op.source === "external" ? (
            <Badge variant="info" className="gap-1"><ExternalLink className="size-3" /> External</Badge>
          ) : (
            <Badge variant="success">Apply on SkillBridge</Badge>
          )}
          {match && <Badge variant={match.eligible ? "clay" : "muted"} className="gap-1"><Sparkles className="size-3" />{match.eligible ? `${match.score}% match` : "Not eligible"}</Badge>}
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary">{op.title}</h3>
        <p className="text-sm text-muted-foreground">{op.orgName}</p>
        <p className="mt-3 line-clamp-2 text-sm">{op.summary}</p>
        {match && match.reasons[0] && <p className="mt-2 text-xs text-muted-foreground">Why: {match.reasons[0]}</p>}
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="size-3" />{op.location} · {op.workArrangement}</span>
          <span className="flex items-center gap-1"><Calendar className="size-3" />Closes {op.deadline}</span>
          {op.compensation && <span className="flex items-center gap-1"><Wallet className="size-3" />{op.compensation}</span>}
        </div>
      </Link>
      {action && <div className="border-t px-5 py-3">{action}</div>}
    </div>
  );
}
