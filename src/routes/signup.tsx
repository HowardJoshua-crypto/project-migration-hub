import type * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, GraduationCap, Handshake } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { PreviewNotice } from "@/components/shared/PreviewNotice";
import { Field } from "@/components/shared/FormField";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — SkillBridge Uganda" },
      { name: "description", content: "Join SkillBridge Uganda as talent, an employer or an institutional partner." },
      { property: "og:title", content: "Join SkillBridge Uganda" },
      { property: "og:description", content: "Join as talent, an employer or an institutional partner." },
    ],
  }),
  component: Signup,
});

const kinds = [
  { key: "talent", icon: GraduationCap, title: "Student or graduate", text: "Build a Talent Passport" },
  { key: "employer", icon: Building2, title: "Employer", text: "Post opportunities" },
  { key: "partner", icon: Handshake, title: "Institution / partner", text: "Run programmes" },
];

function Signup() {
  const [kind, setKind] = useState("talent");
  const [errors, setErrors] = useState<Record<string, string>>({});
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (String(f.get("name")).trim().length < 2) next["name"] = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(String(f.get("email")))) next["email"] = "Enter a valid email address.";
    if (String(f.get("password")).length < 8) next["password"] = "Use at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) toast.info("Registration isn't connected yet", { description: "Accounts open in the Database & Authentication phase." });
  }
  return (
    <AuthLayout title="Create your account" subtitle="You can add more roles later — one account works across SkillBridge.">
      <div role="radiogroup" aria-label="Account type" className="mb-6 grid gap-2 sm:grid-cols-3">
        {kinds.map((k) => (
          <button key={k.key} type="button" role="radio" aria-checked={kind === k.key} onClick={() => setKind(k.key)}
            className={cn("rounded-lg border bg-card p-3 text-left transition", kind === k.key ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50")}>
            <k.icon className="size-5 text-primary" />
            <div className="mt-2 text-sm font-semibold text-heading">{k.title}</div>
            <div className="text-xs text-muted-foreground">{k.text}</div>
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field id="name" label="Full name" error={errors["name"]} />
        {kind !== "talent" && <Field id="org" label="Organisation name" placeholder="You can complete details later" />}
        <Field id="email" label="Email" type="email" error={errors["email"]} />
        <Field id="password" label="Password" type="password" error={errors["password"]} />
        <Button type="submit" size="lg" className="w-full">Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link></p>
      <PreviewNotice />
    </AuthLayout>
  );
}
