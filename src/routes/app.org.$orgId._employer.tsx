import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { employerArea } from "@/components/layout/nav";

export const Route = createFileRoute("/app/org/$orgId/_employer")({
  component: () => <AppShell area={employerArea(Route.useParams().orgId)}><Outlet /></AppShell>,
});
