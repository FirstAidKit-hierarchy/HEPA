type WorkflowStep = {
  step: string;
  title: string;
  description: string;
};

export const workflowContent = {
  eyebrow: "How It Works",
  title: "A simple path from project question to decision-ready output",
  description:
    "The workflow is designed to help healthcare teams move from a business need to a structured report, dashboard, or insight package.",
  steps: [
    {
      step: "01",
      title: "Tell us your need",
      description: "Share the question, product context, market focus, and team you need to support.",
    },
    {
      step: "02",
      title: "We collect and structure the data",
      description: "HEPA organizes local inputs, surveys, expert feedback, and evidence requirements around the brief.",
    },
    {
      step: "03",
      title: "We deliver reports, dashboards, or insights",
      description: "The outputs are shaped for internal review, stakeholder discussion, and decision support.",
    },
    {
      step: "04",
      title: "We support decision-making",
      description: "Teams use the deliverables to align on pricing, access, evidence, and next-step planning.",
    },
  ] satisfies WorkflowStep[],
};
