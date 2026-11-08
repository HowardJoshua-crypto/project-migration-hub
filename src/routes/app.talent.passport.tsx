import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { seedTalent } from "@/mocks/data";

const tabs = [
  { to: "/app/talent/passport", label: "Overview", exact: true },
  { to: "/app/talent/passport/personal", label: "Profile" },
  { to: "/app/talent/passport/education", label: "Education" },
  { to: "/app/talent/passport/skills", label: "Skills" },
  { to: "/app/talent/passport/experience", label: "Experience" },
  { to: "/app/talent/passport/portfolio", label: "Portfolio" },
  { to: "/app/talent/passport/credentials", label: "Certificates" },
  { to: "/app/talent/passport/privacy", label: "Privacy" },
  { to: "/app/talent/passport/preview", label: "Preview" },
] as const;

export const Route = createFileRoute("/app/talent/passport")({ component: PassportLayout });

function PassportLayout() {
  return (
    <>
      <PageHeader data="test" title="Digital Talent Passport" description="Your professional identity. Control who sees each section from Privacy." actions={<Button asChild variant="outline"><Link to="/talent/$handle" params={{ handle: seedTalent.handle }}><Eye />View public passport</Link></Button>} />
      <nav className="-mx-1 mb-6 flex gap-1 overflow-x-auto border-b pb-px" aria-label="Passport sections">
        {tabs.map((t) => (
          <Link key={t.to} to={t.to} activeOptions={{ exact: "exact" in t }} className="whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground hover:text-heading" activeProps={{ className: "border-primary! text-heading" }}>
            {t.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </>
  );
}
