"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, CalendarDays, CloudOff, PlusCircle, Sparkles } from "lucide-react";

import type { EventItem, EventsResponse } from "@/types";
import { EventCard } from "@/components/events/event-card";
import { EventGridSkeleton } from "@/components/events/event-skeleton";

export function RecentEventsSection() {
  const { data, isError, isLoading } = useQuery<EventsResponse>({
    queryKey: ["events", "recent-upcoming"],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/events/upcoming?limit=6`);
      if (!res.ok) throw new Error("Failed to fetch upcoming events");
      return res.json();
    },
    staleTime: 60_000,
    retry: 1,
  });

  const events: EventItem[] = data?.events?.slice(0, 6) ?? [];

  return (
    <section className="page-shell py-16 sm:py-20 border-t border-base-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="section-kicker">
            <Sparkles className="size-4" aria-hidden />
            Happening Soon
          </span>
          <h2 className="section-title mt-2">
            Recent Upcoming <span className="text-primary">Service Drives</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-base-content/70 max-w-xl">
            Explore the latest community events scheduled by local changemakers. Reserve your spot to volunteer and make a tangible difference.
          </p>
        </div>

        <Link
          href="/events"
          className="btn btn-outline btn-sm rounded-full gap-2 self-start md:self-auto font-semibold"
        >
          <CalendarDays className="size-4" />
          View All Events
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <EventGridSkeleton count={6} />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-error/40 bg-base-100/50 py-12 px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-error/10 text-error">
            <CloudOff className="size-7" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-base-content">
            We couldn&apos;t load upcoming events
          </h3>
          <p className="mt-2 max-w-md text-sm text-base-content/70">
            Something went wrong while reaching the event service. Please refresh the page or try again shortly.
          </p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-100/50 py-12 px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-base-200 text-base-content/60">
            <CalendarDays className="size-7" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-base-content">
            No events are scheduled yet
          </h3>
          <p className="mt-2 max-w-md text-sm text-base-content/70">
            Be the first to organize a community drive and inspire your neighbors to join.
          </p>
          <Link href="/create-event" className="btn btn-primary btn-sm rounded-full mt-5 gap-1.5">
            <PlusCircle className="size-4" />
            Create the first event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
