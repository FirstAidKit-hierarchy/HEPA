import { type CSSProperties, useEffect, useState } from "react";

interface AnimatedHepaLogoProps {
  dark?: boolean;
  className?: string;
  imageClassName?: string;
  autoPlay?: boolean;
  alt?: string;
}

const AnimatedHepaLogo = ({
  dark = false,
  className = "",
  imageClassName = "",
  autoPlay = false,
  alt = "HEPA Solutions",
}: AnimatedHepaLogoProps) => {
  const [isAnimating, setIsAnimating] = useState(autoPlay);
  const logoSrc = dark ? "/icons/hepa-logo-dark.svg" : "/icons/hepa-logo.svg";
  const style = {
    "--hepa-logo-accent": "#7ed957",
    "--hepa-logo-sweep-light": "#ffffff",
    "--hepa-logo-sweep-dark": "#1d1d1b",
  } as CSSProperties;

  useEffect(() => {
    if (!autoPlay) return;

    setIsAnimating(true);
    const timer = window.setTimeout(() => setIsAnimating(false), 1450);

    return () => {
      window.clearTimeout(timer);
    };
  }, [autoPlay, dark]);

  return (
    <span
      className={`hepa-logo-sweep ${autoPlay ? "hepa-logo-sweep-autoplay" : "hepa-logo-sweep-interactive"} ${
        isAnimating ? "hepa-logo-sweep-active" : ""
      } ${className}`.trim()}
      style={style}
    >
      <span className="hepa-logo-sweep-stage">
        <img src={logoSrc} alt={alt} className={imageClassName} />
        <span aria-hidden="true" className="hepa-logo-sweep-reveal">
          <img src={logoSrc} alt="" className={imageClassName} />
        </span>
        <span aria-hidden="true" className="hepa-logo-sweep-panel" />
      </span>
    </span>
  );
};

export default AnimatedHepaLogo;
