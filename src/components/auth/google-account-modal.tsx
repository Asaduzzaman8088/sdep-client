"use client";

import { useEffect, useState } from "react";
import { User, Plus, X, Check, ArrowRight } from "lucide-react";
import Image from "next/image";
import { GoogleIcon } from "@/components/icons/google-icon";

export interface GoogleProfile {
  email: string;
  name: string;
  image?: string;
  isCustom?: boolean;
}

const DEFAULT_ACCOUNTS: GoogleProfile[] = [
  {
    name: "Asaduzzaman",
    email: "soponmd6@gmail.com",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Volunteer Organizer",
    email: "volunteer@sdep.org",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Community Member",
    email: "community@sdep.org",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
];

const STORAGE_KEY = "sdep_custom_google_accounts";

export function GoogleAccountModal({
  isOpen,
  onClose,
  onSelectAccount,
  signingInEmail,
  prefilledEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleProfile) => Promise<void>;
  signingInEmail: string | null;
  prefilledEmail?: string;
}) {
  const [customAccounts, setCustomAccounts] = useState<GoogleProfile[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore local storage parsing error
    }
    return [];
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEmail, setNewEmail] = useState(prefilledEmail ?? "");
  const [newName, setNewName] = useState("");
  const [formError, setFormError] = useState("");

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !signingInEmail) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, signingInEmail]);

  if (!isOpen) return null;

  // Build combined account list
  const allAccounts: GoogleProfile[] = [];

  // Add prefilled email if provided and not in lists
  if (
    prefilledEmail &&
    prefilledEmail.includes("@") &&
    !DEFAULT_ACCOUNTS.some((a) => a.email.toLowerCase() === prefilledEmail.toLowerCase()) &&
    !customAccounts.some((a) => a.email.toLowerCase() === prefilledEmail.toLowerCase())
  ) {
    allAccounts.push({
      email: prefilledEmail.toLowerCase(),
      name: prefilledEmail.split("@")[0],
      isCustom: true,
    });
  }

  // Add custom accounts
  allAccounts.push(...customAccounts);

  // Add default accounts
  for (const acc of DEFAULT_ACCOUNTS) {
    if (!allAccounts.some((a) => a.email.toLowerCase() === acc.email.toLowerCase())) {
      allAccounts.push(acc);
    }
  }

  const handleAddNewAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedEmail = newEmail.trim().toLowerCase();
    const trimmedName = newName.trim() || trimmedEmail.split("@")[0];

    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setFormError("Please enter a valid email address (e.g. name@gmail.com).");
      return;
    }

    const newAccount: GoogleProfile = {
      email: trimmedEmail,
      name: trimmedName,
      isCustom: true,
    };

    // Save to custom accounts in localStorage
    const updated = [newAccount, ...customAccounts.filter((a) => a.email.toLowerCase() !== trimmedEmail)];
    setCustomAccounts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }

    setIsAddingNew(false);
    setNewEmail("");
    setNewName("");

    // Automatically proceed to sign in with this new account
    await onSelectAccount(newAccount);
  };

  const handleRemoveCustomAccount = (emailToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customAccounts.filter((a) => a.email.toLowerCase() !== emailToRemove.toLowerCase());
    setCustomAccounts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-chooser-title"
      onClick={() => {
        if (!signingInEmail) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-base-100 border border-base-200/80 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 text-center border-b border-base-200/60">
          <button
            type="button"
            className="btn btn-ghost btn-circle btn-sm absolute right-4 top-4 text-base-content/60 hover:text-base-content"
            onClick={onClose}
            disabled={Boolean(signingInEmail)}
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>

          <div className="inline-flex items-center justify-center size-12 rounded-full bg-base-200/60 mb-3 shadow-inner">
            <GoogleIcon className="size-6" />
          </div>

          <h2 id="google-chooser-title" className="text-xl font-bold tracking-tight text-base-content">
            Choose an account
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-base-content/70">
            to continue to <span className="font-semibold text-primary">SDEP</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-2">
          {!isAddingNew ? (
            <>
              <div className="space-y-1.5">
                {allAccounts.map((account) => {
                  const isCurrentSigningIn = signingInEmail === account.email;
                  return (
                    <button
                      key={account.email}
                      type="button"
                      disabled={Boolean(signingInEmail)}
                      onClick={() => onSelectAccount(account)}
                      className={`group w-full flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left ${
                        isCurrentSigningIn
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-base-200 hover:border-primary/50 hover:bg-base-200/50"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative size-10 rounded-full overflow-hidden shrink-0 border border-base-300 bg-base-200 flex items-center justify-center font-bold text-sm text-base-content/70">
                        {account.image ? (
                          <Image
                            src={account.image}
                            alt={account.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <span>{account.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm text-base-content truncate">
                            {account.name}
                          </p>
                          {account.email === "soponmd6@gmail.com" ? (
                            <span className="badge badge-primary badge-xs scale-90 font-medium">Default</span>
                          ) : null}
                        </div>
                        <p className="text-xs text-base-content/65 truncate">{account.email}</p>
                      </div>

                      {/* Action / Status */}
                      {isCurrentSigningIn ? (
                        <span className="loading loading-spinner loading-sm text-primary shrink-0" />
                      ) : (
                        <div className="flex items-center gap-1">
                          {account.isCustom ? (
                            <button
                              type="button"
                              title="Remove from saved accounts"
                              aria-label="Remove account"
                              onClick={(e) => handleRemoveCustomAccount(account.email, e)}
                              className="btn btn-ghost btn-circle btn-xs text-base-content/40 hover:text-error"
                            >
                              <X className="size-3.5" />
                            </button>
                          ) : null}
                          <ArrowRight className="size-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Use another account button */}
              <button
                type="button"
                disabled={Boolean(signingInEmail)}
                onClick={() => setIsAddingNew(true)}
                className="w-full flex items-center gap-3.5 p-3 rounded-xl border border-dashed border-base-300 hover:border-primary hover:bg-primary/5 transition-all text-left text-sm font-semibold text-base-content/80 hover:text-primary mt-2"
              >
                <div className="size-10 rounded-full border border-dashed border-base-300 flex items-center justify-center shrink-0 text-base-content/60 group-hover:text-primary">
                  <Plus className="size-5" />
                </div>
                <span>Use another Google account</span>
              </button>
            </>
          ) : (
            /* Add another account form */
            <form onSubmit={handleAddNewAccount} className="space-y-3.5 p-1">
              <div className="flex items-center justify-between pb-1">
                <span className="text-sm font-bold text-base-content flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  Sign in with another Google account
                </span>
                <button
                  type="button"
                  className="text-xs text-base-content/60 hover:text-base-content underline"
                  onClick={() => setIsAddingNew(false)}
                >
                  Back to list
                </button>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-base-content/80 mb-1 block">
                  Email or Phone <span className="text-error">*</span>
                </span>
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="input input-bordered w-full text-sm"
                  autoFocus
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-base-content/80 mb-1 block">
                  Full Name (Optional)
                </span>
                <input
                  type="text"
                  placeholder="e.g. Asaduzzaman"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input input-bordered w-full text-sm"
                />
              </label>

              {formError ? (
                <p className="text-xs text-error font-medium">{formError}</p>
              ) : null}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsAddingNew(false)}
                  disabled={Boolean(signingInEmail)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm gap-1.5"
                  disabled={Boolean(signingInEmail)}
                >
                  {signingInEmail ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  Continue
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-base-200/40 border-t border-base-200 text-center">
          <p className="text-xs text-base-content/60 max-w-xs mx-auto leading-relaxed">
            To continue, Google will securely share your name, email address, and profile picture with SDEP.
          </p>
        </div>
      </div>
    </div>
  );
}
