import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, FileLock2, IdCard } from "lucide-react";
import { InfoPage } from "@/components/shared/InfoPage";

export const Route = createFileRoute("/talent/")({
  head: () => ({
    meta: [
      { title: "Digital Talent Passport for students & graduates — SkillBridge Uganda" },
      { name: "description", content: "Build one verified professional identity and apply to opportunities across Uganda with full control over what you share." },
      { property: "og:title", content: "For talent — SkillBridge Uganda" },
      { property: "og:description", content: "Build one verified professional identity and apply with full control over what you share." },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For students & graduates"
      title="One passport for your whole professional story."
      intro="Your Digital Talent Passport holds your education, skills, certificates, experience and portfolio — ready to share with employers when you choose."
      cta={{ label: "Create Your Talent Passport", to: "/signup" }}
      features={[
        { icon: IdCard, title: "Digital Talent Passport", text: "Personal details, education, skills, experience and portfolio in one structured profile." },
        { icon: BadgeCheck, title: "Verified credentials", text: "Universities and issuers confirm your certificates so employers can trust them instantly." },
        { icon: FileLock2, title: "You control access", text: "Mark every section Public, Private or Shared only. Documents are never public." },
      ]}
      checklist={["Free for students and fresh graduates", "Apply to direct opportunities in a few clicks", "Track applications and interview invites", "Get alerts for opportunities that match your skills"]}
    />
  ),
});
