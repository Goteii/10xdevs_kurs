import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "./db/supabase";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("sb-access-token")?.value;

  // Skip auth for authentication-related endpoints
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(accessToken);

      if (error || !user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  // For non-API routes, redirect to login if no token
  if (!accessToken && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!login|_next/static|_next/image|favicon.ico).*)",
  ],
};
