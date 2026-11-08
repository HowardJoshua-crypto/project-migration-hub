import { createFileRoute } from "@tanstack/react-router";
import { FileLock2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EditSection } from "@/components/shared/EditSection";
import { RecordListEditor } from "@/components/shared/RecordListEditor";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WithPassport } from "@/components/shared/WithPassport";
import type { Credential } from "@/domain/types";
import { addCredential, removeItem } from "@/services/passport";

export const Route = createFileRoute("/app/talent/passport/credentials")({ component: Credentials });

function Credentials() {
  return (
    <WithPassport>{(p) => (
      <div className="space-y-6">
        <RecordListEditor<Credential>
          title="Certificates & credentials" noun="Certificate" visibility={p.visibility.credentials} items={p.credentials} canEdit={false}
          emptyText="Add certificates, transcripts and awards. New ones show as pending until verified."
          fields={[
            { name: "title", label: "Certificate name", full: true },
            { name: "issuer", label: "Issued by" },
            { name: "issuedOn", label: "Issue date", type: "date" },
          ]}
          toValues={(c) => ({ title: c.title, issuer: c.issuer, issuedOn: c.issuedOn })}
          save={({ raw }) => addCredential(raw)}
          remove={(id) => removeItem("credentials", id)}
          render={(c) => (
            <div className="flex flex-wrap items-center justify-between gap-2"><div><div className="font-medium text-heading">{c.title}</div><div className="text-sm text-muted-foreground">{c.issuer} · {c.issuedOn}</div></div><StatusBadge status={c.status} /></div>
          )}
        />
        <EditSection title="Private documents" visibility="PRIVATE">
          <div className="flex flex-col items-center rounded-lg border border-dashed p-8 text-center">
            <FileLock2 className="size-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Documents are stored privately. Employers only see files you attach to a specific application.</p>
            <Button variant="outline" className="mt-4" onClick={() => toast.info("File uploads arrive in Phase 4", { description: "Nothing was uploaded." })}><Upload />Upload document</Button>
          </div>
        </EditSection>
      </div>
    )}</WithPassport>
  );
}
