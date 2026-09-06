import { NextResponse, type NextRequest } from "next/server";

// First-layer, server-side route protection for the dashboard.
//
// In Next.js 16 this is the "proxy" file convention (formerly "middleware").
// It runs at the edge before any page renders, so an unauthenticated request to
// /dashboard/* is redirected to /login without ever flashing the protected UI.
// It can only check cookie *presence* (JWT validity can't be verified here
// without the signing secret), so it layers with the client-side session check
// in app/(protected)/layout.tsx, which calls /auth/me for real validation.
//
// We gate on the refreshToken cookie (7-day TTL), not the accessToken (15-min
// TTL): an expired access token is normal and the API client silently refreshes
// it, so its absence must not force a re-login.
const PROTECTED_PREFIXES = ["/dashboard"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has("refreshToken");
  if (hasSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
