import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { subscribeToSiteContent } from "@/lib/firebase/siteContent";
import { createSiteContentDraft, defaultSiteContent, type SiteContent } from "@/content/site/defaults";

type SiteContentContextValue = {
  siteContent: SiteContent;
};

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined);

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const [siteContent, setSiteContent] = useState<SiteContent>(() => createSiteContentDraft(defaultSiteContent));

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    return subscribeToSiteContent((remoteContent) => {
      if (remoteContent) {
        setSiteContent(remoteContent);
      }
    });
  }, []);

  return <SiteContentContext.Provider value={{ siteContent }}>{children}</SiteContentContext.Provider>;
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }

  return context;
};
