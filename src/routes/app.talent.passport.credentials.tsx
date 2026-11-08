import { createFileRoute } from "@tanstack/react-router";
import { FileLock2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { EditSection } from "@/components/shared/EditSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { talent } from "@/mocks/data";

export const Route = createFileRoute("/app/talent/passport/credentials")({ component: Credentials });

function Credentials() {
  return (
    <div className="space-y-6">
      <EditSection title="Certificates & credentials" visibility="SHARED_ONLY" onAdd="Add certificate">
        <DataTable rows={talent.credentials} columns={[
          { header: "Credential", cell: (c) => <span className="font-medium text-heading">{c.title}</span> },
          { header: "Issuer", cell: (c) => c.issuer },
          { header: "Verification", cell: (c) => <StatusBadge status={c.status} /> },
        ]} />
      </EditSection>
      <EditSection title="Private documents" visibility="PRIVATE">
        <div className="flex flex-col items-center rounded-lg border border-dashed p-8 text-center">
          <FileLock2 className="size-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Documents are stored privately. Employers only see files you attach to a specific application.</p>
          <Button variant="outline" className="mt-4" onClick={() => toast.info("Secure uploads arrive in Phase 4")}><Upload />Upload document</Button>
        </div>
      </EditSection>
    </div>
  );
}
