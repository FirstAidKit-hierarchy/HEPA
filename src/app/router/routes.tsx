import { HomePage, NotFoundPage } from "@/pages";

export const appRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
] as const;
