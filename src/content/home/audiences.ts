import { Activity, Pill, type LucideIcon } from "lucide-react";

type AudienceCard = {
  icon: LucideIcon;
  title: string;
  who: string;
  help: string;
  outcome: string;
};

export const audiencesContent = {
  eyebrow: "Who We Help",
  title: "Built For the Teams Shaping Pricing, Evidence, and Access Decisions",
  description:
    "HEPA supports cross-functional healthcare teams that need local context, structured evidence, and outputs they can use internally.",
  cards: [
    {
      icon: Pill,
      title: "Pharma",
      who: "Brand, launch, and portfolio teams preparing products for GCC markets.",
      help: "HEPA helps structure pricing research, stakeholder input, and market-specific evidence planning.",
      outcome: "Clearer launch and access direction for internal decision-making.",
    },
    {
      icon: Activity,
      title: "Medtech",
      who: "Device teams navigating market access, value communication, and clinical-commercial alignment.",
      help: "HEPA helps convert local workflow insight and access barriers into decision-ready reports and dashboards.",
      outcome: "Stronger market entry and access planning support.",
    },
  ] satisfies AudienceCard[],
};
