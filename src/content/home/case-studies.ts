type CaseStudy = {
  clientType: string;
  title: string;
  challenge: string;
  solution: string;
  result: string;
};

// Placeholder case studies below must be replaced with approved client-facing summaries before launch.
export const caseStudiesContent = {
  eyebrow: "Case Studies",
  title: "Example project structures for market access and evidence teams",
  description:
    "These scenarios are realistic placeholders based on the type of work HEPA supports. Replace them with approved case-study copy when available.",
  studies: [
    {
      clientType: "Regional Pharma Company",
      title: "GCC launch pricing benchmarking",
      challenge:
        "The team needed a clearer view of local pricing assumptions and stakeholder considerations before launch planning moved forward.",
      solution:
        "HEPA structured pricing inputs, stakeholder questions, and a comparison-ready dashboard for internal review.",
      result:
        "Placeholder result: the team received a clearer basis for pricing and access planning discussions.",
    },
    {
      clientType: "Specialty Care Launch Team",
      title: "Evidence generation for access strategy",
      challenge:
        "The team needed local evidence inputs and a stronger structure for communicating value in an access discussion.",
      solution:
        "HEPA combined evidence planning, local expert validation, and report packaging around the access question.",
      result:
        "Placeholder result: stakeholders had a more structured evidence package for internal decision-making.",
    },
    {
      clientType: "Global Medtech Team",
      title: "Stakeholder survey for reimbursement insights",
      challenge:
        "The team needed better insight into local stakeholder priorities before refining its reimbursement approach.",
      solution:
        "HEPA designed the survey flow, organized the input capture, and translated responses into summary outputs.",
      result:
        "Placeholder result: the team had a clearer picture of local concerns and discussion points.",
    },
  ] satisfies CaseStudy[],
};
