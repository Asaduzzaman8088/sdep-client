"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { GoogleButton } from "@/components/auth/google-button";
import { clearAuthTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { safeNextPath } from "@/lib/redirects";
import {
  getPasswordChecks,
  registerSchema,
  type RegisterValues,
} from "@/lib/validators";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const { data: session, isPending } = authClient.useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      photoURL: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({ control, name: "password" });
  const passwordChecks = getPasswordChecks(password ?? "");

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(nextPath);
    }
  }, [isPending, nextPath, router, session]);

  const onSubmit = async (values: RegisterValues) => {
    setIsSubmitting(true);

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.photoURL.trim() || undefined,
    });

    if (error) {
      toast.error(
        error.message ??
          "We could not create your account. Please check your details and try again.",
      );
      setIsSubmitting(false);
      return;
    }

    clearAuthTokenCache();
    toast.success("Account created. Welcome to SDEP.");
    router.replace(nextPath);
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Name</span>
          <input
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className="input w-full"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name ? (
            <span className="mt-1 block text-xs text-error">{errors.name.message}</span>
          ) : null}
        </label>

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
          <span className="mb-1.5 block text-sm font-medium">
            Photo URL <span className="text-base-content/45">(optional)</span>
          </span>
          <input
            type="url"
            autoComplete="photo"
            placeholder="https://example.com/your-photo.jpg"
            className="input w-full"
            aria-invalid={Boolean(errors.photoURL)}
            {...register("photoURL")}
          />
          {errors.photoURL ? (
            <span className="mt-1 block text-xs text-error">
              {errors.photoURL.message}
            </span>
          ) : (
            <span className="mt-1 block text-xs text-base-content/45">
              Leave it blank and we will use your initials.
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Password</span>
          <span className="relative block">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
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
          <ul className="mt-2 grid gap-1">
            {passwordChecks.map((check) => (
              <li
                key={check.label}
                className={`flex items-center gap-1.5 text-xs ${
                  check.valid ? "text-success" : "text-base-content/45"
                }`}
              >
                {check.valid ? (
                  <Check className="size-3.5" aria-hidden />
                ) : (
                  <X className="size-3.5" aria-hidden />
                )}
                {check.label}
              </li>
            ))}
          </ul>
          {errors.password ? (
            <span className="mt-1 block text-xs text-error">
              {errors.password.message}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Confirm password</span>
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            className="input w-full"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <span className="mt-1 block text-xs text-error">
              {errors.confirmPassword.message}
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
          {isSubmitting ? "Creating account" : "Create account"}
        </button>
      </form>

      <div className="divider my-0 text-xs text-base-content/45">or</div>

      <GoogleButton callbackURL={nextPath} getEmail={() => getValues("email")} />
    </div>
  );
}
