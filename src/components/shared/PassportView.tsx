import type * as React from "react";
import { BadgeCheck, Briefcase, Clock, ExternalLink, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { PassportSnapshot } from "@/domain/types";

const initials = (name: string) => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const period = (s: string, e: string) => `${s} – ${e || "present"}`;

/** Renders exactly the sections present in `data` — a public view, a preview, or a frozen application snapshot. */
export function PassportView({ data, note }: { data: PassportSnapshot; note?: string | undefined }) {
  const empty = !data.about && !data.education && !data.experience && !data.skills && !data.credentials && !data.portfolio && !data.contact;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-soft sm:flex-row sm:items-center">
        <Avatar className="size-16"><AvatarFallback className="bg-primary text-lg text-primary-foreground">{initials(data.name)}</AvatarFallback></Avatar>
        <div>
          <h2 className="text-2xl font-bold">{data.name}</h2>
          <p className="text-muted-foreground">{data.headline}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{data.location}</p>
        </div>
      </div>
      {note && <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">{note}</p>}
      {empty && <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No sections are visible in this view.</p>}
      {data.contact && (
        <Block title="Contact details">
          <p className="flex items-center gap-2 text-sm"><Mail className="size-4 text-primary" />{data.contact.email}</p>
          <p className="mt-1 flex items-center gap-2 text-sm"><Phone className="size-4 text-primary" />{data.contact.phone}</p>
        </Block>
      )}
      {data.about !== undefined && <Block title="About"><p>{data.about || "—"}</p></Block>}
      {data.education && (
        <Block title="Education">
          <div className="space-y-3">{data.education.map((e) => <div key={e.id} className="flex gap-3"><GraduationCap className="size-5 shrink-0 text-primary" /><div><div className="font-medium">{e.award}</div><div className="text-sm text-muted-foreground">{e.institution} · {e.level} · {e.startYear} – {e.endYear}</div></div></div>)}</div>
        </Block>
      )}
      {data.experience && (
        <Block title="Experience">
          <div className="space-y-3">{data.experience.map((x) => <div key={x.id} className="flex gap-3"><Briefcase className="size-5 shrink-0 text-primary" /><div><div className="font-medium">{x.role} · {x.org}</div><div className="text-xs text-muted-foreground">{period(x.start, x.end)}</div>{x.summary && <p className="mt-1 text-sm">{x.summary}</p>}</div></div>)}</div>
        </Block>
      )}
      {data.skills && <Block title="Skills"><div className="flex flex-wrap gap-2">{data.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</div></Block>}
      {data.credentials && (
        <Block title="Certificates & credentials">
          <ul className="space-y-2">{data.credentials.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3">
              <span><span className="font-medium">{c.title}</span> <span className="text-sm text-muted-foreground">· {c.issuer}</span></span>
              {c.status === "verified" ? <Badge variant="success" className="gap-1"><BadgeCheck className="size-3" />Verified</Badge> : <Badge variant="warning" className="gap-1"><Clock className="size-3" />Pending</Badge>}
            </li>
          ))}</ul>
        </Block>
      )}
      {data.portfolio && (
        <Block title="Portfolio">
          <div className="grid gap-3 sm:grid-cols-2">{data.portfolio.map((p) => (
            <div key={p.id} className="rounded-lg border p-4">
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-muted-foreground">{p.summary}</div>
              {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary underline">View project <ExternalLink className="size-3" /></a>}
            </div>
          ))}</div>
        </Block>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border bg-card p-6"><h3 className="mb-3 font-semibold">{title}</h3>{children}</section>;
}
