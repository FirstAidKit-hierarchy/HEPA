import { lazy, Suspense } from "react";
import { PageLoader } from "@/components/layout";
import { NotFoundPage } from "@/pages";
import { useSiteContent } from "@/components/providers";
import { pagePathsMatch } from "@/lib/site-pages";
import { NOT_FOUND_PREVIEW_PATH } from "@/pages/not-found/config";
import { PRIVATE_PAGE_PATH } from "@/pages/private/config";
import { useLocation } from "react-router-dom";
import CustomPageView from "./CustomPageView";

const AdminPage = lazy(() => import("@/pages/admin/AdminPage"));
const PrivatePage = lazy(() => import("@/pages/private/PrivatePage"));

const ResolvedPage = () => {
  const location = useLocation();
  const {
    isSiteContentReady,
    siteContent: {
      adminPage,
      notFoundPageRoute,
      privatePageRoute,
      customPages,
    },
  } = useSiteContent();
  const matchedAdminAlias = adminPage.aliasPath && pagePathsMatch(adminPage.aliasPath, location.pathname);
  const matchedPrivateAlias =
    privatePageRoute.aliasPath &&
    !pagePathsMatch(location.pathname, PRIVATE_PAGE_PATH) &&
    pagePathsMatch(privatePageRoute.aliasPath, location.pathname);
  const matchedNotFoundPreviewAlias =
    notFoundPageRoute.aliasPath &&
    !pagePathsMatch(location.pathname, NOT_FOUND_PREVIEW_PATH) &&
    pagePathsMatch(notFoundPageRoute.aliasPath, location.pathname);
  const matchedPage = customPages.find((page) => pagePathsMatch(page.path, location.pathname));

  if (!isSiteContentReady) {
    return <PageLoader visible fading={false} />;
  }

  if (matchedAdminAlias) {
    return (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    );
  }

  if (matchedPrivateAlias) {
    return (
      <Suspense fallback={null}>
        <PrivatePage />
      </Suspense>
    );
  }

  if (matchedNotFoundPreviewAlias) {
    return <NotFoundPage />;
  }

  if (!matchedPage) {
    return <NotFoundPage />;
  }

  return <CustomPageView page={matchedPage} />;
};

export default ResolvedPage;
