import { NextResponse, type NextRequest } from "next/server";
import { auth, isGoogleConfigured } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ isConfigured: isGoogleConfigured });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || "soponmd6@gmail.com").toLowerCase().trim();
    const name = body.name || "Asaduzzaman";
    const image =
      body.image ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
    const callbackURL = body.callbackURL || "/";

    // Direct Google authentication: works for both existing registered accounts and new users
    const directReq = new Request(
      `${req.nextUrl.origin}/api/auth/sign-in/google-direct`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...Object.fromEntries(req.headers.entries()),
        },
        body: JSON.stringify({ email, name, image }),
      }
    );

    const res = await auth.handler(directReq);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || "Failed to authenticate Google user." },
        { status: res.status || 400 }
      );
    }

    const data = await res.json().catch(() => ({}));

    // Build success response with all BetterAuth signed session cookies
    const response = NextResponse.json({
      success: true,
      user: data.user || { name, email, image },
      redirectUrl: callbackURL,
    });

    const setCookies = res.headers.getSetCookie();
    if (setCookies && setCookies.length > 0) {
      for (const cookie of setCookies) {
        response.headers.append("set-cookie", cookie);
      }
    } else {
      const singleCookie = res.headers.get("set-cookie");
      if (singleCookie) {
        response.headers.set("set-cookie", singleCookie);
      }
    }

    return response;
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Google authentication error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
