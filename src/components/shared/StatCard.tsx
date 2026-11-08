import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint?: string | undefined; icon: LucideIcon }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="rounded-lg bg-secondary p-2 text-primary"><Icon className="size-4" /></span>
      </div>
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
