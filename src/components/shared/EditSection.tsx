import type { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";

/** Standard passport editor card: title, current visibility and section actions. */
export function EditSection({ title, visibility, children, actions }: { title: string; visibility?: string | undefined; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-soft">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><h2 className="text-lg font-semibold">{title}</h2>{visibility && <StatusBadge status={visibility} />}</div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
