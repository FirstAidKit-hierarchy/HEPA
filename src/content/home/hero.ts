import { withBasePath } from "@/lib/site-pages";
import { sharedCtas } from "./cta";

export const HEPA_PROFILE_DOWNLOAD_PATH =
  "https://raw.githubusercontent.com/FirstAidKit-hierarchy/HEPA/main/public/documents/HEPA-Company-Profile-2026.pdf";
export const HEPA_PROFILE_DOWNLOAD_FILENAME = "HEPA-Company-Profile-2026.pdf";

export const heroContent = {
  badge: "Saudi Arabia and GCC market access and evidence support",
  title: {
    lead: "Smarter Evidence, Pricing, And Insight",
    highlight: "For Saudi Arabia and GCC Pharma and Medtech Teams",
  },
  primaryCta: sharedCtas.primary,
  downloadCta: {
    label: "Download HEPA Profile",
    href: withBasePath(HEPA_PROFILE_DOWNLOAD_PATH),
    download: HEPA_PROFILE_DOWNLOAD_FILENAME,
  },
  quickPoints: [
    "Local Evidence Generation",
    "Pricing and Access Research",
    "Stakeholder surveys and expert Validation",
    "Decision-ready Reports and Dashboards",
  ],
  summaryCard: {
    eyebrow: "Who can use HEPA",
    title: "From Local Data Collection To Decision-Ready Output",
    items: [
      {
        label: "Teams served",
        value: "Pharma, Medtech, Medical Affairs, Market Access, And RegulatoryTeams",
      },
      {
        label: "Outputs",
        value: "Reports, Dashboards, Survey Workflows, and Insight Exports",
      },
      {
        label: "Typical Questions",
        value: "Launch Planning, Pricing Assumptions, Reimbursement Insight, and Access Evidence",
      },
    ],
  },
};
