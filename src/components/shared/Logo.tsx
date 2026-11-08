import { Link } from "@tanstack/react-router";

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">SB</span>
      <span className={`font-display text-lg font-bold ${onDark ? "text-sidebar-foreground" : "text-heading"}`}>
        SkillBridge<span className="text-primary"> Uganda</span>
      </span>
    </Link>
  );
}
