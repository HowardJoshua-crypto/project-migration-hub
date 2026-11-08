import { Badge } from "@/components/ui/badge";
import { FlaskConical, HardDrive } from "lucide-react";

/** Marks any screen still showing sample data that can't be changed yet. */
export function MockBadge({ label = "Sample data" }: { label?: string | undefined }) {
  return (
    <Badge variant="mock" className="gap-1" title="Sample data for interface preview. Not real records.">
      <FlaskConical className="size-3" /> {label}
    </Badge>
  );
}

/** Marks screens whose changes are saved only in this browser's test-data store (Phase 3). */
export function TestDataBadge() {
  return (
    <Badge variant="mock" className="gap-1" title="Test data. Your changes are kept in this browser only — not shared with anyone and not stored on a server yet.">
      <HardDrive className="size-3" /> Test data · saved in this browser only
    </Badge>
  );
}
