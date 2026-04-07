import { ExternalLink } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/common";
import { insightsContent } from "@/content/home";

const InsightsSection = () => (
  <section id="insights" className="py-16 sm:py-20">
    <div className="section-container">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div>
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow={insightsContent.eyebrow}
              title={insightsContent.title}
              description={insightsContent.description}
            />
          </Reveal>

          <div className="mt-8 space-y-4">
            {insightsContent.featured.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <article className="rounded-[1.8rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
                  <span className="rounded-full border border-accent-blue/15 bg-accent-blue/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent-blue">
                    {item.category}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold leading-tight text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                  <p className="mt-5 text-sm font-semibold text-primary">{item.ctaLabel}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <Reveal delay={120}>
            <div className="rounded-[2rem] border border-border/70 bg-section-gradient p-6 shadow-[0_20px_52px_rgba(15,23,42,0.08)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-blue">
                {insightsContent.publishedReferencesHeading.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-foreground">
                {insightsContent.publishedReferencesHeading.title}
              </h3>
              <div className="mt-6 space-y-4">
                {insightsContent.publishedReferences.map((reference, index) => (
                  <Reveal key={reference.href} delay={index * 70}>
                    <a
                      href={reference.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start justify-between gap-4 rounded-[1.35rem] border border-border/70 bg-card/95 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-blue/25 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                    >
                      <span className="text-sm leading-6 text-foreground">{reference.title}</span>
                      <ExternalLink size={16} className="mt-1 shrink-0 text-accent-blue transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default InsightsSection;
