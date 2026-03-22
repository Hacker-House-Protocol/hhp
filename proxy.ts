import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bypass for OAuth flows and the /refresh page
  if (req.nextUrl.searchParams.get("privy_oauth_code")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/refresh")) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) return NextResponse.next();

  const privyToken = req.cookies.get("privy-token");
  const privySession = req.cookies.get("privy-session");

  // Definitely authenticated
  if (privyToken) return NextResponse.next();

  // Token expired but session exists — refresh client-side
  if (privySession) {
    const refreshUrl = new URL("/refresh", req.url);
    refreshUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  // Not authenticated at all
  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
