import ActionButtons from "./ActionButtons";
import { cn } from "@/lib/utils";

type CtaLink = {
  label: string;
  href: string;
};

type ActionBannerProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  className?: string;
};

const ActionBanner = ({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
}: ActionBannerProps) => (
  <section className={cn("overflow-x-clip py-10 sm:py-12", className)}>
    <div className="section-container">
      <div className="relative mx-auto w-full max-w-full overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(14,185,94,0.08),rgba(43,138,191,0.08),rgba(255,255,255,0.75))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(126,217,87,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(43,138,191,0.16),_transparent_32%)]" />
        <div className="relative z-10 flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-accent-blue">{eyebrow}</p>
            <h2 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">{title}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{description}</p>
          </div>
          <ActionButtons
            primaryCta={primaryCta}
            secondaryCta={secondaryCta}
            secondaryVariant="outline"
            className="lg:w-auto"
            primaryClassName="text-center"
            secondaryClassName="border-primary/25 bg-background/80 text-center text-foreground hover:bg-primary hover:text-primary-foreground"
          />
        </div>
      </div>
    </div>
  </section>
);

export default ActionBanner;
