import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) => {
  const isCentered = align === "center";

  return (
    <div className={cn("max-w-3xl", isCentered && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent-blue">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{title}</h2>
      {description ? (
        <p className={cn("mt-4 leading-relaxed text-muted-foreground", !isCentered && "max-w-2xl")}>
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
