import { ExternalLink, FileText } from "lucide-react";
import { resolveReferenceProjectPreview } from "@/lib/reference-projects";
import { cn } from "@/lib/utils";

type ReferenceProjectCardProps = {
  title: string;
  href: string;
  previewImage?: string;
  previewAlt?: string;
  className?: string;
};

const ReferenceProjectCard = ({
  title,
  href,
  previewImage,
  previewAlt,
  className,
}: ReferenceProjectCardProps) => {
  const resolvedPreview = resolveReferenceProjectPreview({ href, previewImage, previewAlt, title });

  return (
    <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={cn(
      "group flex items-start justify-between gap-4 rounded-[1.35rem] border border-border/70 bg-card/95 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-blue/25 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
      className,
    )}
  >
    <div className="flex min-w-0 flex-1 items-start gap-4">
      <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.1rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(240,247,252,0.9))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:h-24 sm:w-32 dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.82),rgba(8,15,28,0.88))]">
        {resolvedPreview.imageSrc ? (
          <img
            src={resolvedPreview.imageSrc}
            alt={resolvedPreview.alt}
            className="h-full w-full rounded-[0.8rem] object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-[0.8rem] bg-white/65 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-white/10 dark:text-slate-200">
            <FileText size={16} className="mb-2 text-accent-blue" />
            <span>No preview</span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <span className="text-sm leading-6 text-foreground">{title}</span>
        {resolvedPreview.imageSrc ? (
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-accent-blue">Preview available</p>
        ) : (
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Link only</p>
        )}
      </div>
    </div>
    <ExternalLink
      size={16}
      className="mt-1 shrink-0 text-accent-blue transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  </a>
  );
};

export default ReferenceProjectCard;
