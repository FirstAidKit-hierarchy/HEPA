import { useEffect } from "react";
import { ArrowLeft, BookOpenText, ImageIcon, Link2 } from "lucide-react";
import { ActionBanner, ReferenceProjectCard, Reveal, SectionHeading, SiteLink } from "@/components/common";
import { Footer, Navbar } from "@/components/layout";
import { useSiteContent } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { hasReferenceProjectPreview } from "@/lib/reference-projects";
import { REFERENCE_PROJECTS_TITLE } from "./config";

function upsertMeta(name: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
}

const ReferenceProjectsPage = () => {
  const {
    siteContent: {
      home: { insights },
    },
  } = useSiteContent();
  const { publishedReferencesHeading, publishedReferences } = insights;
  const previewCount = publishedReferences.filter((reference) => hasReferenceProjectPreview(reference)).length;
  const pageDescription =
    "Browse HEPA reference projects and published work in one dedicated library, with direct links to the original external publications.";

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = upsertMeta("description");
    const previousDescription = descriptionMeta.getAttribute("content");

    document.title = REFERENCE_PROJECTS_TITLE;
    descriptionMeta.setAttribute("content", pageDescription);

    return () => {
      document.title = previousTitle;

      if (previousDescription) {
        descriptionMeta.setAttribute("content", previousDescription);
        return;
      }

      descriptionMeta.remove();
    };
  }, [pageDescription]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="overflow-x-clip">
        <section className="relative overflow-hidden pt-24 sm:pt-28">
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg, rgba(36, 48, 66, 0.34) 0%, rgba(24, 36, 52, 0.5) 100%),
                radial-gradient(circle at 78% 18%, rgba(43, 138, 191, 0.2) 0%, transparent 40%)
              `,
            }}
          />
          <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-[#2B8ABF]/16 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#7ED957]/10 blur-3xl sm:h-[18rem] sm:w-[18rem]" />

          <div className="section-container relative z-10 py-16 pb-20 sm:py-20">
            <Reveal>
              <div className="max-w-4xl">
                <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-sky-50 shadow-[0_10px_30px_rgba(8,15,28,0.18)]">
                  <Link2 size={16} className="mr-2 text-[#79D3FF]" />
                  {publishedReferencesHeading.eyebrow}
                </div>
                <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_10px_35px_rgba(8,15,28,0.24)] sm:text-5xl lg:text-6xl">
                  Reference projects
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-slate-100/82 sm:text-lg">
                  {pageDescription}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
                    {publishedReferences.length} published references
                  </div>
                  <div className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
                    {previewCount} preview images
                  </div>
                  <div className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
                    Direct external source links
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button variant="hero" size="lg" asChild className="rounded-full px-6">
                    <SiteLink href="#contact">Discuss a similar project</SiteLink>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="rounded-full border-white/15 bg-white/10 px-6 text-white hover:bg-white/14 hover:text-white"
                  >
                    <SiteLink href="#insights">
                      <ArrowLeft size={16} />
                      Back to home
                    </SiteLink>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="section-container">
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start">
                <SectionHeading
                  align="left"
                  eyebrow={publishedReferencesHeading.eyebrow}
                  title={publishedReferencesHeading.title}
                  description="The full set of HEPA reference projects now lives here so visitors can browse published work without overloading the home page."
                />

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-border/70 bg-card/95 p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
                    <BookOpenText size={18} className="text-accent-blue" />
                    <p className="mt-4 text-sm font-semibold text-foreground">Curated library</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">All published references grouped into a dedicated page.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-border/70 bg-card/95 p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
                    <ImageIcon size={18} className="text-accent-blue" />
                    <p className="mt-4 text-sm font-semibold text-foreground">Preview support</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">Preview artwork appears when available and falls back cleanly when it is not.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-border/70 bg-card/95 p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
                    <Link2 size={18} className="text-accent-blue" />
                    <p className="mt-4 text-sm font-semibold text-foreground">Source-first links</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">Each card opens the original external publication in a new tab.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {publishedReferences.length ? (
              <div className="mt-10 grid gap-4 xl:grid-cols-2">
                {publishedReferences.map((reference, index) => (
                  <Reveal key={reference.href} delay={index * 70}>
                    <ReferenceProjectCard {...reference} className="h-full" />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-[1.8rem] border border-dashed border-border/70 bg-card/70 px-6 py-10 text-center text-sm leading-7 text-muted-foreground">
                Reference projects will appear here when published.
              </div>
            )}
          </div>
        </section>

        <ActionBanner
          eyebrow="Next step"
          title="Need a similar evidence package or market-access study?"
          description="Use the HEPA contact form to request a similar reference build, publication workflow, or evidence summary for your own program."
          primaryCta={{ label: "Start a conversation", href: "#contact" }}
          secondaryCta={{ label: "Return to home", href: "/" }}
          className="pt-0"
        />
      </main>
      <Footer />
    </div>
  );
};

export default ReferenceProjectsPage;
