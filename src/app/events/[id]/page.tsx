import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CloudOff } from "lucide-react";
import type { EventItem } from "@/types";
import { EventDetailView } from "@/components/events/event-detail-view";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

type GetEventResult =
  | { status: "ok"; event: EventItem }
  | { status: "not-found" }
  | { status: "error" };

async function getEvent(id: string): Promise<GetEventResult> {
  // Event ids are MongoDB ObjectIds (24 hex chars) — legacy mock slugs no longer exist
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return { status: "not-found" };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${apiUrl}/api/events/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data?.event) return { status: "ok", event: data.event };
      return { status: "not-found" };
    }
    // 404 = valid ObjectId, missing event; 400 = malformed ObjectId (rejected server-side)
    if (res.status === 404 || res.status === 400) return { status: "not-found" };
    return { status: "error" };
  } catch {
    return { status: "error" };
  }
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getEvent(id);

  if (result.status !== "ok") {
    return { title: "Event Unavailable" };
  }

  return {
    title: `${result.event.title} — Community Event`,
    description: result.event.description,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const result = await getEvent(id);

  if (result.status === "not-found") {
    notFound();
  }

  if (result.status === "error") {
    return (
      <div className="page-shell py-20 flex flex-col items-center justify-center text-center">
        <div className="size-16 rounded-3xl bg-error/10 text-error flex items-center justify-center mb-5">
          <CloudOff className="size-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-base-content">
          We couldn&apos;t load this event
        </h1>
        <p className="mt-3 text-sm text-base-content/70 max-w-md">
          The server is temporarily unavailable or something went wrong while fetching the event details. Please try again in a moment.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/events" className="btn btn-primary rounded-full px-6">
            Back to Upcoming Events
          </Link>
        </div>
      </div>
    );
  }

  return <EventDetailView initialEvent={result.event} />;
}
