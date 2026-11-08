import { Link } from "@tanstack/react-router";
import { Info } from "lucide-react";

/** Explains that sign-in is not live yet and offers the portal previews instead (no fake auth). */
export function PreviewNotice() {
  return (
    <div className="mt-6 rounded-lg border border-info/30 bg-info/5 p-4 text-sm">
      <p className="flex items-center gap-2 font-medium"><Info className="size-4 text-info" />Accounts open in a later phase</p>
      <p className="mt-1 text-muted-foreground">Meanwhile, preview the portals:</p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <Link to="/app/talent" className="font-medium text-primary hover:underline">Talent</Link>
        <Link to="/app/org/$orgId" params={{ orgId: "pearl-fintech" }} className="font-medium text-primary hover:underline">Employer</Link>
        <Link to="/app/org/$orgId/partner" params={{ orgId: "makerere" }} className="font-medium text-primary hover:underline">Partner</Link>
        <Link to="/app/admin" className="font-medium text-primary hover:underline">Admin</Link>
      </div>
    </div>
  );
}
