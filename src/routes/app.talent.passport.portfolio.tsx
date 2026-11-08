import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { RecordListEditor } from "@/components/shared/RecordListEditor";
import { WithPassport } from "@/components/shared/WithPassport";
import type { PortfolioProject } from "@/domain/types";
import { removeItem, savePortfolio } from "@/services/passport";

export const Route = createFileRoute("/app/talent/passport/portfolio")({ component: Portfolio });

function Portfolio() {
  return (
    <WithPassport>{(p) => (
      <RecordListEditor<PortfolioProject>
        title="Portfolio" noun="Project" visibility={p.visibility.portfolio} items={p.portfolio}
        emptyText="Show what you've built, researched or organised."
        fields={[
          { name: "title", label: "Project title", full: true },
          { name: "summary", label: "Summary", type: "textarea", full: true },
          { name: "url", label: "Link (optional)", type: "url", placeholder: "https://github.com/…", full: true },
        ]}
        toValues={(x) => ({ ...x })}
        save={({ raw, id }) => savePortfolio(raw, id)}
        remove={(id) => removeItem("portfolio", id)}
        render={(x) => (
          <div><div className="font-medium text-heading">{x.title}</div><p className="mt-1 text-sm text-muted-foreground">{x.summary}</p>{x.url && <a href={x.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-primary underline">{x.url}<ExternalLink className="size-3" /></a>}</div>
        )}
      />
    )}</WithPassport>
  );
}
