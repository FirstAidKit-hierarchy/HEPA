import { PageLoader } from "@/components/layout";
import { NotFoundPage } from "@/pages";
import { useSiteContent } from "@/components/providers";
import { pagePathsMatch } from "@/lib/site-pages";
import { NOT_FOUND_PREVIEW_PATH } from "@/pages/not-found/config";
import { useLocation } from "react-router-dom";
import CustomPageView from "./CustomPageView";

const ResolvedPage = () => {
  const location = useLocation();
  const {
    isSiteContentReady,
    siteContent: {
      notFoundPageRoute,
      customPages,
    },
  } = useSiteContent();
  const matchedNotFoundPreviewAlias =
    notFoundPageRoute.aliasPath &&
    !pagePathsMatch(location.pathname, NOT_FOUND_PREVIEW_PATH) &&
    pagePathsMatch(notFoundPageRoute.aliasPath, location.pathname);
  const matchedPage = customPages.find((page) => pagePathsMatch(page.path, location.pathname));

  if (!isSiteContentReady) {
    return <PageLoader visible fading={false} />;
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
