# Social Development Events Platform (SDEP)

A modern, community-driven social service event management platform where citizens can organize, discover, join, and track local volunteer initiatives across Dhaka and beyond.

- **Live Site URL:** [https://sdep-client.vercel.app](https://sdep-client.vercel.app) *(or your deployed production URL)*
- **Server Repository:** [https://github.com/Asaduzzaman8088/sdep-server](https://github.com/Asaduzzaman8088/sdep-server)
- **Client Repository:** [https://github.com/Asaduzzaman8088/sdep-client](https://github.com/Asaduzzaman8088/sdep-client)

---

## Key Features

- **Dynamic Upcoming Events Directory:** Filter community drives by cause category (Cleanups, Plantations, Winter Clothes Donation, Warm Meals, Free Health Camps, Education drives), search by keywords/neighborhoods in real-time, and view only active upcoming events.
- **Role-Protected Event Management:** Secure private routes for authenticated volunteers to create events (with strict future-date validation), update existing event details, and delete organized drives with ownership authorization.
- **One-Click Event Joining & RSVP Tracking:** Interactive volunteer joining system with live capacity bars, volunteer counters, and a dedicated **Joined Events** dashboard sorted chronologically by event date.
- **Unified Sans-Serif Design & Dark/Light Theme Switching:** Seamless theme switching with high contrast and readable Plus Jakarta Sans typography across day (light) and night (dark) modes.
- **Robust Authentication & Form Validation:** Complete email/password authentication and Google OAuth sign-in powered by BetterAuth and JWT tokens, including password complexity validation (uppercase, lowercase, 6+ characters) and Sonner toasts.
- **Interactive Home Page Sections:** Thematic hero banner, quick impact stats, 6 recent upcoming service drives loaded from MongoDB, community photography gallery, and newsletter subscription section.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling & UI:** Tailwind CSS v4, DaisyUI v5, Lucide React
- **Typography:** Plus Jakarta Sans (Sans-Serif)
- **State & Data Fetching:** TanStack React Query v5
- **Authentication:** BetterAuth with MongoDB Adapter & JWT
- **Validation:** React Hook Form & Zod
- **Notifications:** Sonner toasts

---

## Getting Started

### 1. Install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables:
Copy `.env.example` to `.env` and fill in your MongoDB Atlas URI:
```env
MONGODB_URI=mongodb://sdep:AUBuQaFTI6U0C39W@ac-fdwbtuv-shard-00-00.8d1n9vg.mongodb.net:27017,ac-fdwbtuv-shard-00-01.8d1n9vg.mongodb.net:27017,ac-fdwbtuv-shard-00-02.8d1n9vg.mongodb.net:27017/?ssl=true&replicaSet=atlas-1m1cx9-shard-0&authSource=admin
DB_NAME=sdep
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
