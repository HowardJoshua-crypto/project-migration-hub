import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/org/$orgId")({
  head: () => ({ meta: [{ title: "Organization portal — SkillBridge Uganda" }, { name: "robots", content: "noindex" }] }),
  component: () => <Outlet />,
});
