import { Database, Globe, ShieldCheck, Users, Workflow, type LucideIcon } from "lucide-react";

type TrustStat = {
  value: string;
  label: string;
};

type TrustPillar = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const trustContent = {
  eyebrow: "Trust And Credibility",
  title: "Regional context, structured delivery, and practical outputs for healthcare teams",
  description:
    "HEPA combines GCC market context, evidence workflows, and digital reporting tools to support teams working through pricing, evidence, and access questions.",
  stats: [
    { value: "GCC-focused", label: "Regional pricing, evidence, and access context for healthcare teams" },
    { value: "Cross-functional", label: "Support across medical, access, regulatory, and commercial teams" },
    { value: "Decision-ready", label: "Reports, dashboards, surveys, and exportable insight packages" },
  ] satisfies TrustStat[],
  pillars: [
    {
      icon: Globe,
      title: "Regional healthcare access focus",
      description: "Partner coverage spans Saudi Arabia, the UAE, Qatar, Oman, Kuwait, and Bahrain.",
    },
    {
      icon: Workflow,
      title: "Methodology-led delivery",
      description: "Projects can combine literature review, stakeholder input, survey workflows, and report generation.",
    },
    {
      icon: Users,
      title: "Team and expert network support",
      description: "HEPA positions dedicated staff and local expert access around project delivery and decision support.",
    },
    {
      icon: ShieldCheck,
      title: "Data handling and governance",
      description: "Projects are structured around clear handling of source material, stakeholder inputs, and review-ready outputs.",
    },
    {
      icon: Database,
      title: "Leadership and capability proof",
      description: "Leadership oversight and delivery capability support the move from evidence gathering to presentation-ready outputs.",
    },
  ] satisfies TrustPillar[],
  testimonial: {
    quote:
      "HEPA helps teams bring local context, evidence inputs, and pricing questions into one clearer decision process.",
    attribution: "HEPA delivery approach",
  },
};
