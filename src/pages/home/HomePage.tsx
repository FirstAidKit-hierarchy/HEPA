import { Footer, Navbar, PageLoader } from "@/components/layout";
import {
  CaseStudiesSection,
  ContactSection,
  HeroSection,
  HowItWorksSection,
  InsightsSection,
  ProductProofSection,
  SolutionsSection,
  TrustSection,
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
        <ProductProofSection />
        <CaseStudiesSection />
        <HowItWorksSection />
        <TrustSection />
        <InsightsSection />
        <ActionBanner {...ctaPanels.final} className="pt-0 sm:pt-2" />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
