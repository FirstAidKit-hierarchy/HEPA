type FeaturedInsight = {
  category: string;
  title: string;
  description: string;
  ctaLabel: string;
};

type PublishedReference = {
  title: string;
  href: string;
  previewImage?: string;
  previewAlt?: string;
};

export const insightsContent = {
  eyebrow: "Insights and published work",
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
      previewImage: "/ted-ksa-preview.svg",
      previewAlt: "Preview slide for thyroid eye disease economic burden in Saudi Arabia",
    },
    {
      title: "Economic Burden Impact of Thyroid Eye Disease in the United Arab Emirates",
      href: "https://www.ispor.org/heor-resources/presentations-database/presentation/intl2024-3900/137608",
    },
    {
      title:
        "A Cost-Consequence Analysis of Adopting Chimeric Antigen Receptor T-Cell Therapy for Patients with Relapsed or Refractory Large B-Cell Lymphoma in Saudi Arabia",
      href: "https://www.valueinhealthjournal.com/article/S1098-3015(23)00456-4/fulltext",
      previewImage: "/cart-saudi-preview.svg",
      previewAlt: "Preview slide for CAR-T therapy cost-consequence analysis in Saudi Arabia",
    },
    {
      title: "Budget Impact Analysis of Adopting Lanreotide in the Treatment of Acromegaly and GEP-NET in Saudi Arabia",
      href: "https://www.valueinhealthjournal.com/article/S1098-3015(23)00570-3/fulltext",
      previewImage: "/lanreotide-saudi-preview.svg",
      previewAlt: "Preview slide for lanreotide budget impact analysis in Saudi Arabia",
    },
    {
      title:
        "A Cost-Consequence Analysis of Chimeric Antigen Receptor T-Cell Therapy in Patients with Relapsed or Refractory Large B-Cell Lymphoma Across Gulf Cooperation Council Countries",
      href: "https://www.ispor.org/docs/default-source/euro2024/cart-gcc-poster-for-ispor-2024143901-pdf.pdf?sfvrsn=5c241772_0",
      previewImage: "/cart-gcc-preview.svg",
      previewAlt: "Preview slide for CAR-T therapy cost-consequence analysis across GCC countries",
    },
    {
      title: "Economic Impact of Adopting Lanreotide for Patients with Acromegaly and Gep-Net in Qatar",
      href: "https://www.ispor.org/heor-resources/presentations-database/presentation/euro2024-4015/143928",
      previewImage: "/lanreotide-qatar-preview.svg",
      previewAlt: "Preview slide for lanreotide economic impact analysis in Qatar",
    },
    {
      title:
        "The Five-Year Budget Impact of Introducing Semaglutide 2.4 mg for Obesity Management in Saudi Arabia: A Real-World Patient Flow and Complication-Driven Model",
      href: "https://www.ispor.org/heor-resources/presentations-database/presentation-cti/ispor-europe-2025/poster-session-5-2/the-five-year-budget-impact-of-introducing-semaglutide-2-4-mg-for-obesity-management-in-saudi-arabia-a-real-world-patient-flow-and-complication-driven-model",
      previewImage: "/semaglutide-saudi-preview.svg",
      previewAlt: "Preview slide for semaglutide budget impact analysis in Saudi Arabia",
    },
  ] satisfies PublishedReference[],
};
