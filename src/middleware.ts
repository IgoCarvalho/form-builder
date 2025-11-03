import { NextRequest, NextResponse } from "next/server";
import { verifyPublicRoute } from "./lib/route-guard";

const AUTH_COOKIE_KEY =
  process.env.NODE_ENV !== "production"
    ? "authjs.session-token"
    : "__Secure-authjs.session-token";

export const middleware = (req: NextRequest) => {
  const nextUrl = req.nextUrl;
  const authCookie = req.cookies.get(AUTH_COOKIE_KEY);
  const isLoggedIn = !!authCookie;
  const routeConfig = verifyPublicRoute(nextUrl.pathname);

  const isInPublicRoute = !!routeConfig;

  if (isInPublicRoute) {
    if (isLoggedIn && routeConfig.redirect)
      return NextResponse.redirect(new URL("/", nextUrl.origin));
    return NextResponse.next();
  }

  if (isLoggedIn) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", nextUrl.origin));
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
