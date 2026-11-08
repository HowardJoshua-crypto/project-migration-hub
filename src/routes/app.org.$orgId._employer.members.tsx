import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { orgMembers } from "@/mocks/data";

export const Route = createFileRoute("/app/org/$orgId/_employer/members")({
  component: () => (
    <>
      <PageHeader title="Team members" description="Only Owners and Managers can invite, remove or change member roles." actions={<Button onClick={() => toast.info("Invitations connect in Phase 3")}>Invite member</Button>} />
      <DataTable rows={orgMembers} columns={[
        { header: "Name", cell: (m) => <span className="font-medium text-heading">{m.name}</span> },
        { header: "Email", cell: (m) => m.email },
        { header: "Role", cell: (m) => <Badge variant="secondary">{m.role}</Badge> },
      ]} />
    </>
  ),
});
