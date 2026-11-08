import { createFileRoute, Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/PageHeader";

export const Route = createFileRoute("/app/org/$orgId/_employer/talent")({ component: Discovery });

const people = [
  { name: "Amara Nakato", headline: "BSc Computer Science · Makerere", skills: ["Python", "SQL", "React"], handle: "amara-n" },
  { name: "Brian Okello", headline: "BSc IT · Gulu University", skills: ["Networking", "CCNA"], handle: "amara-n" },
  { name: "Sarah Atim", headline: "BCom Accounting · Kyambogo", skills: ["Excel", "QuickBooks"], handle: "amara-n" },
];

function Discovery() {
  return (
    <>
      <PageHeader title="Talent discovery" description="Only passports their owners made public appear here." />
      <Input placeholder="Search by skill, school or district" className="mb-6 h-11 max-w-lg bg-card" aria-label="Search talent" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <Link key={p.name} to="/talent/$handle" params={{ handle: p.handle }} className="rounded-xl border bg-card p-5 shadow-soft transition hover:shadow-lift">
            <div className="flex items-center gap-3"><Avatar><AvatarFallback className="bg-accent text-accent-foreground">{p.name.split(" ").map((x) => x[0]).join("")}</AvatarFallback></Avatar>
              <div><div className="font-semibold text-heading">{p.name}</div><div className="text-sm text-muted-foreground">{p.headline}</div></div></div>
            <div className="mt-4 flex flex-wrap gap-1">{p.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
