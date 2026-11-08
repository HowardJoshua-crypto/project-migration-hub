import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { opportunitiesQuery, type OpportunityFilters } from "@/services/opportunities";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunitySearch } from "./OpportunitySearch";
import { EmptyState, ErrorState, LoadingGrid } from "./States";

const types = ["Internship", "Graduate job", "Fellowship", "Volunteer", "Apprenticeship", "Scholarship"];

export function OpportunityBrowser({ filters, onChange, searchTo }: { filters: OpportunityFilters; onChange: (f: OpportunityFilters) => void; searchTo: "/opportunities" | "/app/talent/opportunities" }) {
  const { data, isPending, isError, refetch } = useQuery(opportunitiesQuery(filters));
  return (
    <div className="space-y-6">
      <OpportunitySearch key={filters.q ?? ""} initial={filters.q} to={searchTo} />
      <div className="flex flex-wrap gap-3">
        <Select value={filters.type ?? "all"} onValueChange={(v) => onChange({ ...filters, type: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-48 bg-card" aria-label="Opportunity type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.kind ?? "all"} onValueChange={(v) => onChange({ ...filters, kind: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-56 bg-card" aria-label="How to apply"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All application methods</SelectItem>
            <SelectItem value="direct">Apply on SkillBridge</SelectItem>
            <SelectItem value="external">External (official site)</SelectItem>
          </SelectContent>
        </Select>
        {(filters.q || filters.type || filters.kind) && <Button variant="ghost" onClick={() => onChange({})}>Clear filters</Button>}
      </div>
      {isPending ? <LoadingGrid /> : isError ? <ErrorState onRetry={() => refetch()} /> : data.length === 0 ? (
        <EmptyState title="No opportunities match" text="Try a different keyword or clear your filters." action={<Button variant="outline" onClick={() => onChange({})}>Clear filters</Button>} />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{data.length} opportunities</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{data.map((op) => <OpportunityCard key={op.id} op={op} inApp={searchTo !== "/opportunities"} />)}</div>
        </>
      )}
    </div>
  );
}

export function validateOpportunitySearch(s: Record<string, unknown>): { q?: string | undefined; type?: string | undefined; kind?: string | undefined } {
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  return { q: str(s["q"]), type: str(s["type"]), kind: str(s["kind"]) };
}
