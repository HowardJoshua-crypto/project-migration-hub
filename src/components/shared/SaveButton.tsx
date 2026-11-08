import { useQuery } from "@tanstack/react-query";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { savedIdsQuery, toggleSaved } from "@/services/talent-extras";

/** Save / unsave toggle for the current talent. */
export function SaveButton({ opportunityId, className, size }: { opportunityId: string; className?: string; size?: "sm" | "default" }) {
  const { data: ids } = useQuery(savedIdsQuery());
  const saved = !!ids?.includes(opportunityId);
  const toggle = useAction(toggleSaved, { success: (now) => (now ? "Saved to your list" : "Removed from saved") });
  return (
    <Button variant="outline" size={size} className={className} aria-pressed={saved} disabled={!ids || toggle.isPending} onClick={() => toggle.mutate(opportunityId)}>
      {saved ? <BookmarkCheck /> : <Bookmark />}{saved ? "Saved" : "Save"}
    </Button>
  );
}
