import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SimpleTablePage } from "@/components/shared/SimpleTablePage";
import { adminQueues } from "@/mocks/data";

export const Route = createFileRoute("/app/admin/users")({
  component: () => <SimpleTablePage title="User management" description="Only administrators can assign privileged roles. Every change is audit-logged." rows={adminQueues.users} columns={[
    { header: "Name", cell: (u) => <span className="font-medium text-heading">{u.name}</span> },
    { header: "Email", cell: (u) => u.email },
    { header: "Roles", cell: (u) => <div className="flex gap-1">{u.roles.map((r) => <Badge key={r} variant="secondary">{r}</Badge>)}</div> },
    { header: "Status", cell: (u) => <StatusBadge status={u.status} /> },
    { header: "", className: "text-right", cell: () => <Button size="sm" variant="outline" onClick={() => toast.info("Role management connects in Phase 4")}>Manage roles</Button> },
  ]} />,
});
