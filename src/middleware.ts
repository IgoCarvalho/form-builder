import { NextResponse } from "next/server";
import { auth } from "./auth";
import { verifyPublicRoute } from "./lib/route-guard";

export default auth((req) => {
  const nextUrl = req.nextUrl;
  const isLoggedIn = !!req.auth;
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
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
