import type * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/shared/FormField";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { PreviewNotice } from "@/components/shared/PreviewNotice";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — SkillBridge Uganda" },
      { name: "description", content: "Sign in to your SkillBridge Uganda account." },
      { property: "og:title", content: "Sign in — SkillBridge Uganda" },
      { property: "og:description", content: "Sign in to your SkillBridge Uganda account." },
    ],
  }),
  component: Login,
});

function Login() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(String(f.get("email")))) next["email"] = "Enter a valid email address.";
    if (String(f.get("password")).length < 8) next["password"] = "Password must be at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length === 0) toast.info("Sign-in isn't connected yet", { description: "Secure accounts arrive in the Database & Authentication phase." });
  }
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your SkillBridge account.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field id="email" label="Email" type="email" error={errors["email"]} />
        <Field id="password" label="Password" type="password" error={errors["password"]} />
        <Button type="submit" className="w-full" size="lg">Sign in</Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => toast.info("Google sign-in arrives with accounts.")}>Continue with Google</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">New to SkillBridge? <Link to="/signup" className="font-medium text-primary hover:underline">Create an account</Link></p>
      <PreviewNotice />
    </AuthLayout>
  );
}

