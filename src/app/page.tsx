import {
  ArrowRight,
  CalendarHeart,
  HeartHandshake,
  MapPin,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteLogo } from "@/components/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const promises = [
  {
    icon: MapPin,
    title: "Causes close to home",
    text: "Discover service events happening in your own neighborhood.",
  },
  {
    icon: Users,
    title: "Built for communities",
    text: "Create an event, gather volunteers, and see who is joining.",
  },
  {
    icon: CalendarHeart,
    title: "Long-term impact",
    text: "Track the events you have joined and the people you have helped.",
  },
];

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
      <header className="page-shell grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-5">
        <SiteLogo />
        <Link
          href="/events"
          className="btn btn-ghost btn-sm hidden justify-self-center sm:inline-flex"
        >
          Upcoming Events
        </Link>
        <div className="flex items-center justify-self-end gap-1">
          <ThemeToggle />
          <Link href="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] -z-10 size-[32rem] rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-[-12%] -z-10 size-[28rem] rounded-full bg-secondary/15 blur-3xl"
        />

        <div className="page-shell grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <span className="section-kicker">
              <Sparkles className="size-4" aria-hidden />
              Community-powered social impact
            </span>
            <h1 className="mt-5 max-w-2xl text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
              Small acts of service,{" "}
              <span className="text-primary">multiplied</span> by your
              neighborhood.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-base-content/70 sm:text-lg">
              ShebaSetu brings neighbors together around cleanup drives, plantation
              days, donation runs, and health camps. Find a cause near you, or start
              something your community needs.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/events" className="btn btn-primary btn-lg">
                Explore upcoming events
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/events/create" className="btn btn-outline btn-lg">
                Start an event
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="card rounded-box border border-base-300/80 bg-base-100/85 shadow-xl backdrop-blur">
              <div className="card-body gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-base-content/50">
                      This weekend
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Service, one neighborhood at a time
                    </h2>
                  </div>
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <HeartHandshake className="size-5" aria-hidden />
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-primary badge-soft">
                    <Sprout className="size-3.5" aria-hidden />
                    Plantation
                  </span>
                  <span className="badge badge-secondary badge-soft">
                    Donation
                  </span>
                  <span className="badge badge-accent badge-soft">Cleanup</span>
                  <span className="badge badge-ghost">Health Camp</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {promises.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl bg-base-200/70 p-3 text-center"
                    >
                      <item.icon className="mx-auto size-5 text-primary" aria-hidden />
                      <p className="mt-2 text-[0.7rem] leading-snug font-medium text-base-content/70">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-base-content/65">
                  Free to join, open to everyone, and focused on real local needs.
                </p>
              </div>
            </div>

            <div className="card absolute -bottom-6 -left-4 hidden w-44 rounded-box border border-base-300/80 bg-base-100 p-4 shadow-lg sm:block">
              <p className="text-xs text-base-content/55">Your impact</p>
              <p className="mt-1 font-display text-2xl font-semibold text-primary">
                Every hour counts
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-4 pb-20 sm:grid-cols-3">
        {promises.map((item) => (
          <div
            key={item.title}
            className="card rounded-box border border-base-300/70 bg-base-100"
          >
            <div className="card-body gap-2">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="size-5" aria-hidden />
              </span>
              <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
              <p className="text-sm leading-relaxed text-base-content/65">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
