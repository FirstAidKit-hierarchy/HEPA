import { Reveal, SectionHeading } from "@/components/common";
import { useSiteContent } from "@/components/providers";

const caseStudySections = [
  { label: "Challenge", key: "challenge" },
  { label: "Solution", key: "solution" },
  { label: "Result", key: "result" },
] as const;

const CaseStudiesSection = () => {
  const {
    siteContent: {
      home: { caseStudies },
    },
  } = useSiteContent();

  return (
    <section id="case-studies" className="bg-section-gradient py-16 sm:py-20">
      <div className="section-container">
        <Reveal>
          <SectionHeading eyebrow={caseStudies.eyebrow} title={caseStudies.title} description={caseStudies.description} />
        </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {caseStudies.studies.map((study, index) => (
          <Reveal key={study.title} delay={index * 90}>
            <article className="h-full overflow-hidden rounded-[1.9rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.07)] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-accent-blue/15 bg-accent-blue/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent-blue">
                  {study.clientType}
                </span>
                <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  {caseStudies.badgeLabel}
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold leading-tight text-foreground">{study.title}</h3>
              <div className="mt-6 space-y-4">
                {caseStudySections.map((section) => (
                  <div key={section.label} className="rounded-[1.35rem] border border-border/70 bg-background/70 p-4">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-foreground/75">{section.label}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{study[section.key]}</p>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
