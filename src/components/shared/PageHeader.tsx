import type { ReactNode } from "react";
import { MockBadge } from "./MockBadge";

export function PageHeader({ title, description, actions, mock = true }: { title: string; description?: string | undefined; actions?: ReactNode | undefined; mock?: boolean }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">{mock && <MockBadge />}</div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
