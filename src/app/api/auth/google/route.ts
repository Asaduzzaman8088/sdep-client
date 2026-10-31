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

    // Server-managed credential for the Google account
    const googleAccountPassword = `GoogleAuth_${email}_SDEP_2026!Aa`;

    // Attempt sign in first
    const signInReq = new Request(`${req.nextUrl.origin}/api/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: googleAccountPassword }),
    });

    let res = await auth.handler(signInReq);

    // If account doesn't exist yet, sign up
    if (!res.ok) {
      const signUpReq = new Request(`${req.nextUrl.origin}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: googleAccountPassword,
          image,
        }),
      });

      res = await auth.handler(signUpReq);
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || "Failed to authenticate Google user." },
        { status: 400 },
      );
    }

    // Build success response with all BetterAuth session cookies
    const response = NextResponse.json({
      success: true,
      user: { name, email, image },
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
    const msg = error instanceof Error ? error.message : "Google authentication error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
