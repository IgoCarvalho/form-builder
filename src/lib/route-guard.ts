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

export function verifyPublicRoute(url: string) {
  const routeConfig = publicRoutes.find((route) => url.includes(route.path));

  return routeConfig;
}
