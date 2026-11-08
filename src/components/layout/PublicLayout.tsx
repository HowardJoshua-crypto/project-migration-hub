import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/Logo";

const nav = [
  { to: "/opportunities", label: "Opportunities" },
  { to: "/talent", label: "For talent" },
  { to: "/employers", label: "For employers" },
  { to: "/partners", label: "Partners" },
  { to: "/about", label: "About" },
] as const;

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost"><Link to="/login">Sign in</Link></Button>
            <Button asChild><Link to="/signup">Join SkillBridge</Link></Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-8 flex flex-col gap-4">
                {nav.map((n) => <Link key={n.to} to={n.to} className="text-lg font-medium">{n.label}</Link>)}
                <Button asChild variant="outline"><Link to="/login">Sign in</Link></Button>
                <Button asChild><Link to="/signup">Join SkillBridge</Link></Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo onDark />
            <p className="mt-3 max-w-sm text-sm text-primary-foreground/70">
              Connecting Skills to Opportunities. Building Partnerships for Impact.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold">Platform</span>
            <Link to="/opportunities" search={{}} className="text-primary-foreground/70 hover:text-primary-foreground">Opportunities</Link>
            <Link to="/signup" className="text-primary-foreground/70 hover:text-primary-foreground">Create a passport</Link>
            <Link to="/partners" className="text-primary-foreground/70 hover:text-primary-foreground">Partners</Link>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold">Company</span>
            <Link to="/about" className="text-primary-foreground/70 hover:text-primary-foreground">About</Link>
            <Link to="/employers" className="text-primary-foreground/70 hover:text-primary-foreground">For employers</Link>
            <a href="mailto:hello@skillbridge.ug" className="text-primary-foreground/70 hover:text-primary-foreground">hello@skillbridge.ug</a>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/60">
          © 2026 SkillBridge Uganda · Supporting SDG 17
        </div>
      </footer>
    </div>
  );
}
