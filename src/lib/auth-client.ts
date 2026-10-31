"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [jwtClient()],
});

export type Session = typeof authClient.$Infer.Session;
export type SessionUser = Session["user"];
