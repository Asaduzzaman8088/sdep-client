import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";

import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create your ShebaSetu account to organise and join community service events.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="A few details and you are ready to organise your first service day."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="link link-primary font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
