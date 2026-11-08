import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { adminArea } from "@/components/layout/nav";

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin — SkillBridge Uganda" }, { name: "robots", content: "noindex" }] }),
  component: () => <AppShell area={adminArea}><Outlet /></AppShell>,
});
