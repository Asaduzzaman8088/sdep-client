"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  CalendarHeart,
  Clock,
  HeartHandshake,
  Lock,
  MapPin,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import type { JoinedEvent, JoinedEventsResponse } from "@/types";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

export default function JoinedEventsPage() {
  const queryClient = useQueryClient();
  const { data: session, isPending: authPending } = authClient.useSession();

  // Fetch my joined events
  const { data, isLoading } = useQuery<JoinedEventsResponse>({
    queryKey: ["my", "joined"],
    queryFn: async () => {
      return apiRequest<JoinedEventsResponse>("/api/my/joined");
    },
    enabled: Boolean(session?.user),
    staleTime: 30_000,
  });

  const joinedEvents = data?.events || [];

  // Leave mutation
  const leaveMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/events/${id}/join`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast.success("You have left the event.");
      queryClient.invalidateQueries({ queryKey: ["my", "joined"] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to leave event.";
      toast.error(msg);
    },
  });

  if (authPending) {
    return (
      <div className="page-shell py-20 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="page-shell py-20 flex flex-col items-center justify-center text-center">
        <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-5">
          <Lock className="size-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-base-content">
          Sign In to View Joined Events
        </h1>
        <p className="mt-3 text-sm text-base-content/70 max-w-md">
          Please sign in to see the service events you have registered for and track your community participation.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login?next=/joined-events" className="btn btn-primary rounded-full px-6">
            Sign In
          </Link>
          <Link href="/register" className="btn btn-outline rounded-full px-6">
            Create an Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-12 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="section-kicker">
            <Sparkles className="size-4" aria-hidden />
            Volunteer Commitment
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content mt-2">
            My Joined <span className="text-primary">Events</span>
          </h1>
          <p className="mt-1 text-sm text-base-content/70">
            All service drives you are currently signed up for, sorted by date.
          </p>
        </div>

        <Link
          href="/events"
          className="btn btn-outline btn-sm rounded-full gap-2 self-start sm:self-auto font-semibold"
        >
          <Calendar className="size-4" />
          Explore More Events
        </Link>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      ) : joinedEvents.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-base-content/60">
            You are enrolled in <strong>{joinedEvents.length}</strong> {joinedEvents.length === 1 ? "event" : "events"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedEvents.map((evt: JoinedEvent) => {
              let dateStr = evt.eventDate;
              let timeStr = "";
              try {
                const parsed = parseISO(evt.eventDate);
                dateStr = format(parsed, "EEE, MMM d, yyyy");
                timeStr = format(parsed, "h:mm a");
              } catch {
                // keep dateStr
              }

              return (
                <div
                  key={evt.id}
                  className="flex flex-col rounded-3xl border border-base-300/80 bg-base-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[16/10] bg-base-200">
                    <Image
                      src={evt.thumbnail}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 350px"
                      className="size-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 badge badge-success text-white font-bold text-xs shadow-xs">
                        <HeartHandshake className="size-3" />
                        Attending
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-neutral text-xs font-semibold shadow-xs">
                        {evt.eventType}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-base-content line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
                      {evt.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-base-200 space-y-1.5 text-xs text-base-content/75">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary shrink-0" />
                        <span>{dateStr}</span>
                      </div>
                      {timeStr && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-primary shrink-0" />
                          <span>{timeStr}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Users className="size-3.5 text-primary shrink-0" />
                        <span>
                          {evt.joinedCount} {evt.capacity > 0 ? `/ ${evt.capacity} joined` : "joined"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-base-200">
                      <Link
                        href={`/events/${evt.id}`}
                        className="btn btn-primary btn-xs rounded-full px-4 font-semibold text-xs"
                      >
                        View Event
                      </Link>

                      <button
                        type="button"
                        onClick={() => leaveMutation.mutate(evt.id)}
                        disabled={leaveMutation.isPending}
                        className="btn btn-ghost btn-xs text-error hover:bg-error/10 gap-1 rounded-full text-xs"
                      >
                        <XCircle className="size-3.5" />
                        Cancel RSVP
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-base-300 bg-base-100/50 p-12 text-center flex flex-col items-center">
          <div className="size-16 rounded-3xl bg-base-200 text-base-content/60 flex items-center justify-center mb-4">
            <CalendarHeart className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-base-content">
            You haven&apos;t joined any events yet
          </h3>
          <p className="mt-2 text-sm text-base-content/70 max-w-sm">
            Find an upcoming drive in Dhaka that inspires you—winter clothes distribution, cleanups, tree plantations, or free health camps.
          </p>
          <Link
            href="/events"
            className="btn btn-primary rounded-full mt-6 gap-2 font-bold shadow-md"
          >
            <Sparkles className="size-4" />
            Browse Upcoming Events
          </Link>
        </div>
      )}
    </div>
  );
}
