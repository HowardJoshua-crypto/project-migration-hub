import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { externalClicks, myApplications } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/applications")({ component: Apps });

const withdrawable = new Set(["submitted", "screening", "interview"]);

function Apps() {
  return (
    <>
      <PageHeader title="My applications" description="Applications submitted through SkillBridge are kept separate from external sites you visited." />
      <Tabs defaultValue="internal">
        <TabsList><TabsTrigger value="internal">SkillBridge applications</TabsTrigger><TabsTrigger value="external">External visits</TabsTrigger></TabsList>
        <TabsContent value="internal" className="mt-4">
          <DataTable rows={myApplications} columns={[
            { header: "Opportunity", cell: (a) => <span className="font-medium text-heading">{a.opportunity}</span> },
            { header: "Organization", cell: (a) => a.org },
            { header: "Submitted", cell: (a) => a.submitted },
            { header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
            { header: "", className: "text-right", cell: (a) => withdrawable.has(a.status) ? <Button size="sm" variant="outline" onClick={() => toast.info("Withdrawals connect in Phase 3")}>Withdraw</Button> : null },
          ]} />
        </TabsContent>
        <TabsContent value="external" className="mt-4">
          <DataTable rows={externalClicks} empty="You haven't opened any external opportunities." columns={[
            { header: "Opportunity", cell: (c) => c.opportunity },
            { header: "Visited official site", cell: (c) => c.clicked },
            { header: "Note", cell: () => <span className="text-sm text-muted-foreground">Not an application — apply on the official site</span> },
          ]} />
        </TabsContent>
      </Tabs>
    </>
  );
}
