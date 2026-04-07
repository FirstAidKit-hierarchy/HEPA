import { Reveal, SectionHeading } from "@/components/common";
import { workflowContent } from "@/content/home";

const HowItWorksSection = () => (
  <section className="py-16 sm:py-20">
    <div className="section-container">
      <Reveal>
        <SectionHeading
          eyebrow={workflowContent.eyebrow}
          title={workflowContent.title}
          description={workflowContent.description}
        />
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {workflowContent.steps.map((step, index) => (
          <Reveal key={step.step} delay={index * 90}>
            <article className="relative h-full overflow-hidden rounded-[1.85rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(43,138,191,0.75),rgba(126,217,87,0.6))]" />
              <div className="flex items-start justify-between gap-4">
                <span className="text-4xl font-bold tracking-tight text-accent-blue/18">{step.step}</span>
                <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-8 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
