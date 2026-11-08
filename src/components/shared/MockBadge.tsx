import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";

/** Marks any screen still showing Phase 2 sample data. */
export function MockBadge({ label = "Sample data" }: { label?: string | undefined }) {
  return (
    <Badge variant="mock" className="gap-1" title="Sample data for interface preview. Not real records.">
      <FlaskConical className="size-3" /> {label}
    </Badge>
  );
}
