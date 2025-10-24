import { auth } from "@/auth";
import { NextResponse } from "next/server";

type RouteConfig = {
  path: string;
  redirect: boolean;
};

const publicRoutes: RouteConfig[] = [
  {
    path: "/register",
    redirect: true,
  },
  {
    path: "/sign-in",
    redirect: true,
  },
  {
    path: "/login",
    redirect: true,
  },
  {
    path: "/submit",
    redirect: false,
  },
];

export default auth((req) => {
  const nextUrl = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const routeConfig = publicRoutes.find((route) =>
    nextUrl.pathname.includes(route.path)
  );

  const isInPublicRoute = !!routeConfig;

  if (isInPublicRoute) {
    if (isLoggedIn && routeConfig.redirect)
      return NextResponse.redirect(new URL("/", nextUrl));
    return NextResponse.next();
  }

  if (isLoggedIn) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", nextUrl));
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
