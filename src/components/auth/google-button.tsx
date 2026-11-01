"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { GoogleIcon } from "@/components/icons/google-icon";
import { authClient } from "@/lib/auth-client";
import { clearAuthTokenCache } from "@/lib/api";
import {
  GoogleAccountModal,
  type GoogleProfile,
} from "@/components/auth/google-account-modal";

export function GoogleButton({
  callbackURL,
  getEmail,
}: {
  callbackURL: string;
  getEmail?: () => string | undefined;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signingInEmail, setSigningInEmail] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      // 1. Check if real Google Cloud OAuth credentials are configured
      const configRes = await fetch("/api/auth/google").catch(() => null);
      const configData = configRes && configRes.ok ? await configRes.json().catch(() => null) : null;
      const isGoogleConfigured = Boolean(configData?.isConfigured);

      if (isGoogleConfigured) {
        // Run live Google OAuth flow with Google's servers
        // prompt: "select_account" is configured on server so Google prompts account picker
        const { error } = await authClient.signIn.social({
          provider: "google",
          callbackURL,
        });

        if (error) {
          throw new Error(error.message || "Google sign-in failed.");
        }
        return;
      }

      // 2. Open interactive Google Account Selector modal
      setIsLoading(false);
      setIsModalOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in error";
      toast.error(msg);
      setIsLoading(false);
    }
  };

  const handleSelectAccount = async (account: GoogleProfile) => {
    setSigningInEmail(account.email);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callbackURL,
          email: account.email,
          name: account.name,
          image: account.image,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to complete Google authentication.");
      }

      clearAuthTokenCache();
      toast.success("Signed in with Google successfully!", {
        description: `Welcome back, ${data.user?.name || account.name}!`,
      });

      setIsModalOpen(false);
      const targetPath = callbackURL || "/";
      router.push(targetPath);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in error";
      toast.error(msg);
    } finally {
      setSigningInEmail(null);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline w-full gap-2.5 font-semibold text-sm hover:border-primary hover:bg-primary/5 transition-all"
        onClick={handleClick}
        disabled={isLoading || Boolean(signingInEmail)}
        aria-label="Continue with Google"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm" aria-hidden />
        ) : (
          <GoogleIcon className="size-4" />
        )}
        Continue with Google
      </button>

      <GoogleAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAccount={handleSelectAccount}
        signingInEmail={signingInEmail}
        prefilledEmail={getEmail ? getEmail()?.trim() : undefined}
      />
    </>
  );
}
