import { useEffect, useState } from "react";
import { resetHorizontalScrollPosition } from "@/lib/scroll";
import { HOME_PAGE_LOADER_FADE_DELAY_MS, HOME_PAGE_LOADER_HIDE_DELAY_MS } from "./constants";

export function useHomePageLoader(isSiteContentReady: boolean) {
  const [showLoader, setShowLoader] = useState(true);
  const [hideLoader, setHideLoader] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    resetHorizontalScrollPosition();

    window.addEventListener("resize", resetHorizontalScrollPosition);
    window.addEventListener("scroll", resetHorizontalScrollPosition, { passive: true });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", resetHorizontalScrollPosition);
      window.removeEventListener("scroll", resetHorizontalScrollPosition);
    };
  }, []);

  useEffect(() => {
    if (!isSiteContentReady) {
      setShowLoader(true);
      setHideLoader(false);
      return;
    }

    const fadeTimer = window.setTimeout(() => setHideLoader(true), HOME_PAGE_LOADER_FADE_DELAY_MS);
    const removeTimer = window.setTimeout(() => {
      setShowLoader(false);
      document.body.style.overflow = "";
      resetHorizontalScrollPosition();
    }, HOME_PAGE_LOADER_HIDE_DELAY_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [isSiteContentReady]);

  return {
    showLoader,
    hideLoader,
  };
}
