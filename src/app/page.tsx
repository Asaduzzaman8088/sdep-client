import {
  ArrowRight,
  CalendarHeart,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { RecentEventsSection } from "@/components/home/recent-events-section";
import { CommunityGallery } from "@/components/home/community-gallery";
import { NewsletterSection } from "@/components/home/newsletter-section";

const features = [
  {
    icon: MapPin,
    title: "Causes Close to Home",
    text: "Discover service events happening in your own neighborhood with real-time location filtering.",
  },
  {
    icon: Users,
    title: "Built for Communities",
    text: "Create an event, gather passionate volunteers, and see who is showing up to make an impact.",
  },
  {
    icon: CalendarHeart,
    title: "Long-term Impact",
    text: "Track the events you have joined, celebrate collective milestones, and help your city flourish.",
  },
];

const stats = [
  { value: "1,450+", label: "Active Volunteers", color: "text-emerald-600" },
  { value: "180+", label: "Events Completed", color: "text-green-500" },
  { value: "24,000+", label: "Lives Impacted", color: "text-indigo-500" },
  { value: "100%", label: "Community Driven", color: "text-amber-500" },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. HERO / BANNER SECTION */}
      <section className="relative overflow-hidden flex-1">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] -z-10 size-[32rem] rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-[-12%] -z-10 size-[28rem] rounded-full bg-secondary/15 blur-3xl"
        />

        <div className="page-shell grid items-center gap-8 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <span className="section-kicker">
              <Sparkles className="size-4" aria-hidden />
              Community-powered social impact
            </span>
            <h1 className="mt-5 max-w-2xl text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl tracking-tight text-base-content">
              Small acts of service,{" "}
              <span className="text-primary">multiplied</span> by your
              neighborhood.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-base-content/75 sm:text-lg">
              SDEP brings neighbors together around cleanup drives, tree plantation
              days, winter clothes donation runs, and free health camps. Find a cause near you, or start
              something your community needs today.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/events" className="btn btn-primary btn-lg rounded-full font-bold shadow-md">
                Explore upcoming events
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/create-event" className="btn btn-outline btn-lg rounded-full font-bold">
                Start an event
              </Link>
            </div>
          </div>

          {/* Right side Hero Card with Image */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/3] rounded-3xl border border-base-300/80 bg-base-100 shadow-xl overflow-hidden">
              <Image
                src="/Winter photo.avif"
                alt="Community Service Drive in Dhaka"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 450px"
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="page-shell py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="card bg-base-100 border border-base-200 shadow-xs rounded-2xl">
              <div className="card-body items-center text-center p-6">
                <h3 className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</h3>
                <p className="text-xs sm:text-sm font-medium text-base-content/70">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="page-shell py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="section-kicker justify-center">
            <Sparkles className="size-4" aria-hidden />
            Why SDEP
          </span>
          <h2 className="section-title mt-2">
            Built for Grassroots <span className="text-primary">Action</span>
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            A seamless platform built to turn good intentions into organized neighborhood action.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((item) => (
            <div
              key={item.title}
              className="card rounded-3xl border border-base-300/80 bg-base-100 p-2 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="card-body gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-2 text-xl font-bold text-base-content">{item.title}</h3>
                <p className="text-sm leading-relaxed text-base-content/70">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. RECENT UPCOMING EVENTS SECTION (Dynamic 6 events from DB) */}
      <RecentEventsSection />

      {/* 4. GALLERY SECTION */}
      <CommunityGallery />

      {/* 5. NEWSLETTER SECTION */}
      <NewsletterSection />
    </div>
  );
}
