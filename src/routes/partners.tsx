import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, GraduationCap, LineChart } from "lucide-react";
import { InfoPage } from "@/components/shared/InfoPage";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Institutional partners — SkillBridge Uganda" },
      { name: "description", content: "Universities, NGOs, government and development organisations partnering to improve youth employability in Uganda (SDG 17)." },
      { property: "og:title", content: "Partners — SkillBridge Uganda" },
      { property: "og:description", content: "Partner with SkillBridge to improve youth employability in Uganda." },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Partnerships for impact · SDG 17"
      title="Build Uganda's talent pipeline together."
      intro="Universities, NGOs, government agencies and development organisations use SkillBridge to run programmes, verify credentials and measure employment outcomes."
      cta={{ label: "Propose a partnership", to: "/signup" }}
      features={[
        { icon: GraduationCap, title: "Programmes & cohorts", text: "Run employability initiatives with learners who consent to share their progress." },
        { icon: BadgeCheck, title: "Credential verification", text: "Confirm transcripts and certificates issued by your institution." },
        { icon: LineChart, title: "Impact reporting", text: "Track placements — employer-reported and talent-confirmed — for your programmes." },
      ]}
      checklist={["Universities & career offices", "NGOs and community organisations", "Government agencies", "Development partners and funders"]}
    />
  ),
});
