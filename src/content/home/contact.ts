import { Mail, MapPin, type LucideIcon } from "lucide-react";

type ContactInfoItem = {
  icon: LucideIcon;
  label: string;
};

type ContactAction = {
  label: string;
  href: string;
};

export const contactContent = {
  eyebrow: "Start The Conversation",
  title: "Talk to HEPA about a pricing, access, or evidence question",
  description:
    "Share the team you support, the decision you are working toward, and the type of output you need. We will use the details to route the conversation and recommend the right next step.",
  contactItems: [
    { icon: Mail, label: "info@digitalhepa.com" },
    { icon: MapPin, label: "Riyadh and Jeddah, Saudi Arabia; Dubai, United Arab Emirates" },
  ] satisfies ContactInfoItem[],
  engagementPrompts: [
    "Launch pricing benchmarking",
    "Local evidence planning",
    "Stakeholder survey design",
    "Report and dashboard delivery",
  ],
  serviceOptions: [
    { value: "evidence", label: "Evidence Generation" },
    { value: "pricing-access", label: "Pricing And Market Access Research" },
    { value: "engagement", label: "Stakeholder Engagement" },
    { value: "patient", label: "Patient Access Program Support" },
  ],
  supportNote:
    "Include the audience, market, and delivery format you need so the HEPA team can route your request correctly.",
  submissionRecipientEmail: "info@digitalhepa.com",
  submissionCcEmails: [] as string[],
  actions: [] as ContactAction[],
  successMessage: {
    title: "Thanks. Your request has been captured.",
    description: "A HEPA team member can now review the brief and follow up with the next step.",
  },
  errorMessage: {
    title: "We could not send your request.",
    description: "Please try again in a moment. We kept your details so you can resend without starting over.",
  },
};
