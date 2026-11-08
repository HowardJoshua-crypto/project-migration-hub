import { AlertTriangle, CheckCircle2, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string | undefined; action?: ReactNode | undefined }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-14 text-center">
      <Inbox className="size-10 text-muted-foreground" />
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ text = "We couldn't load this right now.", onRetry }: { text?: string | undefined; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <AlertTriangle className="size-10 text-destructive" />
      <p className="mt-3 font-medium">{text}</p>
      {onRetry && <Button variant="outline" className="mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function SuccessState({ title, text, action }: { title: string; text?: string | undefined; action?: ReactNode | undefined }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-success/30 bg-success/5 px-6 py-12 text-center">
      <CheckCircle2 className="size-10 text-success" />
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
