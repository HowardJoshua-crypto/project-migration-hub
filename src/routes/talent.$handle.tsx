import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { MockBadge } from "@/components/shared/MockBadge";
import { PassportView } from "@/components/shared/PassportView";
import { talent } from "@/mocks/data";

export const Route = createFileRoute("/talent/$handle")({
  head: () => ({
    meta: [
      { title: "Public Talent Passport — SkillBridge Uganda" },
      { name: "description", content: "A public Digital Talent Passport on SkillBridge Uganda." },
      { property: "og:title", content: "Public Talent Passport — SkillBridge Uganda" },
      { property: "og:description", content: "A public Digital Talent Passport on SkillBridge Uganda." },
    ],
  }),
  component: Page,
});

function Page() {
  const publicKeys = talent.sections.filter((s) => s.visibility === "PUBLIC").map((s) => s.key);
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <MockBadge />
        <div className="mt-4"><PassportView visible={publicKeys} note="Only sections marked Public are shown. Contact details, documents and shared-only credentials are never visible here." /></div>
      </div>
    </PublicLayout>
  );
}
