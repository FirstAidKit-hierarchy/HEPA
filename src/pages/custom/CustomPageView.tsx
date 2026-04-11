import { useEffect } from "react";
import { CheckCircle2, FileText, Link2, Sparkles } from "lucide-react";
import { ActionBanner, ActionButtons } from "@/components/common";
import { Footer, Navbar } from "@/components/layout";
import type { CustomPage, CustomPageBlock } from "@/content/site/defaults";
import { cn } from "@/lib/utils";

function upsertMeta(name: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
}

const hasAction = (label: string, href: string) => label.trim().length > 0 && href.trim().length > 0;

const getActionPair = (block: CustomPageBlock) => {
  const primaryAction = hasAction(block.primaryAction.label, block.primaryAction.href) ? block.primaryAction : null;
  const secondaryAction = hasAction(block.secondaryAction.label, block.secondaryAction.href) ? block.secondaryAction : null;

  if (primaryAction) {
    return {
      primaryAction,
      secondaryAction: secondaryAction ?? undefined,
    };
  }

  if (secondaryAction) {
    return {
      primaryAction: secondaryAction,
      secondaryAction: undefined,
    };
  }

  return {
    primaryAction: undefined,
    secondaryAction: undefined,
  };
};

const renderBlock = (block: CustomPageBlock, index: number) => {
  const items = block.items.filter((item) => item.trim().length > 0);
  const { primaryAction, secondaryAction } = getActionPair(block);

  switch (block.type) {
    case "hero":
      return (
        <section key={block.id} className="py-14 sm:py-20">
          <div className="section-container">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#79D3FF]">{block.eyebrow}</p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-[2.75rem]">{block.title}</h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-100/82 sm:text-lg">{block.description}</p>
                {primaryAction ? (
                  <ActionButtons
                    primaryCta={primaryAction}
                    secondaryCta={secondaryAction}
                    className="mt-8"
                    primaryClassName="w-full sm:w-auto"
                  />
                ) : null}
              </div>

              <aside className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-6 shadow-[0_20px_60px_rgba(8,15,28,0.18)] backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-100">
                  <Sparkles size={18} className="text-[#79D3FF]" />
                  Build highlights
                </div>
                <div className="mt-6 space-y-4">
                  {(items.length ? items : [block.body]).filter(Boolean).map((item) => (
                    <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#7ED957]" />
                        <p className="text-sm leading-7 text-slate-100">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>
      );

    case "checklist":
      return (
        <section key={block.id} className={cn("py-14 sm:py-16", index % 2 === 0 ? "bg-white/[0.02]" : "")}>
          <div className="section-container">
            <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-blue">{block.eyebrow}</p>
              <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)] lg:items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground sm:text-[2rem]">{block.title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{block.description}</p>
                </div>
                {primaryAction ? (
                  <ActionButtons
                    primaryCta={primaryAction}
                    secondaryCta={secondaryAction}
                    className="lg:justify-end"
                    primaryClassName="text-center"
                  />
                ) : null}
              </div>

              <ul className="mt-8 grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <li key={item} className="rounded-[1.5rem] border border-border/60 bg-background/70 px-5 py-4 text-sm leading-7 text-foreground/88">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-1 shrink-0 text-primary" />
                      <span>{item}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      );

    case "cta":
      return (
        <ActionBanner
          key={block.id}
          eyebrow={block.eyebrow}
          title={block.title}
          description={block.description}
          primaryCta={primaryAction ?? { label: "Contact HEPA", href: "#contact" }}
          secondaryCta={secondaryAction}
          className="py-14 sm:py-16"
        />
      );

    case "content":
    default:
      return (
        <section key={block.id} className={cn("py-14 sm:py-16", index % 2 === 0 ? "bg-white/[0.02]" : "")}>
          <div className="section-container">
            <div className="grid gap-8 lg:grid-cols-[minmax(240px,0.85fr)_minmax(0,1.15fr)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-blue">{block.eyebrow}</p>
                <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-[2rem]">{block.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{block.description}</p>
              </div>

              <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)] sm:p-8">
                <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <FileText size={18} className="text-accent-blue" />
                  Supporting copy
                </div>
                <p className="mt-5 whitespace-pre-line text-sm leading-8 text-muted-foreground sm:text-base">{block.body || block.description}</p>
              </div>
            </div>
          </div>
        </section>
      );
  }
};

const CustomPageView = ({ page }: { page: CustomPage }) => {
  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = upsertMeta("description");
    const previousDescription = descriptionMeta.getAttribute("content");

    document.title = `${page.title} | HEPA`;
    descriptionMeta.setAttribute("content", page.description);

    return () => {
      document.title = previousTitle;

      if (previousDescription) {
        descriptionMeta.setAttribute("content", previousDescription);
        return;
      }

      descriptionMeta.remove();
    };
  }, [page.description, page.title]);

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
            <div className="max-w-4xl">
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-sky-50 shadow-[0_10px_30px_rgba(8,15,28,0.18)]">
                <Link2 size={16} className="mr-2 text-[#79D3FF]" />
                {page.navigationLabel}
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_10px_35px_rgba(8,15,28,0.24)] sm:text-5xl lg:text-6xl">
                {page.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-100/82 sm:text-lg">{page.description}</p>
            </div>
          </div>
        </section>

        {page.blocks.length ? (
          page.blocks.map((block, index) => renderBlock(block, index))
        ) : (
          <section className="py-14 sm:py-16">
            <div className="section-container">
              <div className="rounded-[2rem] border border-dashed border-border bg-card/70 px-6 py-10 text-center text-sm leading-7 text-muted-foreground">
                This page does not have any blocks yet. Open the admin builder to add the first section.
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CustomPageView;
