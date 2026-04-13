import { withBasePath } from "@/lib/site-pages";
import { sharedCtas } from "./cta";

export const heroContent = {
  badge: "Saudi Arabia and GCC market access and evidence support",
  title: {
    lead: "Smarter evidence, pricing, and insight",
    highlight: "for Saudi Arabia and GCC pharma and medtech teams",
  },
  primaryCta: sharedCtas.primary,
  downloadCta: {
    label: "Download HEPA Profile",
    href: withBasePath("/documents/HEPA%20Company%20Profile%202026%20for%20Extrnal%20Use.pdf"),
    download: "HEPA-Business-Profile-2026.pdf",
  },
  quickPoints: [
    "Local evidence generation",
    "Pricing and access research",
    "Stakeholder surveys and expert validation",
    "Decision-ready reports and dashboards",
  ],
  summaryCard: {
    eyebrow: "Who can use HEPA",
    title: "From local data collection to decision-ready output",
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
