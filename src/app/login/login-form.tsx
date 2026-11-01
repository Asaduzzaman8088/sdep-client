"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { GoogleButton } from "@/components/auth/google-button";
import { clearAuthTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { safeNextPath } from "@/lib/redirects";
import { loginSchema, type LoginValues } from "@/lib/validators";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const { data: session, isPending } = authClient.useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(nextPath);
    }
  }, [isPending, nextPath, router, session]);

  const onSubmit = async (values: LoginValues) => {
    setIsSubmitting(true);

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(
        error.message ??
          "We could not sign you in. Please check your email and password.",
      );
      setIsSubmitting(false);
      return;
    }

    clearAuthTokenCache();
    toast.success("Signed in successfully. Welcome back.");
    router.replace(nextPath);
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input w-full"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? (
            <span className="mt-1 block text-xs text-error">{errors.email.message}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Password</span>
          <span className="relative block">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="input w-full pr-11"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            <button
              type="button"
              className="btn btn-ghost btn-xs absolute top-1/2 right-1.5 -translate-y-1/2"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          </span>
          {errors.password ? (
            <span className="mt-1 block text-xs text-error">
              {errors.password.message}
            </span>
          ) : null}
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" aria-hidden />
          ) : null}
          {isSubmitting ? "Signing in" : "Sign in"}
        </button>
      </form>

      <div className="divider my-0 text-xs text-base-content/45">or</div>

      <GoogleButton callbackURL={nextPath} getEmail={() => getValues("email")} />
    </div>
  );
}
