import { ExternalLink } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/common";
import { useSiteContent } from "@/components/providers";

const ReferenceCard = ({
  title,
  href,
  previewImage,
  previewAlt,
}: {
  title: string;
  href: string;
  previewImage?: string;
  previewAlt?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="group flex items-start justify-between gap-4 rounded-[1.35rem] border border-border/70 bg-card/95 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-blue/25 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
  >
    <div className="flex min-w-0 flex-1 items-start gap-4">
      {previewImage ? (
        <div className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-[1.1rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(240,247,252,0.9))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:flex dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.82),rgba(8,15,28,0.88))]">
          <img
            src={previewImage}
            alt={previewAlt ?? title}
            className="h-full w-full rounded-[0.8rem] object-contain"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="min-w-0">
        <span className="text-sm leading-6 text-foreground">{title}</span>
        {previewImage ? (
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-blue">Preview available</p>
        ) : null}
      </div>
    </div>
    <ExternalLink size={16} className="mt-1 shrink-0 text-accent-blue transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </a>
);

const InsightsSection = () => {
  const {
    siteContent: {
      home: { insights },
    },
  } = useSiteContent();
  const { eyebrow, title, description, featured, publishedReferences, publishedReferencesHeading } = insights;

  return (
    <section id="insights" className="py-16 sm:py-20">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div>
            <Reveal>
              <SectionHeading align="left" eyebrow={eyebrow} title={title} description={description} />
            </Reveal>

            <div className="mt-8 space-y-4">
              {featured.map((item, index) => (
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
                  {publishedReferencesHeading.eyebrow}
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-foreground">{publishedReferencesHeading.title}</h3>
                <div className="mt-6 space-y-4">
                  {publishedReferences.map((reference, index) => (
                    <Reveal key={reference.href} delay={index * 70}>
                      <ReferenceCard {...reference} />
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
};

export default InsightsSection;
