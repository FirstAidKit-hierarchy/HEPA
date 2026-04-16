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
import { normalizeOptionalPagePath, normalizePagePath } from "@/lib/site-pages";

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

const createDraftId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
};

export const cloneValue = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as T;
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneValue(item)])) as T;
  }

  return value;
};

export type CustomPageBlockType = "hero" | "content" | "checklist" | "cta";

export type CustomPageAction = {
  label: string;
  href: string;
};

export type CustomPageBlock = {
  id: string;
  type: CustomPageBlockType;
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  items: string[];
  primaryAction: CustomPageAction;
  secondaryAction: CustomPageAction;
};

export type CustomPage = {
  id: string;
  title: string;
  navigationLabel: string;
  path: string;
  description: string;
  blocks: CustomPageBlock[];
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

const isCustomPageBlockType = (value: unknown): value is CustomPageBlockType =>
  value === "hero" || value === "content" || value === "checklist" || value === "cta";

const createCustomPageActionDraft = (label: string, href: string): CustomPageAction => ({
  label,
  href,
});

export const createCustomPageBlockDraft = (type: CustomPageBlockType = "content"): CustomPageBlock => {
  const blockId = createDraftId("block");

  switch (type) {
    case "hero":
      return {
        id: blockId,
        type,
        eyebrow: "Page intro",
        title: "Explain what this page is about",
        description: "Use this first block to frame the offer, audience, or event before the detail sections begin.",
        body: "",
        items: ["Trusted delivery", "Clear next step", "Ready for launch"],
        primaryAction: createCustomPageActionDraft("Contact HEPA", "#contact"),
        secondaryAction: createCustomPageActionDraft("Back to home", "/"),
      };
    case "checklist":
      return {
        id: blockId,
        type,
        eyebrow: "Checklist",
        title: "Show the key actions or deliverables",
        description: "Drag this block where you want visitors to scan the main takeaways.",
        body: "",
        items: ["Add your first point", "Add your second point", "Add your third point"],
        primaryAction: createCustomPageActionDraft("Start a conversation", "#contact"),
        secondaryAction: createCustomPageActionDraft("Learn more", "/"),
      };
    case "cta":
      return {
        id: blockId,
        type,
        eyebrow: "Call to action",
        title: "Invite the visitor to take the next step",
        description: "Use this block near the end of the page to direct users to a form, another page, or an external resource.",
        body: "",
        items: [],
        primaryAction: createCustomPageActionDraft("Get in touch", "#contact"),
        secondaryAction: createCustomPageActionDraft("Browse services", "/"),
      };
    case "content":
    default:
      return {
        id: blockId,
        type: "content",
        eyebrow: "Content section",
        title: "Add a supporting section",
        description: "Use this space for proof points, service details, or a short explanation.",
        body: "Write a short paragraph that expands on the section title and gives the visitor useful context.",
        items: [],
        primaryAction: createCustomPageActionDraft("", ""),
        secondaryAction: createCustomPageActionDraft("", ""),
      };
  }
};

export const createCustomPageDraft = (): CustomPage => {
  const pageId = createDraftId("page");
  const pathSuffix = pageId.slice(-4);

  return {
    id: pageId,
    title: "New page",
    navigationLabel: "New page",
    path: normalizePagePath(`/new-page-${pathSuffix}`),
    description: "Create a new landing page, workshop page, or service page with drag-and-drop content blocks.",
    blocks: [createCustomPageBlockDraft("hero"), createCustomPageBlockDraft("content")],
  };
};

const normalizeCustomPageBlock = (value: unknown, fallbackType: CustomPageBlockType = "content"): CustomPageBlock => {
  const source = isPlainObject(value) ? value : {};
  const blockType = isCustomPageBlockType(source.type) ? source.type : fallbackType;

  return mergeWithTemplate(createCustomPageBlockDraft(blockType), {
    ...source,
    id: typeof source.id === "string" && source.id.trim().length > 0 ? source.id : createDraftId("block"),
  });
};

const normalizeCustomPage = (value: unknown): CustomPage => {
  const template = createCustomPageDraft();
  const source = isPlainObject(value) ? value : {};
  const blocksSource = Array.isArray(source.blocks) ? source.blocks : template.blocks;
  const merged = mergeWithTemplate(
    {
      ...template,
      blocks: [] as CustomPageBlock[],
    },
    {
      ...source,
      blocks: [],
    },
  );

  return {
    ...merged,
    path: normalizePagePath(typeof source.path === "string" ? source.path : template.path),
    blocks: blocksSource.map((block, index) => normalizeCustomPageBlock(block, index === 0 ? "hero" : "content")),
  };
};

const footerDescription =
  "Decision-ready evidence, pricing research, and market access support for healthcare teams across Saudi Arabia and the GCC.";

const contactBriefChecklist = [
  "The product, therapy area, or access question you are working on",
  "The GCC market or stakeholder audience you need to understand",
  "The output you need, such as a report, dashboard, survey workflow, or insight export",
];

const baseSiteContent = {
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
      supportingPanelEyebrow: "What teams can review",
    },
    caseStudies: {
      ...cloneValue(caseStudiesContent),
      badgeLabel: "Project snapshot",
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
      })),
      testimonial: { ...trustContent.testimonial },
      launchChecklist: {
        eyebrow: "What teams can expect",
        items: [
          "Regional pricing and access context across GCC markets",
          "Structured evidence and stakeholder-input workflows",
          "Decision-ready reports, dashboards, and export packages",
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
      submissionRecipientEmail: contactContent.submissionRecipientEmail,
      submissionCcEmails: [...contactContent.submissionCcEmails],
      actions: contactContent.actions.map((action) => ({ ...action })),
      successMessage: { ...contactContent.successMessage },
      errorMessage: { ...contactContent.errorMessage },
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
      items: partners.map((partner) => ({
        name: partner.name,
        lightLogo: partner.lightLogo ?? "",
        darkLogo: partner.darkLogo ?? "",
      })),
    },
  },
  notFoundPageRoute: {
    aliasPath: "",
  },
  notFoundPage: {
    title: "Page not found",
    buttonLabel: "Return to the page",
    buttonHref: "/",
  },
};

type BaseSiteContent = typeof baseSiteContent;

export type SiteContent = BaseSiteContent & {
  customPages: CustomPage[];
};

export const defaultSiteContent: SiteContent = {
  ...baseSiteContent,
  customPages: [],
};

export const normalizeSiteContent = (value: unknown): SiteContent => {
  const source = isPlainObject(value) ? value : {};
  const merged = mergeWithTemplate(defaultSiteContent, {
    ...source,
    customPages: [],
  });
  const customPagesSource = Array.isArray(source.customPages) ? source.customPages : defaultSiteContent.customPages;

  return {
    ...merged,
    notFoundPageRoute: {
      aliasPath: normalizeOptionalPagePath(
        isPlainObject(source.notFoundPageRoute) && typeof source.notFoundPageRoute.aliasPath === "string"
          ? source.notFoundPageRoute.aliasPath
          : defaultSiteContent.notFoundPageRoute.aliasPath,
      ),
    },
    customPages: customPagesSource.map((page) => normalizeCustomPage(page)),
  };
};

export const createSiteContentDraft = (value: unknown = defaultSiteContent) => normalizeSiteContent(value);

export const siteContentSelectOptions = {
  audienceIconKey: ["pill", "activity", "flaskConical", "barChart3", "shieldCheck"],
  solutionIconKey: ["fileBarChart", "search", "graduationCap", "heartPulse"],
  trustIconKey: ["globe", "workflow", "users", "shieldCheck", "database"],
  contactIconKey: ["mail", "mapPin"],
  proofType: ["dashboard", "report", "survey", "export"],
  accent: ["accentBlue", "primary"],
} as const;
