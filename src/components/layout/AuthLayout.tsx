import type { ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-hero p-12 text-primary-foreground lg:flex">
        <Logo onDark />
        <div>
          <h2 className="text-3xl font-bold text-primary-foreground">Connecting Skills to Opportunities.</h2>
          <p className="mt-2 text-primary-foreground/70">Building Partnerships for Impact.</p>
        </div>
        <p className="text-xs text-primary-foreground/50">© 2026 SkillBridge Uganda</p>
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
