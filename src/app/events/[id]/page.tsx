import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_UPCOMING_EVENTS } from "@/data/mock-events";
import type { EventItem } from "@/types";
import { EventDetailView } from "@/components/events/event-detail-view";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string): Promise<EventItem | null> {
  // First check API
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/events/${id}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data?.event) return data.event;
    }
  } catch {
    // API not reachable, fall back to mock data
  }

  // Fallback to mock events
  const found = MOCK_UPCOMING_EVENTS.find((e) => e.id === id);
  if (found) return found;

  return null;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: `${event.title} — Community Event`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return <EventDetailView initialEvent={event} />;
}
