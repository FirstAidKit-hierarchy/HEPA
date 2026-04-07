import { ActionBanner } from "@/components/common";
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
import { ctaPanels } from "@/content/home";

type HomePageSection = {
  id: string;
  render: () => JSX.Element;
};

export const homePageSections: HomePageSection[] = [
  { id: "hero", render: () => <HeroSection /> },
  { id: "audiences", render: () => <WhoWeHelpSection /> },
  { id: "solutions", render: () => <SolutionsSection /> },
  { id: "capabilities-banner", render: () => <ActionBanner {...ctaPanels.capabilities} /> },
  { id: "product-proof", render: () => <ProductProofSection /> },
  { id: "case-studies", render: () => <CaseStudiesSection /> },
  { id: "workflow", render: () => <HowItWorksSection /> },
  { id: "trust", render: () => <TrustSection /> },
  { id: "insights", render: () => <InsightsSection /> },
  { id: "final-banner", render: () => <ActionBanner {...ctaPanels.final} className="pt-0 sm:pt-2" /> },
  { id: "contact", render: () => <ContactSection /> },
];
