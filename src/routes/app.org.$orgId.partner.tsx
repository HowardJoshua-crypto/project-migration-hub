import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { partnerArea } from "@/components/layout/nav";

export const Route = createFileRoute("/app/org/$orgId/partner")({
  component: () => <AppShell area={partnerArea(Route.useParams().orgId)}><Outlet /></AppShell>,
});
