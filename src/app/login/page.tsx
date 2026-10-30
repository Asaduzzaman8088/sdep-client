import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to ShebaSetu to create and join community service events.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to join service days, manage your events, and keep your community moving."
      footer={
        <>
          New to ShebaSetu?{" "}
          <Link href="/register" className="link link-primary font-medium">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
