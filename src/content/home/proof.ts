import { withBasePath } from "@/lib/site-pages";

export type ProductProofType = "dashboard" | "report" | "survey" | "export";

type ProductProofItem = {
  eyebrow: string;
  title: string;
  description: string;
  type: ProductProofType;
  imageSrc?: string;
  imageAlt?: string;
  tags: string[];
};

export const productProofContent = {
  eyebrow: "Product Proof",
  title: "See the kinds of outputs teams can review, share, and act on",
  description:
    "Selected previews show the dashboard, report, survey, and export formats HEPA can package for internal review, leadership updates, and access planning.",
  items: [
    {
      eyebrow: "Dashboard Preview",
      title: "Pricing Benchmark Dashboard",
      description: "A view for pricing assumptions, stakeholder signals, and comparison points in one decision workspace.",
      type: "dashboard",
      tags: ["Dashboard", "Pricing", "Comparison View"],
    },
    {
      eyebrow: "Report Preview",
      title: "Market Access Report Preview",
      description: "A report-ready structure for evidence summaries, local context, and next-step recommendations.",
      type: "report",
      imageSrc: withBasePath("/og-image.jpg"),
      imageAlt: "HEPA report layout preview",
      tags: ["Preview Layout", "Report", "Decision Summary"],
    },
    {
      eyebrow: "Survey Preview",
      title: "Stakeholder Survey Builder",
      description: "A structured flow for building questionnaires, assigning audiences, and collecting the right inputs.",
      type: "survey",
      tags: ["Survey Design", "Targeted Input", "Workflow"],
    },
    {
      eyebrow: "Export Preview",
      title: "Evidence & Insights Export",
      description: "An output format for sharing findings, dashboards, and internal summaries with stakeholders.",
      type: "export",
      tags: ["Export Pack", "Internal Sharing", "Insight Summary"],
    },
  ] satisfies ProductProofItem[],
  supportingPoints: [
    "Illustrative layouts that reflect decision-ready HEPA output formats",
    "Survey and questionnaire workflows designed for stakeholder input",
    "Outputs prepared for internal review, leadership updates, and access planning",
  ],
};
