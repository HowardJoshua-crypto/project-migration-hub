import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/shared/States";
import { useAction } from "@/hooks/use-action";
import { markAllNotificationsRead, markNotificationRead, notificationsQuery } from "@/services/talent-extras";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/talent/notifications")({ component: Notes });

const timeAgo = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

function Notes() {
  const { data, isPending, isError, refetch } = useQuery(notificationsQuery());
  const markAll = useAction(markAllNotificationsRead, {});
  const markOne = useAction(markNotificationRead, {});
  const unread = data?.filter((n) => n.unread).length ?? 0;
  return (
    <>
      <PageHeader data="test" title="Notifications" description={unread ? `${unread} unread` : undefined} actions={<Button variant="outline" disabled={!unread || markAll.isPending} onClick={() => markAll.mutate(undefined)}>Mark all as read</Button>} />
      {isPending ? <LoadingGrid count={3} /> : isError ? <ErrorState onRetry={() => refetch()} /> : data.length === 0 ? <EmptyState title="You're all caught up" /> : (
        <ul className="divide-y rounded-xl border bg-card">
          {data.map((n) => (
            <li key={n.id} className={cn("flex items-start gap-3 p-4", n.unread && "bg-accent/40")}>
              <Bell className="mt-0.5 size-4 text-primary" />
              <div className="flex-1">
                <div className={cn(n.unread && "font-medium text-heading")}>{n.title}</div>
                {n.body && <div className="text-sm text-muted-foreground">{n.body}</div>}
                <div className="text-xs text-muted-foreground">{timeAgo(n.at)}</div>
              </div>
              {n.unread && <Button size="sm" variant="ghost" onClick={() => markOne.mutate(n.id)}>Mark read</Button>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
