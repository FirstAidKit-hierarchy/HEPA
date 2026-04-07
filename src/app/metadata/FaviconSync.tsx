import { useEffect } from "react";
import { useAppTheme } from "@/components/providers";

const FaviconSync = () => {
  const { isDark } = useAppTheme();

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      document.head.appendChild(link);
    }

    link.href = isDark ? "/icons/hepa-logo-dark-icon.svg" : "/icons/hepa-logo-icon.svg";
  }, [isDark]);

  return null;
};

export default FaviconSync;
