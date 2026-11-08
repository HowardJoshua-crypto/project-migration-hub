import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/PublicLayout";

export interface Feature { icon: LucideIcon; title: string; text: string }

export function InfoPage({ eyebrow, title, intro, features, checklist, cta, children }: {
  eyebrow: string; title: string; intro: string; features: Feature[]; checklist?: string[];
  cta: { label: string; to: "/signup" | "/opportunities" | "/partners" }; children?: ReactNode | undefined;
}) {
  return (
    <PublicLayout>
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold text-primary-foreground md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">{intro}</p>
          <Button asChild size="lg" className="mt-8"><Link to={cta.to}>{cta.label}</Link></Button>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border bg-card p-6 shadow-soft">
            <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground"><f.icon className="size-5" /></span>
            <h2 className="mt-4 text-lg font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>
      {checklist && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-2xl border bg-card p-8">
            <ul className="grid gap-3 md:grid-cols-2">
              {checklist.map((c) => <li key={c} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />{c}</li>)}
            </ul>
          </div>
        </section>
      )}
      {children}
    </PublicLayout>
  );
}
