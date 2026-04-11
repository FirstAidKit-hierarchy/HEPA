import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";

const RouteScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const scrollToHash = () => {
      scrollToSection(location.hash);
    };

    scrollToHash();
    const fallbackTimer = window.setTimeout(scrollToHash, 350);

    return () => window.clearTimeout(fallbackTimer);
  }, [location.hash, location.pathname]);

  return null;
};

export default RouteScrollManager;
