import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { talentArea } from "@/components/layout/nav";

export const Route = createFileRoute("/app/talent")({
  head: () => ({ meta: [{ title: "Talent portal — SkillBridge Uganda" }, { name: "robots", content: "noindex" }] }),
  component: () => <AppShell area={talentArea}><Outlet /></AppShell>,
});
