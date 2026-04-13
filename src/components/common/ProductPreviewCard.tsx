import { cn } from "@/lib/utils";

type ProductPreviewType = "dashboard" | "report" | "survey" | "export";

type ProductPreviewCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  previewType: ProductPreviewType;
  tags: string[];
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

const IllustrativePreview = ({ previewType }: { previewType: ProductPreviewType }) => {
  switch (previewType) {
    case "dashboard":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {["42", "7", "12"].map((value, index) => (
              <div key={index} className="rounded-xl border border-white/55 bg-white/90 p-3 shadow-sm">
                <div className="h-2.5 w-16 rounded-full bg-slate-200" />
                <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
                <div className="mt-2 h-2 w-20 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[1.35fr_0.65fr] gap-3">
            <div className="rounded-2xl border border-white/55 bg-white/95 p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2.5 w-20 rounded-full bg-slate-200" />
                <div className="h-2.5 w-12 rounded-full bg-emerald-200" />
              </div>
              <div className="flex h-40 items-end gap-3">
                {[55, 82, 68, 96, 74, 88].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-xl bg-[linear-gradient(180deg,rgba(43,138,191,0.85),rgba(126,217,87,0.9))]"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {["Price signal", "Access risk", "Review note"].map((label) => (
                <div key={label} className="rounded-2xl border border-white/55 bg-white/92 p-3 shadow-sm">
                  <div className="h-2.5 w-20 rounded-full bg-slate-200" />
                  <div className="mt-4 h-10 rounded-xl bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "report":
      return (
        <div className="grid h-full grid-cols-[0.72fr_0.28fr] gap-3">
          <div className="rounded-2xl border border-white/55 bg-white/95 p-4 shadow-sm">
            <div className="mb-4 h-3 w-28 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-2.5 w-full rounded-full bg-slate-100" />
              <div className="h-2.5 w-[92%] rounded-full bg-slate-100" />
              <div className="h-2.5 w-[88%] rounded-full bg-slate-100" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="h-2.5 w-14 rounded-full bg-slate-200" />
                <div className="mt-3 h-20 rounded-xl bg-[linear-gradient(180deg,rgba(43,138,191,0.15),rgba(43,138,191,0.05))]" />
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="h-2.5 w-16 rounded-full bg-slate-200" />
                <div className="mt-3 h-20 rounded-xl bg-[linear-gradient(180deg,rgba(126,217,87,0.15),rgba(126,217,87,0.05))]" />
              </div>
            </div>
            <div className="mt-5 h-16 rounded-2xl bg-slate-50" />
          </div>
          <div className="space-y-3">
            {["Executive summary", "Recommendation", "Appendix"].map((label) => (
              <div key={label} className="rounded-2xl border border-white/55 bg-white/92 p-3 shadow-sm">
                <div className="h-2.5 w-20 rounded-full bg-slate-200" />
                <div className="mt-4 h-14 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      );
    case "survey":
      return (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/55 bg-white/95 p-4 shadow-sm">
            <div className="h-2.5 w-24 rounded-full bg-slate-200" />
            <div className="mt-4 h-3 w-[84%] rounded-full bg-slate-100" />
            <div className="mt-2 h-3 w-[62%] rounded-full bg-slate-100" />
          </div>
          <div className="space-y-3">
            {["Decision maker segment", "Therapeutic area", "Questionnaire block"].map((label, index) => (
              <div key={label} className="rounded-2xl border border-white/55 bg-white/92 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="h-2.5 w-24 rounded-full bg-slate-200" />
                  <div className={cn("h-6 w-14 rounded-full", index === 1 ? "bg-accent-blue/20" : "bg-primary/20")} />
                </div>
                <div className="mt-4 grid gap-2">
                  <div className="h-11 rounded-xl bg-slate-50" />
                  <div className="h-11 rounded-xl bg-slate-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "export":
      return (
        <div className="grid h-full grid-cols-[0.62fr_0.38fr] gap-3">
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/55 bg-white/95 p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="h-2.5 w-20 rounded-full bg-slate-200" />
                <div className="h-7 w-24 rounded-full bg-primary/15" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="h-2.5 w-10 rounded-full bg-slate-200" />
                  <div className="mt-3 text-2xl font-semibold text-slate-900">PDF</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="h-2.5 w-10 rounded-full bg-slate-200" />
                  <div className="mt-3 text-2xl font-semibold text-slate-900">XLS</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/55 bg-white/92 p-4 shadow-sm">
              <div className="h-2.5 w-24 rounded-full bg-slate-200" />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-20 rounded-xl bg-slate-50" />
                <div className="h-20 rounded-xl bg-slate-50" />
                <div className="h-20 rounded-xl bg-slate-50" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {["Summary pack", "Dashboard file", "Stakeholder export"].map((label) => (
              <div key={label} className="rounded-2xl border border-white/55 bg-white/92 p-3 shadow-sm">
                <div className="h-2.5 w-20 rounded-full bg-slate-200" />
                <div className="mt-4 h-16 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

const ProductPreviewCard = ({
  eyebrow,
  title,
  description,
  previewType,
  tags,
  imageSrc,
  imageAlt,
  className,
}: ProductPreviewCardProps) => (
  <article
    className={cn(
      "group overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-[0_18px_44px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:border-accent-blue/25 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)]",
      className,
    )}
  >
    <div className="border-b border-border/60 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-blue">{eyebrow}</p>
        {!imageSrc ? (
          <span className="rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent-blue">
            Workflow view
          </span>
        ) : (
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-primary">
            Preview asset
          </span>
        )}
      </div>
      <h3 className="mt-3 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    <div className="p-5 pt-0 sm:p-6 sm:pt-0">
      <div className="mt-5 rounded-[1.6rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(240,247,252,0.9))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.78),rgba(10,18,32,0.86))]">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <div className="ml-2 h-2.5 w-20 rounded-full bg-border/80" />
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-[1.35rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(43,138,191,0.12),_transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(241,247,252,0.92))] p-3 dark:bg-[radial-gradient(circle_at_top_left,_rgba(43,138,191,0.14),_transparent_36%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(8,15,28,0.92))]">
          {imageSrc ? (
            <img src={imageSrc} alt={imageAlt ?? title} className="h-full w-full rounded-[1rem] object-cover shadow-sm" />
          ) : (
            <IllustrativePreview previewType={previewType} />
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </article>
);

export default ProductPreviewCard;
