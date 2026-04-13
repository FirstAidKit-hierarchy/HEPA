import { ArrowRight, BookOpenText, FolderKanban, ImageIcon } from "lucide-react";
import { Reveal, SectionHeading, SiteLink } from "@/components/common";
import { Button } from "@/components/ui/button";
import { hasReferenceProjectPreview } from "@/lib/reference-projects";
import { useSiteContent } from "@/components/providers";
import { REFERENCE_PROJECTS_PATH } from "@/pages/reference-projects/config";

const InsightsSection = () => {
  const {
    siteContent: {
      home: { insights },
    },
  } = useSiteContent();
  const { eyebrow, title, description, featured, publishedReferences, publishedReferencesHeading } = insights;
  const previewCount = publishedReferences.filter((reference) => hasReferenceProjectPreview(reference)).length;
  const featuredReferenceTitles = publishedReferences.slice(0, 3);

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
                <h3 className="mt-4 text-2xl font-semibold text-foreground">Reference projects now have their own page</h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  The full library of published HEPA reference projects now lives on a dedicated page, so the home page stays focused while the complete archive remains easy to browse.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.35rem] border border-border/70 bg-card/95 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                    <FolderKanban size={18} className="text-accent-blue" />
                    <p className="mt-4 text-sm font-semibold text-foreground">{publishedReferences.length} published projects</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Browse all references in one dedicated archive.</p>
                  </div>
                  <div className="rounded-[1.35rem] border border-border/70 bg-card/95 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                    <ImageIcon size={18} className="text-accent-blue" />
                    <p className="mt-4 text-sm font-semibold text-foreground">{previewCount} preview images</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Preview artwork is shown whenever a reference has one assigned.</p>
                  </div>
                  <div className="rounded-[1.35rem] border border-border/70 bg-card/95 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                    <BookOpenText size={18} className="text-accent-blue" />
                    <p className="mt-4 text-sm font-semibold text-foreground">External source links</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Each project opens the original publication in a new tab.</p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.45rem] border border-border/70 bg-card/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-blue">Featured inside the archive</p>
                  {featuredReferenceTitles.length ? (
                    <ul className="mt-4 space-y-3">
                      {featuredReferenceTitles.map((reference) => (
                        <li key={reference.href} className="text-sm leading-7 text-foreground/88">
                          {reference.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">Published references will appear here when available.</p>
                  )}
                </div>

                <div className="mt-8">
                  <Button variant="hero" size="lg" asChild className="rounded-full px-6">
                    <SiteLink href={REFERENCE_PROJECTS_PATH}>
                      Open reference projects
                      <ArrowRight size={16} />
                    </SiteLink>
                  </Button>
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
