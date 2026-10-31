import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { EventItem } from "@/types";

interface EventCardProps {
  event: EventItem;
}

const typeStyles: Record<string, { badge: string; dot: string }> = {
  Donation: {
    badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    dot: "bg-purple-500",
  },
  Cleanup: {
    badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
    dot: "bg-sky-500",
  },
  Plantation: {
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  "Food Distribution": {
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    dot: "bg-amber-500",
  },
  "Health Camp": {
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    dot: "bg-rose-500",
  },
  Education: {
    badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    dot: "bg-indigo-500",
  },
  Other: {
    badge: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
    dot: "bg-teal-500",
  },
};

export function EventCard({ event }: EventCardProps) {
  let eventDateObj: Date;
  try {
    eventDateObj = typeof event.eventDate === "string" ? parseISO(event.eventDate) : new Date(event.eventDate);
  } catch {
    eventDateObj = new Date();
  }

  const formattedDate = format(eventDateObj, "EEE, MMM d, yyyy");
  const formattedTime = format(eventDateObj, "h:mm a");
  const monthShort = format(eventDateObj, "MMM").toUpperCase();
  const dayNumber = format(eventDateObj, "dd");

  const style = typeStyles[event.eventType] || typeStyles.Other;
  const progressPercent = event.capacity > 0 ? Math.min(100, Math.round((event.joinedCount / event.capacity) * 100)) : 0;
  const isAlmostFull = event.capacity > 0 && progressPercent >= 80;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300/80 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-200">
        <Image
          src={event.thumbnail}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Date Overlay Pill */}
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center rounded-xl bg-base-100/90 px-3 py-1.5 shadow-md backdrop-blur-md">
          <span className="text-[0.65rem] font-bold tracking-wider text-primary">
            {monthShort}
          </span>
          <span className="text-base font-extrabold leading-none text-base-content">
            {dayNumber}
          </span>
        </div>

        {/* Event Type Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow-sm ${style.badge}`}
          >
            <span className={`size-1.5 rounded-full ${style.dot}`} />
            {event.eventType}
          </span>
        </div>

        {/* Capacity Warning Tag if nearly full */}
        {isAlmostFull && (
          <div className="absolute bottom-3 right-3 rounded-md bg-amber-500/90 px-2 py-0.5 text-[0.7rem] font-medium text-white backdrop-blur-sm">
            Few spots left
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-base-content transition-colors group-hover:text-primary line-clamp-2">
          <Link href={`/events/${event.id}`}>
            {event.title}
          </Link>
        </h3>

        {/* Description snippet */}
        <p className="mt-2.5 text-sm leading-relaxed text-base-content/70 line-clamp-2">
          {event.description}
        </p>

        {/* Event Meta Details */}
        <div className="mt-4 space-y-2 border-t border-base-200 pt-3 text-xs text-base-content/75">
          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="truncate font-medium">{event.location}</span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 shrink-0 text-primary" aria-hidden />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-base-content/60">
              <Clock className="size-3.5 shrink-0" aria-hidden />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Volunteers & Capacity Progress */}
        <div className="mt-4 rounded-xl bg-base-200/50 p-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-base-content/80">
              <Users className="size-3.5 text-primary" aria-hidden />
              Volunteers
            </span>
            <span className="font-semibold text-base-content">
              {event.joinedCount} {event.capacity > 0 ? `/ ${event.capacity} joined` : "joined"}
            </span>
          </div>
          {event.capacity > 0 && (
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-base-300">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        {/* Organizer & Action Footer */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-base-200 pt-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {event.createdBy?.image ? (
                <div className="relative size-7 shrink-0 overflow-hidden rounded-full ring-1 ring-primary/20">
                  <Image
                    src={event.createdBy.image}
                    alt={event.createdBy.name}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[0.7rem] font-bold text-primary">
                  {event.createdBy?.name?.charAt(0) || "O"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-base-content/90">
                  {event.createdBy?.name || "Community Organizer"}
                </p>
                <p className="text-[0.65rem] text-base-content/60">Organizer</p>
              </div>
            </div>

            <Link
              href={`/events/${event.id}`}
              className="btn btn-primary btn-sm rounded-full gap-1 px-4 text-xs font-semibold shrink-0 group-hover:btn-accent transition-colors"
            >
              View Event
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
