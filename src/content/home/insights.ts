type FeaturedInsight = {
  category: string;
  title: string;
  description: string;
  ctaLabel: string;
};

type PublishedReference = {
  title: string;
  href: string;
};

export const insightsContent = {
  eyebrow: "Insights And Published Work",
  title: "Thought leadership, market updates, and reference projects teams can build on",
  description:
    "Use this section for HEPA articles, downloadable reports, and GCC access insights. The featured cards are placeholders until approved editorial content is available.",
  // Placeholder insight cards below should be replaced with approved editorial titles, links, and summaries.
  featured: [
    {
      category: "Placeholder Article",
      title: "GCC pricing benchmark planning for launch teams",
      description: "Placeholder summary for an article or downloadable report about launch pricing preparation.",
      ctaLabel: "Add Article Link",
    },
    {
      category: "Placeholder Market Update",
      title: "What access teams should validate before stakeholder research begins",
      description: "Placeholder summary for a short market-access update or checklist.",
      ctaLabel: "Add Update Link",
    },
    {
      category: "Placeholder Report",
      title: "Designing better survey inputs for evidence and reimbursement questions",
      description: "Placeholder summary for a static report or gated PDF preview.",
      ctaLabel: "Add Report Link",
    },
  ] satisfies FeaturedInsight[],
  publishedReferencesHeading: {
    eyebrow: "Published references",
    title: "Existing HEPA reference projects from the current site",
  },
  publishedReferences: [
    {
      title: "The Economic Burden of Thyroid Eye Disease in the Kingdom of Saudi Arabia",
      href: "https://www.ispor.org/heor-resources/presentations-database/presentation/intl2024-3900/137643",
    },
    {
      title: "Economic Burden Impact of Thyroid Eye Disease in the United Arab Emirates",
      href: "https://www.ispor.org/heor-resources/presentations-database/presentation/intl2024-3900/137608",
    },
    {
      title:
        "A Cost-Consequence Analysis of Adopting Chimeric Antigen Receptor T-Cell Therapy for Patients with Relapsed or Refractory Large B-Cell Lymphoma in Saudi Arabia",
      href: "https://www.valueinhealthjournal.com/article/S1098-3015(23)00456-4/fulltext",
    },
    {
      title: "Budget Impact Analysis of Adopting Lanreotide in the Treatment of Acromegaly and GEP-NET in Saudi Arabia",
      href: "https://www.valueinhealthjournal.com/article/S1098-3015(23)00570-3/fulltext",
    },
    {
      title: "Economic Impact of Adopting Lanreotide for Patients with Acromegaly and GEP-NET in Qatar",
      href: "https://www.ispor.org/heor-resources/presentations-database/presentation/euro2024-4015/143928",
    },
  ] satisfies PublishedReference[],
};
