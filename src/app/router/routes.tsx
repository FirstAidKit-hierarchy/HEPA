import { lazy, Suspense } from "react";
import { HomePage, NotFoundPage } from "@/pages";
import { ADMIN_PAGE_PATH } from "@/pages/admin/config";
import { NOT_FOUND_PREVIEW_PATH } from "@/pages/not-found/config";
import { PASSWORD_RESET_EMAIL_PREVIEW_PATH } from "@/pages/password-reset-email-preview/config";
import { PASSWORD_RESET_PATH } from "@/pages/password-reset/config";
import { REFERENCE_PROJECTS_PATH } from "@/pages/reference-projects/config";

const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));
const PasswordResetEmailPreviewPage = lazy(
  () => import("@/pages/password-reset-email-preview/PasswordResetEmailPreviewPage"),
);
const PasswordResetPage = lazy(() => import("@/pages/password-reset/PasswordResetPage"));
const ReferenceProjectsPage = lazy(() => import("@/pages/reference-projects/ReferenceProjectsPage"));
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
    path: REFERENCE_PROJECTS_PATH,
    element: (
      <Suspense fallback={null}>
        <ReferenceProjectsPage />
      </Suspense>
    ),
  },
  {
    path: PASSWORD_RESET_EMAIL_PREVIEW_PATH,
    element: (
      <Suspense fallback={null}>
        <PasswordResetEmailPreviewPage />
      </Suspense>
    ),
  },
  {
    path: PASSWORD_RESET_PATH,
    element: (
      <Suspense fallback={null}>
        <PasswordResetPage />
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
