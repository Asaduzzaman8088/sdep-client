"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarX, Sparkles, PlusCircle, CloudOff } from "lucide-react";
import Link from "next/link";
import { isFuture, parseISO } from "date-fns";

import type { EventItem, PaginatedEventsResponse } from "@/types";
import { EventCard } from "./event-card";
import { EventFilters } from "./event-filters";
import { EventGridSkeleton } from "./event-skeleton";

export function EventsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [sortBy, setSortBy] = useState("date-asc");
  const [currentTime] = useState(() => Date.now());

  // Fetch from backend API
  const { data: apiData, isLoading, isError } = useQuery<PaginatedEventsResponse>({
    queryKey: ["events", "list"],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/events?limit=50`);
      if (!res.ok) {
        throw new Error("Failed to fetch events from API");
      }
      return res.json();
    },
    retry: 1,
    staleTime: 60_000,
  });

  // Base list: strictly database events, no mock fallback
  const rawEvents: EventItem[] = useMemo(() => {
    return apiData?.events ?? [];
  }, [apiData]);

  // Requirement from sdep.txt: Keep in mind that this page will only show upcoming events.
  // Events whose dates have passed must not appear on this page.
  const filteredEvents = useMemo(() => {
    return rawEvents
      .filter((evt) => {
        // 1. Ensure event is upcoming (date in the future or today)
        try {
          const d = typeof evt.eventDate === "string" ? parseISO(evt.eventDate) : new Date(evt.eventDate);
          // Allow future events or events happening within last 6 hours
          if (!isFuture(d) && currentTime - d.getTime() > 1000 * 60 * 60 * 6) {
            return false;
          }
        } catch {
          // Keep if date parsing fails
        }

        // 2. Event type filter
        if (selectedType && selectedType !== "All" && evt.eventType !== selectedType) {
          return false;
        }

        // 3. Location filter
        if (selectedLocation && selectedLocation !== "All Locations") {
          const locLower = evt.location.toLowerCase();
          if (!locLower.includes(selectedLocation.toLowerCase())) {
            return false;
          }
        }

        // 4. Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = evt.title.toLowerCase().includes(q);
          const matchDesc = evt.description?.toLowerCase().includes(q);
          const matchLoc = evt.location.toLowerCase().includes(q);
          const matchType = evt.eventType.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc && !matchType) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popularity") {
          return (b.joinedCount || 0) - (a.joinedCount || 0);
        }
        if (sortBy === "newest") {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        }
        // Default: date-asc (soonest upcoming event first)
        const aDate = new Date(a.eventDate).getTime();
        const bDate = new Date(b.eventDate).getTime();
        return aDate - bDate;
      });
  }, [rawEvents, searchQuery, selectedType, selectedLocation, sortBy, currentTime]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setSelectedLocation("All Locations");
    setSortBy("date-asc");
  };

  return (
    <div className="space-y-8">
      {/* Interactive Filters Bar */}
      <EventFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalResults={filteredEvents.length}
        onClearFilters={handleClearFilters}
      />

      {/* Grid of Events or Loading Skeleton or Error State or Empty State */}
      {isLoading ? (
        <EventGridSkeleton count={6} />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-error/40 bg-base-100/50 py-16 px-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-error/10 text-error">
            <CloudOff className="size-8" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-base-content">
            We couldn&apos;t load the events
          </h3>
          <p className="mt-2 max-w-md text-sm text-base-content/70">
            The event service is temporarily unavailable. Please refresh the page or try again in a few moments.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-primary btn-sm rounded-full mt-6"
          >
            Try again
          </button>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-100/50 py-16 px-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-base-200 text-base-content/60">
            <CalendarX className="size-8" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-base-content">
            No upcoming events match your search
          </h3>
          <p className="mt-2 max-w-md text-sm text-base-content/70">
            We couldn&apos;t find any events with the selected filters. Try searching for a different keyword, area, or category.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn btn-outline btn-sm rounded-full"
            >
              Reset all filters
            </button>
            <Link
              href="/create-event"
              className="btn btn-primary btn-sm rounded-full gap-1.5"
            >
              <PlusCircle className="size-4" />
              Create this event
            </Link>
          </div>
        </div>
      )}

      {/* Community Banner / Call to Action */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 p-8 sm:p-10 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              Empower your neighborhood
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              Don&apos;t see an event for your local cause?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">
              Take the initiative! Anyone can organize a cleanup drive, plantation campaign, winter clothes donation, or neighborhood assistance event in minutes.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
            <Link
              href="/create-event"
              className="btn btn-primary btn-md rounded-full shadow-md font-semibold"
            >
              <PlusCircle className="size-4" />
              Create an Event
            </Link>
            <Link
              href="/register"
              className="btn btn-outline btn-md rounded-full font-semibold"
            >
              Join as Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
