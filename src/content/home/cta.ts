type CtaLink = {
  label: string;
  href: string;
};

type CtaPanel = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: CtaLink;
};

export const sharedCtas = {
  primary: {
    label: "Talk with us",
    href: "#contact",
  },
};

export const ctaPanels = {
  capabilities: {
    eyebrow: "Need clarity on a live access or launch question?",
    title: "Start with a focused conversation before you scope the work.",
    description:
      "Use HEPA when your team needs local evidence, stakeholder input, or structured pricing and access outputs for an active project.",
    primaryCta: sharedCtas.primary,
  },
  final: {
    eyebrow: "Want to see the format before you commit?",
    title: "Ask HEPA for the kind of report, dashboard, or survey output your team needs.",
    description:
      "We can talk through the problem, the audience, and the right delivery format for pricing, market access, medical affairs, or regulatory planning.",
    primaryCta: sharedCtas.primary,
  },
} satisfies Record<string, CtaPanel>;
