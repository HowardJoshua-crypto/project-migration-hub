import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SimpleTablePage } from "@/components/shared/SimpleTablePage";
import { adminQueues } from "@/mocks/data";

export const Route = createFileRoute("/app/admin/credentials")({
  component: () => <SimpleTablePage title="Credential verification" rows={adminQueues.credentials} columns={[
    { header: "Talent", cell: (c) => <span className="font-medium text-heading">{c.talent}</span> },
    { header: "Credential", cell: (c) => c.credential }, { header: "Issuer", cell: (c) => c.issuer }, { header: "Submitted", cell: (c) => c.submitted },
    { header: "", className: "text-right", cell: () => <Button size="sm" onClick={() => toast.success("Verified (preview)")}>Verify</Button> },
  ]} />,
});
