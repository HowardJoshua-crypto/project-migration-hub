import type * as React from "react";
import { BadgeCheck, Clock, GraduationCap, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { talent } from "@/mocks/data";

/** Renders only the passport sections passed in `visible` — mirrors the sanitized public view / application snapshot. */
export function PassportView({ visible, note }: { visible: string[]; note?: string | undefined }) {
  const show = (k: string) => visible.includes(k);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-soft sm:flex-row sm:items-center">
        <Avatar className="size-16"><AvatarFallback className="bg-primary text-lg text-primary-foreground">AN</AvatarFallback></Avatar>
        <div>
          <h2 className="text-2xl font-bold">{talent.name}</h2>
          <p className="text-muted-foreground">{talent.headline}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{talent.location}</p>
        </div>
      </div>
      {note && <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">{note}</p>}
      {show("about") && <Block title="About"><p>{talent.about}</p></Block>}
      {show("education") && (
        <Block title="Education">
          {talent.education.map((e) => <div key={e.school} className="flex gap-3"><GraduationCap className="size-5 text-primary" /><div><div className="font-medium">{e.award}</div><div className="text-sm text-muted-foreground">{e.school} · {e.years}</div></div></div>)}
        </Block>
      )}
      {show("skills") && <Block title="Skills"><div className="flex flex-wrap gap-2">{talent.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</div></Block>}
      {show("credentials") && (
        <Block title="Credentials">
          <ul className="space-y-2">{talent.credentials.map((c) => (
            <li key={c.title} className="flex items-center justify-between gap-3">
              <span><span className="font-medium">{c.title}</span> <span className="text-sm text-muted-foreground">· {c.issuer}</span></span>
              {c.status === "verified" ? <Badge variant="success" className="gap-1"><BadgeCheck className="size-3" />Verified</Badge> : <Badge variant="warning" className="gap-1"><Clock className="size-3" />Pending</Badge>}
            </li>
          ))}</ul>
        </Block>
      )}
      {show("portfolio") && <Block title="Portfolio"><div className="grid gap-3 sm:grid-cols-2">{talent.portfolio.map((p) => <div key={p.title} className="rounded-lg border p-4"><div className="font-medium">{p.title}</div><div className="text-sm text-muted-foreground">{p.summary}</div></div>)}</div></Block>}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border bg-card p-6"><h3 className="mb-3 font-semibold">{title}</h3>{children}</section>;
}
