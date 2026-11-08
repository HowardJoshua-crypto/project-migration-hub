import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OpportunitySearch({ initial = "", to = "/opportunities" }: { initial?: string | undefined; to?: "/opportunities" | "/app/talent/opportunities" }) {
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();
  return (
    <form
      role="search"
      onSubmit={(e) => { e.preventDefault(); navigate({ to, search: { q: q.trim() || undefined } }); }}
      className="flex w-full gap-2 rounded-xl border bg-card p-2 shadow-soft"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by role, skill, organisation or town" className="h-11 border-0 pl-9 shadow-none focus-visible:ring-0" aria-label="Search opportunities" />
      </div>
      <Button type="submit" size="lg">Search</Button>
    </form>
  );
}
