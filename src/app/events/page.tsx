import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description:
    "Browse upcoming community service events near you, from cleanup drives to donation runs.",
};

export default function EventsPage() {
  return (
    <main className="page-shell section flex-1">
      <p className="section-kicker">Upcoming events</p>
      <h1 className="section-title mt-3">Events are on their way</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-base-content/70">
        The events directory will appear here as soon as the first community
        organizers publish their service days.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to home
      </Link>
    </main>
  );
}
