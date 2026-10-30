import Link from "next/link";
import { CalendarHeart, HeartHandshake, Sprout, Users } from "lucide-react";

import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const highlights = [
  {
    icon: CalendarHeart,
    text: "Find service days that fit your schedule.",
  },
  {
    icon: Users,
    text: "Join neighbors and track who is showing up.",
  },
  {
    icon: Sprout,
    text: "Turn a small idea into a community tradition.",
  },
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-base-100">
      <div className="page-shell flex items-center justify-between py-5">
        <SiteLogo />
        <div className="flex items-center gap-2">
          <Link href="/" className="btn btn-ghost btn-sm hidden sm:inline-flex">
            Back to home
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="page-shell grid flex-1 items-stretch gap-8 pb-10 lg:grid-cols-[1fr_1fr]">
        <aside className="relative hidden overflow-hidden rounded-box bg-neutral p-10 text-neutral-content lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-primary/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-16 size-72 rounded-full bg-secondary/20 blur-3xl"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              <HeartHandshake className="size-4" aria-hidden />
              Community first
            </span>
            <h2 className="mt-8 max-w-md font-display text-4xl leading-tight font-semibold text-white">
              Service feels better when it is shared.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              ShebaSetu is a home for the people who show up: the planters, the
              cooks, the collectors, and the neighbors who make a city kinder.
            </p>
            <ul className="mt-8 space-y-4">
              {highlights.map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-primary">
                    <item.icon className="size-4" aria-hidden />
                  </span>
                  <span className="pt-1.5 text-white/80">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <blockquote className="relative mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/75">
            &ldquo;The best communities are not built by one big gesture. They are
            built by many small ones, repeated.&rdquo;
            <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              ShebaSetu community note
            </footer>
          </blockquote>
        </aside>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="card rounded-box border border-base-300/70 bg-base-100 shadow-xl">
              <div className="card-body gap-6 p-6 sm:p-8">
                <div>
                  <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
                  <p className="mt-2 text-sm leading-relaxed text-base-content/65">
                    {subtitle}
                  </p>
                </div>
                {children}
                <div className="text-center text-sm text-base-content/65">{footer}</div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-base-content/50">
              By continuing you agree to keep your community spaces respectful and
              welcoming for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
