"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CalendarHeart, FolderHeart, LogOut, PlusCircle, User } from "lucide-react";
import { toast } from "sonner";

import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { clearAuthTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export function SiteHeader() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      clearAuthTokenCache();
    }
  };

  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-300 bg-base-100/90 backdrop-blur-md">
      <div className="page-shell flex items-center justify-between gap-4 py-3 sm:py-4">
        {/* App Logo */}
        <SiteLogo />

        {/* Center Nav: Upcoming Events */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/events"
            className="btn btn-ghost btn-sm font-semibold text-base-content/80 hover:text-primary transition-colors"
          >
            Upcoming Events
          </Link>
        </nav>

        {/* Right Area: Theme Toggle & Conditional Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {isPending ? (
            <div className="skeleton size-9 rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {/* Profile Picture with Dropdown & Hover Tooltip */}
              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar border border-base-300/80 transition-all hover:ring-2 hover:ring-primary/40"
                  title={user.name || user.email || "My Profile"}
                  aria-label={`User menu for ${user.name || user.email}`}
                >
                  <div className="relative size-9 rounded-full overflow-hidden bg-primary/10">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User avatar"}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center font-bold text-sm text-primary">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="size-4" />}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-[60] mt-3 w-56 rounded-2xl border border-base-300/80 bg-base-100 p-2 shadow-xl space-y-1"
                >
                  {/* User Info Header */}
                  <li className="menu-title px-3 py-2 border-b border-base-200">
                    <p className="truncate text-sm font-bold text-base-content">
                      {user.name || "Community Member"}
                    </p>
                    <p className="truncate text-xs text-base-content/60 font-normal">
                      {user.email}
                    </p>
                  </li>

                  {/* Protected Routes */}
                  <li>
                    <Link
                      href="/create-event"
                      className="flex items-center gap-2.5 rounded-xl text-xs font-semibold py-2.5 hover:bg-base-200"
                    >
                      <PlusCircle className="size-4 text-primary" />
                      Create Event
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/manage-events"
                      className="flex items-center gap-2.5 rounded-xl text-xs font-semibold py-2.5 hover:bg-base-200"
                    >
                      <FolderHeart className="size-4 text-secondary" />
                      Manage Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/joined-events"
                      className="flex items-center gap-2.5 rounded-xl text-xs font-semibold py-2.5 hover:bg-base-200"
                    >
                      <CalendarHeart className="size-4 text-accent" />
                      Joined Events
                    </Link>
                  </li>

                  <div className="divider my-1" />

                  {/* Sign out item inside dropdown */}
                  <li>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 rounded-xl text-xs font-semibold text-error py-2.5 hover:bg-error/10"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>

              {/* Dedicated Logout Button */}
              <button
                type="button"
                onClick={handleSignOut}
                className="btn btn-outline btn-sm rounded-full hidden md:inline-flex text-xs font-semibold"
                title="Log out of your account"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary btn-sm rounded-full px-5 text-xs font-semibold shadow-xs"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
