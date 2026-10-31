import type { Metadata } from "next";
import { CalendarHeart, MapPin, Sparkles, Users } from "lucide-react";
import { EventsView } from "@/components/events/events-view";

export const metadata: Metadata = {
  title: "Upcoming Community Events",
  description:
    "Discover and join social development and community service events across Dhaka and beyond. From cleanup drives to winter donation camps.",
};

export default function EventsPage() {
  return (
    <div className="flex flex-1 flex-col pb-20">
      {/* Hero / Header Section */}
      <section className="relative overflow-hidden border-b border-base-200 bg-gradient-to-b from-base-200/50 via-base-100 to-base-100 py-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] -z-10 size-96 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-[-10%] -z-10 size-80 rounded-full bg-secondary/10 blur-3xl"
        />

        <div className="page-shell">
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-kicker justify-center">
              <Sparkles className="size-4" aria-hidden />
              Community Gatherings & Drives
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl lg:text-5xl">
              Upcoming <span className="text-primary">Social Service</span> Events
            </h1>
            <p className="mt-4 text-base leading-relaxed text-base-content/75 sm:text-lg">
              Explore hands-on volunteering opportunities in your area. Join local drives, connect with passionate neighbors, and be a part of meaningful change.
            </p>

            {/* Quick Stats Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2 shadow-xs">
                <CalendarHeart className="size-4 text-primary" />
                <span className="font-semibold text-base-content">Active Drives:</span>
                <span className="text-base-content/70">8 Categories</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2 shadow-xs">
                <MapPin className="size-4 text-secondary" />
                <span className="font-semibold text-base-content">Locations:</span>
                <span className="text-base-content/70">Dhaka & Beyond</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2 shadow-xs">
                <Users className="size-4 text-accent" />
                <span className="font-semibold text-base-content">Open Spots:</span>
                <span className="text-base-content/70">All Welcome</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Catalog Area */}
      <main className="page-shell mt-10">
        <EventsView />
      </main>
    </div>
  );
}
