import { createFileRoute } from "@tanstack/react-router";
import { Globe2, HeartHandshake, Target } from "lucide-react";
import { InfoPage } from "@/components/shared/InfoPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SkillBridge Uganda" },
      { name: "description", content: "SkillBridge Uganda is a digital employability and partnership ecosystem for Ugandan students and graduates." },
      { property: "og:title", content: "About SkillBridge Uganda" },
      { property: "og:description", content: "A digital employability and partnership ecosystem for Ugandan students and graduates." },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="About SkillBridge"
      title="Connecting Skills to Opportunities. Building Partnerships for Impact."
      intro="Every year thousands of capable Ugandan graduates struggle to be seen. SkillBridge connects them with employers, opportunities and the institutions that support them — on one trusted platform."
      cta={{ label: "Explore Opportunities", to: "/opportunities" }}
      features={[
        { icon: Target, title: "Our mission", text: "Make every young Ugandan's skills visible, verifiable and connected to real opportunity." },
        { icon: HeartHandshake, title: "Trust first", text: "Verified organisations, verified credentials and privacy controls owned by the talent." },
        { icon: Globe2, title: "SDG 17", text: "We bring education, industry and development partners together to deliver measurable outcomes." },
      ]}
    />
  ),
});
