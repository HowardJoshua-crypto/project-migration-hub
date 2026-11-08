import type { ReactNode } from "react";

export function SectionCard({ title, action, children }: { title: string; action?: ReactNode | undefined; children: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
