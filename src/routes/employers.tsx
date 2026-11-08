import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, ShieldCheck, Users } from "lucide-react";
import { InfoPage } from "@/components/shared/InfoPage";

export const Route = createFileRoute("/employers")({
  head: () => ({
    meta: [
      { title: "Hire Ugandan graduates — SkillBridge Uganda for employers" },
      { name: "description", content: "Post internships and graduate jobs, review verified Talent Passports as a team and hire young talent in Uganda." },
      { property: "og:title", content: "For employers — SkillBridge Uganda" },
      { property: "og:description", content: "Post opportunities and review verified Talent Passports as a team." },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For employers"
      title="Hire young talent you can trust."
      intro="Create a verified organisation profile, post opportunities and review applicants with structured, consented passport snapshots."
      cta={{ label: "Register your organisation", to: "/signup" }}
      features={[
        { icon: ShieldCheck, title: "Verified organisations", text: "Verification builds candidate trust and keeps the platform free of fraudulent listings." },
        { icon: Users, title: "Team hiring", text: "Owners, managers, recruiters and reviewers each get the right level of access." },
        { icon: BarChart3, title: "Hiring analytics", text: "See views, applications and conversion across all your opportunities." },
      ]}
      checklist={["Post internships, graduate jobs and apprenticeships", "Review exactly what candidates chose to share", "Move applicants through a clear pipeline", "Discover talent with public passports"]}
    />
  ),
});
