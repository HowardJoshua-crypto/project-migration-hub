import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { matchOpportunity } from "@/domain/matching";
import { OPPORTUNITY_TYPES, WORK_ARRANGEMENTS } from "@/domain/types";
import { opportunitiesQuery, type OpportunityFilters } from "@/services/opportunities";
import { myPassportQuery } from "@/services/passport";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunitySearch } from "./OpportunitySearch";
import { EmptyState, ErrorState, LoadingGrid } from "./States";

type Filters = OpportunityFilters & { sort?: string | undefined };

function FilterSelect({ label, value, all, options, onChange, width = "w-48" }: { label: string; value: string | undefined; all: string; options: readonly (string | [string, string])[]; onChange: (v: string | undefined) => void; width?: string }) {
  return (
    <Select value={value ?? "all"} onValueChange={(v) => onChange(v === "all" ? undefined : v)}>
      <SelectTrigger className={`${width} bg-card`} aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{all}</SelectItem>
        {options.map((o) => { const [v, l] = typeof o === "string" ? [o, o] : o; return <SelectItem key={v} value={v}>{l}</SelectItem>; })}
      </SelectContent>
    </Select>
  );
}

export function OpportunityBrowser({ filters, onChange, searchTo }: { filters: Filters; onChange: (f: Filters) => void; searchTo: "/opportunities" | "/app/talent/opportunities" }) {
  const inApp = searchTo !== "/opportunities";
  const { sort, ...query } = filters;
  const { data, isPending, isError, refetch } = useQuery(opportunitiesQuery(query));
  const passport = useQuery({ ...myPassportQuery(), enabled: inApp });
  const set = (k: keyof Filters) => (v: string | undefined) => onChange({ ...filters, [k]: v });
  const active = !!(filters.q || filters.type || filters.source || filters.arrangement);

  const rows = (data ?? []).map((op) => ({ op, match: inApp && passport.data ? matchOpportunity(passport.data, op) : undefined }));
  if (inApp && sort === "match") rows.sort((a, b) => Number(b.match?.eligible) - Number(a.match?.eligible) || (b.match?.score ?? 0) - (a.match?.score ?? 0));

  return (
    <div className="space-y-6">
      <OpportunitySearch key={filters.q ?? ""} initial={filters.q} to={searchTo} />
      <div className="flex flex-wrap gap-3">
        <FilterSelect label="Opportunity type" value={filters.type} all="All types" options={OPPORTUNITY_TYPES} onChange={set("type")} width="w-56" />
        <FilterSelect label="How to apply" value={filters.source} all="All application methods" options={[["internal", "Apply on SkillBridge"], ["external", "External (official site)"]]} onChange={set("source")} width="w-56" />
        <FilterSelect label="Work arrangement" value={filters.arrangement} all="Any arrangement" options={WORK_ARRANGEMENTS} onChange={set("arrangement")} />
        {inApp && <FilterSelect label="Sort" value={sort} all="Closing soonest" options={[["match", "Best match for me"]]} onChange={set("sort")} />}
        {active && <Button variant="ghost" onClick={() => onChange({})}>Clear filters</Button>}
      </div>
      {isPending ? <LoadingGrid /> : isError ? <ErrorState onRetry={() => refetch()} /> : rows.length === 0 ? (
        <EmptyState title="No opportunities match" text="Try a different keyword or clear your filters." action={<Button variant="outline" onClick={() => onChange({})}>Clear filters</Button>} />
      ) : (
        <>
          <p className="text-sm text-muted-foreground" aria-live="polite">{rows.length} {rows.length === 1 ? "opportunity" : "opportunities"}</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{rows.map(({ op, match }) => <OpportunityCard key={op.id} op={op} inApp={inApp} match={match} />)}</div>
        </>
      )}
    </div>
  );
}

export function validateOpportunitySearch(s: Record<string, unknown>): { q?: string | undefined; type?: string | undefined; source?: string | undefined; arrangement?: string | undefined; sort?: string | undefined } {
  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  return { q: str(s["q"]), type: str(s["type"]), source: str(s["source"]), arrangement: str(s["arrangement"]), sort: str(s["sort"]) };
}
