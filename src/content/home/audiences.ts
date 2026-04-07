import { Activity, BarChart3, FlaskConical, Pill, ShieldCheck, type LucideIcon } from "lucide-react";

type AudienceCard = {
  icon: LucideIcon;
  title: string;
  who: string;
  help: string;
  outcome: string;
};

export const audiencesContent = {
  eyebrow: "Who We Help",
  title: "Built for the teams shaping pricing, evidence, and access decisions",
  description:
    "HEPA supports cross-functional healthcare teams that need local context, structured evidence, and outputs they can use internally.",
  cards: [
    {
      icon: Pill,
      title: "Pharma",
      who: "Brand, launch, and portfolio teams preparing products for GCC markets.",
      help: "HEPA helps structure pricing research, stakeholder input, and market-specific evidence planning.",
      outcome: "Outcome: clearer launch and access direction for internal decision-making.",
    },
    {
      icon: Activity,
      title: "Medtech",
      who: "Device teams navigating market access, value communication, and clinical-commercial alignment.",
      help: "HEPA helps convert local workflow insight and access barriers into decision-ready reports and dashboards.",
      outcome: "Outcome: stronger market entry and access planning support.",
    },
    {
      icon: FlaskConical,
      title: "Medical Affairs",
      who: "Teams responsible for evidence planning, insight generation, and scientific support.",
      help: "HEPA helps organize surveys, local evidence inputs, and report structures for internal and external use.",
      outcome: "Outcome: more structured evidence generation and communication workflows.",
    },
    {
      icon: BarChart3,
      title: "Market Access",
      who: "Access and pricing teams working through reimbursement pathways and stakeholder needs.",
      help: "HEPA helps map local decision-makers, capture pricing insight, and package findings into actionable outputs.",
      outcome: "Outcome: better-informed access discussions and planning.",
    },
    {
      icon: ShieldCheck,
      title: "Regulatory Teams",
      who: "Teams coordinating local requirements, evidence readiness, and submission support.",
      help: "HEPA helps align local market input, documentation workflows, and stakeholder context around the product question.",
      outcome: "Outcome: cleaner handoffs between evidence, access, and regulatory planning.",
    },
  ] satisfies AudienceCard[],
};
