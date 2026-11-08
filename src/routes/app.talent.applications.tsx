import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { PassportView } from "@/components/shared/PassportView";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorState, LoadingGrid } from "@/components/shared/States";
import { canWithdraw, STATUS_LABELS } from "@/domain/applications";
import { useAction } from "@/hooks/use-action";
import { myApplicationsQuery, withdrawApplication, type ApplicationRow } from "@/services/applications";
import { myClicksQuery } from "@/services/opportunities";

export const Route = createFileRoute("/app/talent/applications")({ component: Apps });

function Apps() {
  const apps = useQuery(myApplicationsQuery());
  const clicks = useQuery(myClicksQuery());
  const [open, setOpen] = useState<ApplicationRow | null>(null);
  const withdraw = useAction(withdrawApplication, { success: "Application withdrawn" });
  return (
    <>
      <PageHeader data="test" title="My applications" description="Applications submitted through SkillBridge are kept separate from external sites you visited." />
      <Tabs defaultValue="internal">
        <TabsList><TabsTrigger value="internal">SkillBridge applications</TabsTrigger><TabsTrigger value="external">External visits</TabsTrigger></TabsList>
        <TabsContent value="internal" className="mt-4">
          {apps.isPending ? <LoadingGrid count={3} /> : apps.isError ? <ErrorState onRetry={() => apps.refetch()} /> : (
            <DataTable rows={apps.data} empty="You haven't applied to anything yet." columns={[
              { header: "Opportunity", cell: (a) => <Link to="/app/talent/opportunities/$id" params={{ id: a.opportunityId }} className="font-medium text-heading hover:text-primary">{a.opportunityTitle}</Link> },
              { header: "Organization", cell: (a) => a.orgName },
              { header: "Submitted", cell: (a) => a.submittedAt },
              { header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
              { header: "", className: "text-right", cell: (a) => (
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setOpen(a)}>Details</Button>
                  {canWithdraw(a.status) && <Button size="sm" variant="outline" disabled={withdraw.isPending} onClick={() => { if (window.confirm(`Withdraw your application to ${a.opportunityTitle}? This can't be undone.`)) withdraw.mutate(a.id); }}>Withdraw</Button>}
                </div>
              ) },
            ]} />
          )}
        </TabsContent>
        <TabsContent value="external" className="mt-4">
          {clicks.isPending ? <LoadingGrid count={3} /> : clicks.isError ? <ErrorState onRetry={() => clicks.refetch()} /> : (
            <DataTable rows={clicks.data} empty="You haven't opened any external opportunities." columns={[
              { header: "Opportunity", cell: (c) => c.opportunity ? <Link to="/app/talent/opportunities/$id" params={{ id: c.opportunityId }} className="font-medium text-heading hover:text-primary">{c.opportunity.title}</Link> : "Removed" },
              { header: "Visited official site", cell: (c) => new Date(c.at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) },
              { header: "Note", cell: () => <span className="text-sm text-muted-foreground">Not an application — apply on the official site</span> },
            ]} />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>{open.opportunityTitle}</DialogTitle>
                <DialogDescription>{open.orgName} · submitted {open.submittedAt}</DialogDescription>
              </DialogHeader>
              <section>
                <h3 className="mb-2 font-semibold">Status history</h3>
                <ol className="space-y-2 border-l pl-4">
                  {open.history.map((h, i) => (
                    <li key={i} className="text-sm"><span className="font-medium text-heading">{STATUS_LABELS[h.status]}</span> <span className="text-muted-foreground">· {h.at.slice(0, 10)} · by {h.by === "talent" ? "you" : open.orgName}</span></li>
                  ))}
                </ol>
              </section>
              {open.coverNote && <section><h3 className="mb-1 font-semibold">Your note</h3><p className="text-sm">{open.coverNote}</p></section>}
              <section><h3 className="mb-2 font-semibold">What you shared</h3><PassportView data={open.snapshot} /></section>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
