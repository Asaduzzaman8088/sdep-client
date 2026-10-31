import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/events" },
  { label: "Create Event", href: "/events/create" },
];

const accountLinks = [
  { label: "Login", href: "/login" },
  { label: "Create Account", href: "/register" },
  { label: "Joined Events", href: "/events/joined" },
  { label: "Manage Events", href: "/events/manage" },
];

const socials = [
  { label: "X", href: siteConfig.socials.x, icon: "x" },
  { label: "Facebook", href: siteConfig.socials.facebook, icon: "facebook" },
  { label: "Instagram", href: siteConfig.socials.instagram, icon: "instagram" },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, icon: "linkedin" },
] as const;

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.971h-1.513c-1.49 0-1.955.931-1.955 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.175 8.796 2.163 12 2.163Zm0 1.802c-3.148 0-3.504.012-4.733.068-.91.041-1.404.194-1.733.322-.436.17-.747.372-1.074.699-.327.327-.53.638-.699 1.074-.128.329-.281.823-.322 1.733-.056 1.229-.068 1.585-.068 4.733s.012 3.504.068 4.733c.041.91.194 1.404.322 1.733.17.436.372.747.699 1.074.327.327.638.53 1.074.699.329.128.823.281 1.733.322 1.229.056 1.585.068 4.733.068s3.504-.012 4.733-.068c.91-.041 1.404-.194 1.733-.322.436-.17.747-.372 1.074-.699.327-.327.53-.638.699-1.074.128-.329.281-.823.322-1.733.056-1.229.068-1.585.068-4.733s-.012-3.504-.068-4.733c-.041-.91-.194-1.404-.322-1.733-.17-.436-.372-.747-.699-1.074-.327-.327-.638-.53-1.074-.699-.329-.128-.823-.281-1.733-.322-1.229-.056-1.585-.068-4.733-.068Zm0 3.063a4.972 4.972 0 1 1 0 9.944 4.972 4.972 0 0 1 0-9.944Zm0 1.802a3.17 3.17 0 1 0 0 6.34 3.17 3.17 0 0 0 0-6.34Zm5.146-2.651a1.162 1.162 0 1 1 0 2.324 1.162 1.162 0 0 1 0-2.324Z" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452Z" />
    </svg>
  );
}

const socialIcons = {
  x: XIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
} as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-neutral text-neutral-content">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-8%] size-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 left-[-6%] size-80 rounded-full bg-secondary/15 blur-3xl"
      />

      <div className="page-shell relative grid gap-12 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label={`${siteConfig.name} home`}
          >
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white shadow-sm">
              <Image
                src="/sdep-log.png"
                alt=""
                width={40}
                height={40}
                className="size-full object-contain"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-sans text-xl font-semibold tracking-tight text-white">
                {siteConfig.name}
              </span>
              <span className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white/50">
                Social Development <br/>
                Events Platform
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
            {siteConfig.tagline} Find service days near you, start something your
            neighborhood needs, and track the difference you make together.
          </p>

          <div className="mt-6 flex items-center gap-2">
            {socials.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-primary/60 hover:bg-primary/15 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Explore
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/70 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Account
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {accountLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/70 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Get in touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <a
                href="mailto:hello@sdep.org"
                className="transition-colors hover:text-primary"
              >
                hello@sdep.org
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>

          <Link
            href="/events/create"
            className="btn btn-primary btn-sm mt-6 gap-1.5"
          >
            Start an event
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="page-shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. Built for
            communities that show up.
          </p>
          <p className="flex items-center gap-1.5">
            Serve together. Change together.
          </p>
        </div>
      </div>
    </footer>
  );
}
