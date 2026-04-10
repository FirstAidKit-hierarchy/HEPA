import {
  Activity,
  BarChart3,
  Database,
  FileBarChart,
  FlaskConical,
  Globe,
  GraduationCap,
  HeartPulse,
  Mail,
  MapPin,
  Pill,
  Search,
  ShieldCheck,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  audiencesContent,
  caseStudiesContent,
  contactContent,
  ctaPanels,
  heroContent,
  insightsContent,
  partners,
  productProofContent,
  sharedCtas,
  solutionsContent,
  trustContent,
  workflowContent,
} from "@/content/home";
import { navigationLinks } from "@/content/navigation";
import { createWorkshopContentDraft, workshopContent } from "@/pages/private/content";

const audienceIconKeyMap = new Map<LucideIcon, string>([
  [Pill, "pill"],
  [Activity, "activity"],
  [FlaskConical, "flaskConical"],
  [BarChart3, "barChart3"],
  [ShieldCheck, "shieldCheck"],
]);

const solutionIconKeyMap = new Map<LucideIcon, string>([
  [FileBarChart, "fileBarChart"],
  [Search, "search"],
  [GraduationCap, "graduationCap"],
  [HeartPulse, "heartPulse"],
]);

const trustIconKeyMap = new Map<LucideIcon, string>([
  [Globe, "globe"],
  [Workflow, "workflow"],
  [Users, "users"],
  [ShieldCheck, "shieldCheck"],
  [Database, "database"],
]);

const contactIconKeyMap = new Map<LucideIcon, string>([
  [Mail, "mail"],
  [MapPin, "mapPin"],
]);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const cloneValue = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as T;
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneValue(item)])) as T;
  }

  return value;
};

const mergeWithTemplate = <T,>(template: T, value: unknown): T => {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) {
      return cloneValue(template);
    }

    return value.map((item, index) => {
      const itemTemplate = template[index] ?? template[template.length - 1];
      return itemTemplate === undefined ? cloneValue(item) : mergeWithTemplate(itemTemplate, item);
    }) as T;
  }

  if (isPlainObject(template)) {
    const source = isPlainObject(value) ? value : {};

    return Object.fromEntries(
      Object.entries(template).map(([key, itemTemplate]) => [key, mergeWithTemplate(itemTemplate, source[key])]),
    ) as T;
  }

  return typeof value === typeof template ? (value as T) : cloneValue(template);
};

const footerDescription =
  "Decision-ready evidence, pricing research, and market access support for healthcare teams across Saudi Arabia and the GCC.";

const contactBriefChecklist = [
  "The product, therapy area, or access question you are working on",
  "The GCC market or stakeholder audience you need to understand",
  "The output you need, such as a report, dashboard, survey workflow, or insight export",
];

export const defaultSiteContent = {
  siteShell: {
    navigation: {
      links: navigationLinks.map((link) => ({ ...link })),
      primaryCta: { ...sharedCtas.primary },
    },
    footer: {
      description: footerDescription,
      email: "info@digitalhepa.com",
      location: "Riyadh and Jeddah, Saudi Arabia; Dubai, United Arab Emirates",
      legalLinks: [
        { label: "Terms & Conditions", href: "#" },
        { label: "Privacy Policy", href: "#" },
      ],
      socialLinks: [{ label: "LinkedIn", href: "https://www.linkedin.com/company/digitalhepa/" }],
      copyrightLabel: "HEPA. All rights reserved.",
    },
  },
  home: {
    hero: cloneValue(heroContent),
    audiences: {
      eyebrow: audiencesContent.eyebrow,
      title: audiencesContent.title,
      description: audiencesContent.description,
      cards: audiencesContent.cards.map((card) => ({
        iconKey: audienceIconKeyMap.get(card.icon) ?? "pill",
        title: card.title,
        who: card.who,
        help: card.help,
        outcome: card.outcome,
      })),
    },
    solutions: {
      eyebrow: solutionsContent.eyebrow,
      title: solutionsContent.title,
      description: solutionsContent.description,
      sidePanel: {
        eyebrow: "Why teams use HEPA",
        description:
          "Combine evidence generation, pricing and access research, stakeholder input, and delivery-ready outputs in one workflow.",
      },
      cards: solutionsContent.cards.map((card) => ({
        iconKey: solutionIconKeyMap.get(card.icon) ?? "fileBarChart",
        title: card.title,
        description: card.description,
        items: [...card.items],
        accent: card.accent,
      })),
    },
    ctaPanels: cloneValue(ctaPanels),
    productProof: {
      ...cloneValue(productProofContent),
      supportingPanelEyebrow: "Designed for easy asset replacement",
    },
    caseStudies: {
      ...cloneValue(caseStudiesContent),
      placeholderBadge: "Placeholder case study",
    },
    workflow: cloneValue(workflowContent),
    trust: {
      eyebrow: trustContent.eyebrow,
      title: trustContent.title,
      description: trustContent.description,
      stats: trustContent.stats.map((stat) => ({ ...stat })),
      pillars: trustContent.pillars.map((pillar) => ({
        iconKey: trustIconKeyMap.get(pillar.icon) ?? "globe",
        title: pillar.title,
        description: pillar.description,
        isPlaceholder: Boolean(pillar.isPlaceholder),
      })),
      testimonial: { ...trustContent.testimonial },
      launchChecklist: {
        eyebrow: "What should be confirmed before launch",
        items: [
          "Approved privacy and data-handling language",
          "Founder or leadership credentials that can be published",
          "Approved client quote or testimonial text",
        ],
      },
    },
    insights: cloneValue(insightsContent),
    contact: {
      eyebrow: contactContent.eyebrow,
      title: contactContent.title,
      description: contactContent.description,
      contactItems: contactContent.contactItems.map((item) => ({
        iconKey: contactIconKeyMap.get(item.icon) ?? "mail",
        label: item.label,
      })),
      engagementPrompts: [...contactContent.engagementPrompts],
      serviceOptions: contactContent.serviceOptions.map((option) => ({ ...option })),
      supportNote: contactContent.supportNote,
      successMessage: { ...contactContent.successMessage },
      briefChecklist: contactBriefChecklist,
      formIntro: {
        eyebrow: "Request a conversation",
        title: "Tell us what your team needs",
        description:
          "Use the form to request a discussion, share a live project question, or outline the output your team needs.",
      },
    },
    partnersSection: {
      eyebrow: "Trusted By",
      title: "Trusted by our partners",
      description:
        "A growing network of collaborators across evidence generation, access strategy, and healthcare innovation.",
      embeddedEyebrow: "Trusted by our partners",
      items: partners.map((partner) => ({ ...partner })),
    },
  },
  privatePage: createWorkshopContentDraft(workshopContent),
  notFoundPage: {
    title: "Page not found",
    buttonLabel: "Return to the page",
    buttonHref: "/",
  },
};

export type SiteContent = typeof defaultSiteContent;

export const normalizeSiteContent = (value: unknown) => mergeWithTemplate(defaultSiteContent, value);

export const createSiteContentDraft = (value: unknown = defaultSiteContent) => normalizeSiteContent(value);

export const siteContentSelectOptions = {
  audienceIconKey: ["pill", "activity", "flaskConical", "barChart3", "shieldCheck"],
  solutionIconKey: ["fileBarChart", "search", "graduationCap", "heartPulse"],
  trustIconKey: ["globe", "workflow", "users", "shieldCheck", "database"],
  contactIconKey: ["mail", "mapPin"],
  proofType: ["dashboard", "report", "survey", "export"],
  accent: ["accentBlue", "primary"],
} as const;
