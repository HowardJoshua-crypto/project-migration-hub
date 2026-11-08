import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";

/** Standard passport editor card: visibility badge, body and a save action (saving wired in Phase 3). */
export function EditSection({ title, visibility, children, onAdd }: { title: string; visibility: string; children: ReactNode; onAdd?: string | undefined }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-soft">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><h2 className="text-lg font-semibold">{title}</h2><StatusBadge status={visibility} /></div>
        <div className="flex gap-2">
          {onAdd && <Button variant="outline" onClick={() => toast.info(`${onAdd} — editing connects in Phase 3`)}>{onAdd}</Button>}
          <Button onClick={() => toast.success("Changes saved (preview)", { description: "Nothing is stored until Phase 3." })}>Save</Button>
        </div>
      </div>
      {children}
    </section>
  );
}
