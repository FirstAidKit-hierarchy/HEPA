import { lazy, Suspense } from "react";
import { HomePage, NotFoundPage } from "@/pages";
import { ADMIN_PAGE_PATH } from "@/pages/admin/config";
import { NOT_FOUND_PREVIEW_PATH } from "@/pages/not-found/config";
import { PRIVATE_PAGE_PATH } from "@/pages/private/config";

const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));
const PrivatePage = lazy(() => import("@/pages/private/PrivatePage"));
const ResolvedPage = lazy(() => import("@/pages/custom/ResolvedPage"));

export const appRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: ADMIN_PAGE_PATH,
    element: (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    ),
  },
  {
    path: PRIVATE_PAGE_PATH,
    element: (
      <Suspense fallback={null}>
        <PrivatePage />
      </Suspense>
    ),
  },
  {
    path: NOT_FOUND_PREVIEW_PATH,
    element: <NotFoundPage />,
  },
  {
    path: "*",
    element: (
      <Suspense fallback={null}>
        <ResolvedPage />
      </Suspense>
    ),
  },
] as const;
