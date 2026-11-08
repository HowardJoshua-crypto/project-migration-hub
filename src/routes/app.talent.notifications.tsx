import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/States";
import { notifications } from "@/mocks/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/talent/notifications")({ component: Notes });

function Notes() {
  const [items, setItems] = useState(notifications);
  return (
    <>
      <PageHeader title="Notifications" actions={<Button variant="outline" onClick={() => setItems(items.map((i) => ({ ...i, unread: false })))}>Mark all as read</Button>} />
      {items.length === 0 ? <EmptyState title="You're all caught up" /> : (
        <ul className="divide-y rounded-xl border bg-card">
          {items.map((n) => (
            <li key={n.id} className={cn("flex items-start gap-3 p-4", n.unread && "bg-accent/40")}>
              <Bell className="mt-0.5 size-4 text-primary" />
              <div className="flex-1"><div className={cn(n.unread && "font-medium text-heading")}>{n.title}</div><div className="text-xs text-muted-foreground">{n.time}</div></div>
              {n.unread && <span className="mt-2 size-2 rounded-full bg-primary" aria-label="Unread" />}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
