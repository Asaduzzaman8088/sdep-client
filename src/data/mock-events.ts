import type { EventItem } from "@/types";

export const MOCK_UPCOMING_EVENTS: EventItem[] = [
  {
    id: "evt-winter-clothes-mirpur",
    title: "Winter Clothes Distribution 2026",
    description:
      "Join us to distribute warm jackets, sweaters, and shawls to underprivileged families and street dwellers preparing for the colder weeks ahead in Mirpur.",
    eventType: "Donation",
    thumbnail:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
    location: "Mirpur 10 Roundabout, Dhaka",
    eventDate: "2026-11-15T09:00:00.000Z",
    capacity: 50,
    joinedCount: 38,
    createdBy: {
      id: "org-1",
      name: "Dhaka Youth Care",
      email: "youthcare@dhaka.org",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    createdAt: "2026-10-25T10:00:00.000Z",
    updatedAt: "2026-10-25T10:00:00.000Z",
  },
  {
    id: "evt-blanket-mohammadpur",
    title: "Blanket Distribution for the Needy",
    description:
      "Night distribution drive targeting rickshaw pullers, open-sky dwellers, and elderly citizens in need of heavy thermal blankets.",
    eventType: "Donation",
    thumbnail:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
    location: "Town Hall, Mohammadpur, Dhaka",
    eventDate: "2026-11-20T20:00:00.000Z",
    capacity: 40,
    joinedCount: 29,
    createdBy: {
      id: "org-2",
      name: "Warmth Foundation",
      email: "care@warmthbd.org",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    createdAt: "2026-10-26T12:00:00.000Z",
    updatedAt: "2026-10-26T12:00:00.000Z",
  },
  {
    id: "evt-dhanmondi-lake-cleanup",
    title: "Dhanmondi Lake Clean-Up Drive",
    description:
      "A morning dedicated to clearing plastic debris, discarded bottles, and waste along the walkway and waterways of Rabindra Sarobar and Dhanmondi Lake.",
    eventType: "Cleanup",
    thumbnail:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=900&q=80",
    location: "Rabindra Sarobar, Dhanmondi, Dhaka",
    eventDate: "2026-11-22T07:30:00.000Z",
    capacity: 60,
    joinedCount: 47,
    createdBy: {
      id: "org-3",
      name: "Clean City Initiative",
      email: "hello@cleancity.org",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    },
    createdAt: "2026-10-27T08:30:00.000Z",
    updatedAt: "2026-10-27T08:30:00.000Z",
  },
  {
    id: "evt-green-tree-plantation",
    title: "Urban Tree Plantation & Care Drive",
    description:
      "Planting indigenous shade trees and flowering plants across community parks and roadside verges to improve green cover and air quality.",
    eventType: "Plantation",
    thumbnail:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    location: "Sector 4 Park, Uttara, Dhaka",
    eventDate: "2026-11-28T08:00:00.000Z",
    capacity: 45,
    joinedCount: 31,
    createdBy: {
      id: "org-4",
      name: "Green Dhaka Brigade",
      email: "greendhaka@org.bd",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    },
    createdAt: "2026-10-28T14:15:00.000Z",
    updatedAt: "2026-10-28T14:15:00.000Z",
  },
  {
    id: "evt-meals-street-children",
    title: "Warm Meals for Street Children",
    description:
      "Cooking and serving nutritious hot meals, fresh fruits, and clean drinking water to over 300 underprivileged children and laborers.",
    eventType: "Food Distribution",
    thumbnail:
      "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=900&q=80",
    location: "Farmgate Overbridge Area, Dhaka",
    eventDate: "2026-12-05T12:00:00.000Z",
    capacity: 35,
    joinedCount: 22,
    createdBy: {
      id: "org-5",
      name: "Sheba Kitchen",
      email: "food@shebakitchen.org",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    createdAt: "2026-10-29T16:00:00.000Z",
    updatedAt: "2026-10-29T16:00:00.000Z",
  },
  {
    id: "evt-health-camp-lalbagh",
    title: "Free Community Eye & Health Camp",
    description:
      "Partnering with volunteer doctors and optometrists to provide free blood pressure checks, basic medication, diabetes screening, and eye exams.",
    eventType: "Health Camp",
    thumbnail:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80",
    location: "Community Center, Lalbagh, Old Dhaka",
    eventDate: "2026-12-12T09:30:00.000Z",
    capacity: 70,
    joinedCount: 54,
    createdBy: {
      id: "org-6",
      name: "MediShare BD",
      email: "info@medisharebd.org",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
    },
    createdAt: "2026-10-30T11:20:00.000Z",
    updatedAt: "2026-10-30T11:20:00.000Z",
  },
  {
    id: "evt-book-donation-drive",
    title: "Community Book & School Supplies Drive",
    description:
      "Collecting textbooks, storybooks, notebooks, and stationary sets for children enrolled in local free community primary schools.",
    eventType: "Education",
    thumbnail:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
    location: "Road 11, Banani, Dhaka",
    eventDate: "2026-12-18T10:00:00.000Z",
    capacity: 30,
    joinedCount: 18,
    createdBy: {
      id: "org-7",
      name: "Alokito Shishu",
      email: "alokitoshishu@gmail.com",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    createdAt: "2026-10-30T15:00:00.000Z",
    updatedAt: "2026-10-30T15:00:00.000Z",
  },
  {
    id: "evt-buriganga-river-cleanup",
    title: "Riverfront Eco Cleanup & Awareness Walk",
    description:
      "A collective volunteer campaign along the river ghats to collect non-biodegradable waste and spread awareness among boatmen and visitors.",
    eventType: "Cleanup",
    thumbnail:
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=900&q=80",
    location: "Sadarghat River Terminal, Dhaka",
    eventDate: "2026-12-25T08:00:00.000Z",
    capacity: 55,
    joinedCount: 33,
    createdBy: {
      id: "org-8",
      name: "Eco Riverfront Alliance",
      email: "ecoriverfront@org.bd",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    createdAt: "2026-10-31T09:00:00.000Z",
    updatedAt: "2026-10-31T09:00:00.000Z",
  },
];
