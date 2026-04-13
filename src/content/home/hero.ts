import { withBasePath } from "@/lib/site-pages";
import { sharedCtas } from "./cta";

export const HEPA_PROFILE_DOWNLOAD_PATH = "/documents/hepa-company-profile-2026.pdf";
export const HEPA_PROFILE_DOWNLOAD_FILENAME = "HEPA-Company-Profile-2026.pdf";

export const heroContent = {
  badge: "Saudi Arabia and GCC market access and evidence support",
  title: {
    lead: "Smarter evidence, pricing, and insight",
    highlight: "for Saudi Arabia and GCC pharma and medtech teams",
  },
  primaryCta: sharedCtas.primary,
  downloadCta: {
    label: "Download HEPA Profile",
    href: withBasePath(HEPA_PROFILE_DOWNLOAD_PATH),
    download: HEPA_PROFILE_DOWNLOAD_FILENAME,
  },
  quickPoints: [
    "Local evidence generation",
    "Pricing and Access research",
    "Stakeholder surveys and expert validation",
    "Decision-ready reports and dashboards",
  ],
  summaryCard: {
    eyebrow: "Who can use HEPA",
    title: "From Local Data Collection To Decision-Ready Output",
    items: [
      {
        label: "Teams served",
        value: "Pharma, medtech, medical affairs, market access, and regulatory teams",
      },
      {
        label: "Outputs",
        value: "Reports, dashboards, survey workflows, and insight exports",
      },
      {
        label: "Typical questions",
        value: "Launch planning, pricing assumptions, reimbursement insight, and access evidence",
      },
    ],
  },
};
