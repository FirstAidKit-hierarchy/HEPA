import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SiteLink from "./SiteLink";

type CtaLink = {
  label: string;
  href: string;
};

type ActionButtonsProps = {
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  secondaryVariant?: "hero-outline" | "outline";
};

const ActionButtons = ({
  primaryCta,
  secondaryCta,
  className,
  primaryClassName,
  secondaryClassName,
  secondaryVariant = "outline",
}: ActionButtonsProps) => (
  <div className={cn("flex min-w-0 w-full flex-col gap-4 sm:w-auto sm:flex-row", className)}>
    <Button
      variant="hero"
      size="lg"
      asChild
      className={cn(
        "w-full min-w-0 shadow-[0_20px_45px_rgba(126,217,87,0.22)] hover:shadow-[0_24px_55px_rgba(43,138,191,0.28)] sm:w-auto",
        primaryClassName,
      )}
    >
      <SiteLink href={primaryCta.href}>{primaryCta.label}</SiteLink>
    </Button>
    {secondaryCta ? (
      <Button
        variant={secondaryVariant}
        size="lg"
        asChild
        className={cn("w-full min-w-0 sm:w-auto", secondaryClassName)}
      >
        <SiteLink href={secondaryCta.href}>{secondaryCta.label}</SiteLink>
      </Button>
    ) : null}
  </div>
);

export default ActionButtons;
