export const siteConfig = {
  name: "SDEP",
  tagline: "Serve together. Change together.",
  description:
    "SDEP connects neighbors with community service events across Dhaka and beyond. Create an event, invite your community, and track the difference you make together.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nav: [
    { label: "Home", href: "/" },
    { label: "Upcoming Events", href: "/events" },
  ],
  socials: {
    x: "https://x.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
  },
} as const;

export const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Food Distribution",
  "Health Camp",
  "Education",
  "Other",
] as const;

export type EventType = (typeof eventTypes)[number];
