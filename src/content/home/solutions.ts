import { FileBarChart, GraduationCap, HeartPulse, Search, type LucideIcon } from "lucide-react";

export type AccentToken = "accentBlue" | "primary";

type SolutionItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  accent: AccentToken;
};

export const solutionsContent = {
  eyebrow: "Services And Platform Capabilities",
  title: "What HEPA helps commercial and evidence teams deliver",
  description:
    "Use HEPA to gather local evidence, structure pricing and access research, coordinate stakeholder input, and deliver outputs teams can act on.",
  cards: [
    {
      icon: FileBarChart,
      title: "Local Evidence Generation",
      description: "Build evidence packages that support pricing, access, and value communication decisions.",
      items: ["Economic model localization", "White paper development", "PRO and access reporting"],
      accent: "accentBlue",
    },
    {
      icon: Search,
      title: "Pricing And Market Access Research",
      description: "Structure local market input before launch, during launch, and through lifecycle planning.",
      items: ["Reimbursement pathway mapping", "Patient journey and KOL mapping", "Value proposition localization"],
      accent: "primary",
    },
    {
      icon: GraduationCap,
      title: "Stakeholder Engagement",
      description: "Collect and validate insights through targeted workshops, surveys, and advisory interactions.",
      items: ["Payer advisory boards", "Economic workshops", "Targeted training sessions"],
      accent: "primary",
    },
    {
      icon: HeartPulse,
      title: "Patient Access Program Support",
      description: "Address local access barriers with project structures tailored to the patient journey.",
      items: ["Customized access projects", "Patient flow optimization", "Patient voice support"],
      accent: "accentBlue",
    },
  ] satisfies SolutionItem[],
};
