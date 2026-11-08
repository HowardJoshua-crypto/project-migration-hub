import type { ReactNode } from "react";
import { MockBadge, TestDataBadge } from "./MockBadge";

/** `data`: "sample" = read-only sample rows, "test" = editable browser test data, "none" = no badge. */
export function PageHeader({ title, description, actions, mock = true, data }: { title: string; description?: string | undefined; actions?: ReactNode | undefined; mock?: boolean; data?: "sample" | "test" | "none" }) {
  const kind = data ?? (mock ? "sample" : "none");
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">{kind === "sample" ? <MockBadge /> : kind === "test" ? <TestDataBadge /> : null}</div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
