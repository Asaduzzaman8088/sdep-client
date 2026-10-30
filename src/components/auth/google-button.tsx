"use client";

import { useState } from "react";
import { toast } from "sonner";

import { GoogleIcon } from "@/components/icons/google-icon";
import { authClient } from "@/lib/auth-client";

export function GoogleButton({ callbackURL }: { callbackURL: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });

    if (error) {
      toast.error(
        error.message ?? "Google sign-in is not available right now. Try email instead.",
      );
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-outline w-full gap-2"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm" aria-hidden />
      ) : (
        <GoogleIcon className="size-4" />
      )}
      Continue with Google
    </button>
  );
}
