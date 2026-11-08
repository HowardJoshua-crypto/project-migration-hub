import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { TalentProfile } from "@/domain/types";
import { myPassportQuery } from "@/services/passport";
import { ErrorState } from "./States";

/** Loads the current talent's passport and renders children once it's ready. */
export function WithPassport({ children }: { children: (p: TalentProfile) => ReactNode }) {
  const { data, isPending, isError, refetch } = useQuery(myPassportQuery());
  if (isPending) return <div className="space-y-4" aria-busy="true"><Skeleton className="h-24 rounded-xl" /><Skeleton className="h-48 rounded-xl" /></div>;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;
  return <>{children(data)}</>;
}
