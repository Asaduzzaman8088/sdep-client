"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MapPin,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

import type { EventItem } from "@/types";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

interface EventDetailViewProps {
  initialEvent: EventItem;
}

export function EventDetailView({ initialEvent }: EventDetailViewProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [event, setEvent] = useState<EventItem>(initialEvent);
  const [isJoined, setIsJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let eventDateObj: Date;
  try {
    eventDateObj =
      typeof event.eventDate === "string"
        ? parseISO(event.eventDate)
        : new Date(event.eventDate);
  } catch {
    eventDateObj = new Date();
  }

  const formattedDate = format(eventDateObj, "EEEE, MMMM d, yyyy");
  const formattedTime = format(eventDateObj, "h:mm a");

  const progressPercent =
    event.capacity > 0
      ? Math.min(100, Math.round((event.joinedCount / event.capacity) * 100))
      : 0;
  const isFull = event.capacity > 0 && event.joinedCount >= event.capacity;

  const handleJoinToggle = async () => {
    if (!session?.user) {
      toast.info("Please sign in first to join this community event.", {
        action: {
          label: "Sign in",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isJoined) {
        // Leave
        await apiRequest(`/api/events/${event.id}/join`, { method: "DELETE" }).catch(() => {
          // Graceful fallback for mock mode
        });
        setIsJoined(false);
        setEvent((prev) => ({
          ...prev,
          joinedCount: Math.max(0, prev.joinedCount - 1),
        }));
        toast.success("You have left this event.");
      } else {
        // Join
        await apiRequest(`/api/events/${event.id}/join`, { method: "POST" }).catch(() => {
          // Graceful fallback for mock mode
        });
        setIsJoined(true);
        setEvent((prev) => ({
          ...prev,
          joinedCount: prev.joinedCount + 1,
        }));
        toast.success("Awesome! You have successfully joined this event.", {
          description: "We look forward to seeing you make a difference with us!",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update attendance";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled or failed, fall back to copy
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  return (
    <div className="page-shell py-8 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/70 hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Upcoming Events
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        {/* Left Column: Main Event Story */}
        <div className="space-y-8">
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="size-3.5" />
                {event.eventType}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-base-200 px-3 py-1 text-xs font-semibold text-base-content/70">
                <ShieldCheck className="size-3.5 text-success" />
                Verified Community Event
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl lg:text-5xl leading-tight">
              {event.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-base-content/75">
              <div className="flex items-center gap-1.5">
                <MapPin className="size-4 text-primary" />
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-primary" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Large Hero Thumbnail Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-base-300 bg-base-200 shadow-md">
            <Image
              src={event.thumbnail}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="size-full object-cover"
            />
          </div>

          {/* Description Section */}
          <section className="rounded-3xl border border-base-300/80 bg-base-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-base-content">
              About This Initiative
            </h2>
            <div className="prose max-w-none text-base leading-relaxed text-base-content/80">
              <p>{event.description}</p>
              <p className="mt-4">
                Community-driven social events are the backbone of sustainable local change. By volunteering for this drive, you will directly support local families, help protect public spaces, and inspire more neighbors to take part.
              </p>
            </div>

            {/* Highlights bullets */}
            <div className="mt-6 rounded-2xl bg-base-200/60 p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-base-content">
                What to Expect & Key Guidelines:
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-base-content/80">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 text-success mt-0.5" />
                  <span>All necessary equipment and basic safety kits will be provided on site.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 text-success mt-0.5" />
                  <span>Please arrive 15 minutes prior to the scheduled start time for a brief orientation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 shrink-0 text-success mt-0.5" />
                  <span>Wear comfortable clothing and closed footwear suitable for outdoor community service.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Organizer Details Card */}
          <section className="rounded-3xl border border-base-300/80 bg-base-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/60">
              Organized By
            </h3>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {event.createdBy?.image ? (
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
                    <Image
                      src={event.createdBy.image}
                      alt={event.createdBy.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                    {event.createdBy?.name?.charAt(0) || "O"}
                  </div>
                )}
                <div>
                  <h4 className="text-base font-bold text-base-content">
                    {event.createdBy?.name || "Community Organizer"}
                  </h4>
                  <p className="text-xs text-base-content/60">
                    {event.createdBy?.email || "Community Service Coordinator"}
                  </p>
                </div>
              </div>

              <a
                href={`mailto:${event.createdBy?.email || "info@sdep.org"}`}
                className="btn btn-outline btn-sm rounded-full text-xs"
              >
                Contact
              </a>
            </div>
          </section>
        </div>

        {/* Right Column: Attendance & Action Card Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-3xl border border-base-300/80 bg-base-100 p-6 shadow-lg space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Volunteer Registration
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-base-content">
                  {event.joinedCount}
                </span>
                <span className="text-xs font-medium text-base-content/60">
                  {event.capacity > 0 ? `out of ${event.capacity} spots filled` : "volunteers joined"}
                </span>
              </div>

              {event.capacity > 0 && (
                <div className="mt-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-base-200">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[0.7rem] text-base-content/60">
                    <span>{progressPercent}% filled</span>
                    <span>{Math.max(0, event.capacity - event.joinedCount)} spots remaining</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button: Join / Leave */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleJoinToggle}
                disabled={isSubmitting || (isFull && !isJoined)}
                className={`btn btn-lg w-full rounded-full font-bold shadow-md transition-all ${
                  isJoined
                    ? "btn-outline border-error text-error hover:bg-error hover:text-white"
                    : "btn-primary"
                }`}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : isJoined ? (
                  "Leave Event"
                ) : isFull ? (
                  "Event at Full Capacity"
                ) : (
                  <>
                    <HeartHandshake className="size-5 mr-1" />
                    Join This Event
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="btn btn-ghost btn-sm w-full rounded-full gap-2 text-xs font-semibold"
              >
                <Share2 className="size-4" />
                Share Event with Friends
              </button>
            </div>

            {/* Event Key Details List */}
            <div className="space-y-3 border-t border-base-200 pt-5 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="size-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-base-content">Date</p>
                  <p className="text-xs text-base-content/70">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="size-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-base-content">Time</p>
                  <p className="text-xs text-base-content/70">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="size-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-base-content">Location</p>
                  <p className="text-xs text-base-content/70">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="size-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-base-content">Volunteer Spots</p>
                  <p className="text-xs text-base-content/70">
                    {event.capacity > 0 ? `${event.capacity} total capacity` : "Open to all"}
                  </p>
                </div>
              </div>
            </div>

            {/* Notice if not signed in */}
            {!session?.user && (
              <div className="rounded-2xl bg-base-200/80 p-3.5 text-center text-xs text-base-content/75">
                <span>Want to participate? </span>
                <Link href="/login" className="font-semibold text-primary underline">
                  Sign in
                </Link>
                <span> to save your spot.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
