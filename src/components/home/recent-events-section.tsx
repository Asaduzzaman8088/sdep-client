"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

import type { EventItem, EventsResponse } from "@/types";
import { MOCK_UPCOMING_EVENTS } from "@/data/mock-events";
import { EventCard } from "@/components/events/event-card";
import { EventGridSkeleton } from "@/components/events/event-skeleton";

export function RecentEventsSection() {
  const { data, isLoading } = useQuery<EventsResponse>({
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

  const events: EventItem[] =
    data?.events && data.events.length > 0
      ? data.events.slice(0, 6)
      : MOCK_UPCOMING_EVENTS.slice(0, 6);

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
          href="/upcoming-events"
          className="btn btn-outline btn-sm rounded-full gap-2 self-start md:self-auto font-semibold"
        >
          <CalendarDays className="size-4" />
          View All Events
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <EventGridSkeleton count={6} />
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
