"use client";

import { useEffect, useState } from "react";
import { User, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { GoogleIcon } from "@/components/icons/google-icon";

export interface GoogleProfile {
  email: string;
  name: string;
  image?: string;
  letter?: string;
  bgColor?: string;
  isCustom?: boolean;
}

const DEFAULT_ACCOUNTS: GoogleProfile[] = [
  {
    name: "MD ASADUZZAMAN",
    email: "soponmd6@gmail.com",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "infoalamdanga mayor",
    email: "infoalamdangamayor@gmail.com",
    letter: "i",
    bgColor: "#4285F4",
  },
  {
    name: "Asaduzzaman Sopon",
    email: "asaduzzamansopon4@gmail.com",
    letter: "A",
    bgColor: "#5f6368",
  },
  {
    name: "Md Asaduzzaman",
    email: "asaduzzamanweb8@gmail.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "MD ASADUZZAMAN",
    email: "mdasaduzzamansfc87@gmail.com",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
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
  const [appHost] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.host || "sdep-client.vercel.app";
    }
    return "sdep-client.vercel.app";
  });
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

  // Add custom accounts first
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
      setFormError("Enter a valid email address");
      return;
    }

    const newAccount: GoogleProfile = {
      email: trimmedEmail,
      name: trimmedName,
      letter: trimmedName.charAt(0).toUpperCase(),
      bgColor: "#4285F4",
      isCustom: true,
    };

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

    await onSelectAccount(newAccount);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-fade-in font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-chooser-title"
      onClick={() => {
        if (!signingInEmail) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#131314] text-[#e3e3e3] border border-[#303030] shadow-2xl p-6 sm:p-9 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with Google icon */}
        <div className="flex items-center justify-between pb-6 border-b border-[#303030]/80">
          <div className="flex items-center gap-2.5">
            <GoogleIcon className="size-5" />
            <span className="text-sm font-medium text-[#e3e3e3] tracking-normal">
              Sign in with Google
            </span>
          </div>
          <button
            type="button"
            className="text-[#9aa0a6] hover:text-[#e3e3e3] p-1.5 rounded-full hover:bg-[#282a2c] transition-colors"
            onClick={onClose}
            disabled={Boolean(signingInEmail)}
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Two-column body */}
        {!isAddingNew ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pt-8 pb-3">
            {/* Left Column: Heading and Context */}
            <div className="flex flex-col justify-start">
              <h2 id="google-chooser-title" className="text-3xl sm:text-4xl font-normal text-[#e3e3e3] tracking-tight">
                Choose an account
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#e3e3e3] leading-relaxed">
                to continue to <span className="text-[#8ab4f8] font-medium">{appHost}</span>
              </p>
            </div>

            {/* Right Column: Authentic Google Account List */}
            <div className="divide-y divide-[#303030]">
              <div className="divide-y divide-[#303030] max-h-[360px] overflow-y-auto pr-1">
                {allAccounts.map((account) => {
                  const isCurrentSigningIn = signingInEmail === account.email;
                  return (
                    <button
                      key={account.email}
                      type="button"
                      disabled={Boolean(signingInEmail)}
                      onClick={() => onSelectAccount(account)}
                      className="w-full flex items-center gap-3.5 py-3.5 px-2 hover:bg-[#282a2c] rounded-lg transition-colors text-left group cursor-pointer"
                    >
                      {/* Avatar */}
                      <div
                        className="relative size-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-medium text-sm text-white"
                        style={{ backgroundColor: account.bgColor || "#5f6368" }}
                      >
                        {account.image ? (
                          <Image
                            src={account.image}
                            alt={account.name}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        ) : (
                          <span>{account.letter || account.name.charAt(0)}</span>
                        )}
                      </div>

                      {/* Name & Email */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#e3e3e3] truncate leading-tight">
                          {account.name}
                        </p>
                        <p className="text-xs text-[#9aa0a6] truncate mt-0.5 leading-tight">
                          {account.email}
                        </p>
                      </div>

                      {/* Loading status */}
                      {isCurrentSigningIn ? (
                        <span className="loading loading-spinner loading-xs text-[#8ab4f8] shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Use another account button */}
              <button
                type="button"
                disabled={Boolean(signingInEmail)}
                onClick={() => setIsAddingNew(true)}
                className="w-full flex items-center gap-3.5 py-3.5 px-2 hover:bg-[#282a2c] rounded-lg transition-colors text-left cursor-pointer mt-1"
              >
                <div className="size-8 rounded-full flex items-center justify-center text-[#9aa0a6]">
                  <User className="size-5" />
                </div>
                <span className="text-sm font-medium text-[#e3e3e3]">
                  Use another account
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* "Use another account" view matching Google's sign-in step */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pt-8 pb-3">
            {/* Left Column */}
            <div className="flex flex-col justify-start">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="inline-flex items-center gap-1.5 text-xs text-[#8ab4f8] hover:text-[#a8c7fa] mb-4 w-fit transition-colors"
              >
                <ArrowLeft className="size-3.5" /> Back to accounts
              </button>
              <h2 className="text-3xl sm:text-4xl font-normal text-[#e3e3e3] tracking-tight">
                Sign in
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#e3e3e3]">
                to continue to <span className="text-[#8ab4f8] font-medium">{appHost}</span>
              </p>
            </div>

            {/* Right Column: Google email input form */}
            <form onSubmit={handleAddNewAccount} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs text-[#9aa0a6] mb-1.5 font-normal">
                  Email or phone
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-transparent border border-[#5f6368] rounded-md text-sm text-[#e3e3e3] placeholder-[#80868b] focus:outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs text-[#9aa0a6] mb-1.5 font-normal">
                  Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Asaduzzaman"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-transparent border border-[#5f6368] rounded-md text-sm text-[#e3e3e3] placeholder-[#80868b] focus:outline-none focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] transition-all"
                />
              </div>

              {formError ? (
                <p className="text-xs text-[#f28b82]">{formError}</p>
              ) : null}

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-sm font-medium text-[#8ab4f8] hover:text-[#a8c7fa] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={Boolean(signingInEmail)}
                  className="px-6 py-2 bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#001d35] font-medium text-sm rounded-full transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {signingInEmail ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : null}
                  Next
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
