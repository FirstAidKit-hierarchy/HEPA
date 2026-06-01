import { Footer, Navbar, PageLoader } from "@/components/layout";
import {
  ContactSection,
  HeroSection,
  SolutionsSection,
  WhoWeHelpSection,
} from "@/components/sections";
import { ActionBanner } from "@/components/common";
import { useSiteContent } from "@/components/providers";
import { useHomePageLoader } from "./useHomePageLoader";

const HomePage = () => {
  const {
    isSiteContentReady,
    siteContent: {
      home: { ctaPanels },
    },
  } = useSiteContent();
  const { showLoader, hideLoader } = useHomePageLoader(isSiteContentReady);

  return (
    <div className="min-h-screen bg-background">
      <PageLoader visible={showLoader} fading={hideLoader} />
      <Navbar />
      <main className="overflow-x-clip">
        <HeroSection />
        <WhoWeHelpSection />
        <SolutionsSection />
        <ActionBanner {...ctaPanels.capabilities} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
