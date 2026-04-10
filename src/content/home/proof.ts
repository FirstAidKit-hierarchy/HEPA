export type ProductProofType = "dashboard" | "report" | "survey" | "export";

type ProductProofItem = {
  eyebrow: string;
  title: string;
  description: string;
  type: ProductProofType;
  imageSrc?: string;
  imageAlt?: string;
  isPlaceholder?: boolean;
  tags: string[];
};

export const productProofContent = {
  eyebrow: "Product Proof",
  title: "See the kinds of outputs teams can review, share, and act on",
  description:
    "Where approved screenshots are not yet available, structured placeholders show how dashboards, report previews, survey builders, and export-ready insights can be presented.",
  // Placeholder visuals below should be replaced with approved HEPA screenshots when available.
  items: [
    {
      eyebrow: "Dashboard Preview",
      title: "Pricing Benchmark Dashboard",
      description: "A view for pricing assumptions, stakeholder signals, and comparison points in one decision workspace.",
      type: "dashboard",
      isPlaceholder: true,
      tags: ["Placeholder", "Pricing", "Comparison View"],
    },
    {
      eyebrow: "Report Preview",
      title: "Market Access Report Preview",
      description: "A report-ready structure for evidence summaries, local context, and next-step recommendations.",
      type: "report",
      imageSrc: "/og-image.jpg",
      imageAlt: "HEPA report layout preview",
      tags: ["Preview Layout", "Report", "Decision Summary"],
    },
    {
      eyebrow: "Survey Preview",
      title: "Stakeholder Survey Builder",
      description: "A structured flow for building questionnaires, assigning audiences, and collecting the right inputs.",
      type: "survey",
      isPlaceholder: true,
      tags: ["Placeholder", "Survey Design", "Targeted Input"],
    },
    {
      eyebrow: "Export Preview",
      title: "Evidence & Insights Export",
      description: "An output format for sharing findings, dashboards, and internal summaries with stakeholders.",
      type: "export",
      isPlaceholder: true,
      tags: ["Placeholder", "Export", "Internal Sharing"],
    },
  ] satisfies ProductProofItem[],
  supportingPoints: [
    "Structured report layouts ready for real screenshots later",
    "Survey and questionnaire workflows designed for stakeholder input",
    "Outputs intended for internal review, leadership updates, and access planning",
  ],
};
