import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { AnimatedHepaLogo } from "@/components/brand";
import { useAppTheme, useSiteContent } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/scroll";
import { isExternalHref, isHashHref, isInternalPathHref, normalizeAppHref, resolveAppHref } from "@/lib/site-pages";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MOBILE_NAV_PANEL_ID = "mobile-site-navigation";
const HERO_SURFACE_STYLES = {
  navShell: "border border-white/12 bg-white/[0.08] shadow-[0_20px_60px_rgba(8,15,28,0.18),inset_0_1px_0_rgba(255,255,255,0.18)]",
  navGlow:
    "bg-[radial-gradient(circle_at_12%_12%,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(43,138,191,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]",
  mobilePanel:
    "mt-2 overflow-hidden rounded-[1.4rem] border border-white/12 bg-white/[0.08] shadow-[0_18px_50px_rgba(8,15,28,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-3xl",
};
const SCROLLED_SURFACE_STYLES = {
  dark: {
    navShell:
      "border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] shadow-[0_22px_60px_rgba(8,15,28,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]",
    navGlow:
      "bg-[radial-gradient(circle_at_14%_14%,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(43,138,191,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))]",
    mobilePanel:
      "mt-2 overflow-hidden rounded-[1.4rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] shadow-[0_18px_50px_rgba(8,15,28,0.2),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-3xl",
  },
  light: {
    navShell:
      "border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(241,247,252,0.44))] shadow-[0_18px_40px_rgba(148,163,184,0.18),inset_0_1px_0_rgba(255,255,255,0.95)]",
    navGlow:
      "bg-[radial-gradient(circle_at_14%_14%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(43,138,191,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0.05))]",
    mobilePanel:
      "mt-2 overflow-hidden rounded-[1.4rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(241,247,252,0.5))] shadow-[0_16px_38px_rgba(148,163,184,0.16),inset_0_1px_0_rgba(255,255,255,0.96)] backdrop-blur-3xl",
  },
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, preference, toggleTheme } = useAppTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    siteContent: {
      siteShell: { navigation },
    },
  } = useSiteContent();
  const onHero = !scrolled;
  const heroTextTone = isDark
    ? {
        desktopLink:
          "relative text-sm font-medium text-white/78 transition-colors duration-300 hover:text-white after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-[#79D3FF] after:transition-transform after:duration-300 after:content-[''] hover:after:origin-left hover:after:scale-x-100",
        mobileLink: "block text-sm font-medium text-white/80 transition-colors hover:text-white",
        mobileToggle: "text-white",
      }
    : {
        desktopLink:
          "relative text-sm font-medium text-slate-700/90 transition-colors duration-300 hover:text-slate-950 after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-[#2B8ABF] after:transition-transform after:duration-300 after:content-[''] hover:after:origin-left hover:after:scale-x-100",
        mobileLink: "block text-sm font-medium text-slate-700/90 transition-colors hover:text-slate-950",
        mobileToggle: "text-slate-900",
      };
  const scrolledSurfaceTone = isDark ? SCROLLED_SURFACE_STYLES.dark : SCROLLED_SURFACE_STYLES.light;
  const textTone = onHero
    ? heroTextTone
    : {
        desktopLink:
          "relative text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-accent-blue after:transition-transform after:duration-300 after:content-[''] hover:after:origin-left hover:after:scale-x-100",
        mobileLink: "block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        mobileToggle: "text-foreground",
      };
  const surfaceTone = onHero ? HERO_SURFACE_STYLES : scrolledSurfaceTone;
  const iconButtonClass = onHero
    ? "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/15"
    : "flex h-9 w-9 items-center justify-center rounded-full bg-accent-blue/10 transition-all duration-300 hover:scale-110 hover:bg-accent-blue/20";
  const themeButtonLabel = preference === "system" ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Use system theme";
  const navCtaClassName = onHero
    ? "rounded-full px-5 shadow-[0_18px_40px_rgba(126,217,87,0.22)] hover:shadow-[0_22px_50px_rgba(43,138,191,0.28)]"
    : "rounded-full px-5 shadow-[0_14px_34px_rgba(43,138,191,0.18)]";
  const ThemeIcon = isDark ? Sun : Moon;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigation = (href: string, closeMobileMenu = false) => {
    const trimmedHref = href.trim();

    const navigateToHref = () => {
      if (isHashHref(trimmedHref)) {
        if (location.pathname === "/") {
          scrollToSection(trimmedHref);
          return;
        }

        navigate(`/${trimmedHref}`);
        return;
      }

      if (isInternalPathHref(trimmedHref)) {
        navigate(normalizeAppHref(trimmedHref));
      }
    };

    if (closeMobileMenu) {
      setOpen(false);
      window.setTimeout(navigateToHref, 250);
      return;
    }

    navigateToHref();
  };

  const isLinkHandledInApp = (href: string) => isHashHref(href) || isInternalPathHref(href);
  const getInAppNavigationHref = (href: string) =>
    isHashHref(href) && location.pathname !== "/" ? resolveAppHref(`/${href}`) : resolveAppHref(href) || href;

  const renderNavigationLink = (href: string, label: string, className: string, closeMobileMenu = false) => {
    if (!isLinkHandledInApp(href) || isExternalHref(href)) {
      return (
        <a href={href} className={className}>
          {label}
        </a>
      );
    }

    return (
      <a
        href={getInAppNavigationHref(href)}
        onClick={(event) => {
          event.preventDefault();
          handleNavigation(href, closeMobileMenu);
        }}
        className={className}
      >
        {label}
      </a>
    );
  };

  const renderThemeButton = () => (
    <button onClick={toggleTheme} className={iconButtonClass} aria-label={themeButtonLabel} title={themeButtonLabel}>
      <ThemeIcon size={16} className={onHero ? "text-[#79D3FF]" : "text-accent-blue"} />
    </button>
  );

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 pt-3 transition-all duration-500 sm:pt-4">
      <div className="section-container">
        <div className={cn("relative overflow-hidden rounded-[1.75rem] backdrop-blur-3xl", surfaceTone.navShell)}>
          <div className={cn("pointer-events-none absolute inset-0", surfaceTone.navGlow)} />
          <div className="relative flex h-16 items-center justify-between px-4 sm:px-5">
            <Link to="/" className="group flex items-center">
              <AnimatedHepaLogo
                dark={!scrolled || isDark}
                className="h-8"
                imageClassName="h-8 w-auto transition-transform duration-400 group-hover:scale-105"
              />
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-8">
                {navigation.links.map((link) => (
                  <div key={link.href}>{renderNavigationLink(link.href, link.label, textTone.desktopLink)}</div>
                ))}
              </div>
              <Button variant="hero" size="sm" asChild className={navCtaClassName}>
                {isLinkHandledInApp(navigation.primaryCta.href) ? (
                  <a
                    href={getInAppNavigationHref(navigation.primaryCta.href)}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigation(navigation.primaryCta.href);
                    }}
                  >
                    {navigation.primaryCta.label}
                  </a>
                ) : (
                  <a href={navigation.primaryCta.href}>{navigation.primaryCta.label}</a>
                )}
              </Button>
              {renderThemeButton()}
            </div>

            <div className="flex items-center gap-3 md:hidden">
              {renderThemeButton()}
              <button
                className={textTone.mobileToggle}
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-controls={MOBILE_NAV_PANEL_ID}
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <div
          id={MOBILE_NAV_PANEL_ID}
          className={cn("md:hidden transition-all duration-300 ease-out", open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0")}
        >
          <div className={surfaceTone.mobilePanel}>
            <div className="space-y-3 px-4 pb-4 pt-3">
              {navigation.links.map((link) => (
                <div key={link.href}>{renderNavigationLink(link.href, link.label, textTone.mobileLink, true)}</div>
              ))}
              <div className="grid gap-3 border-t border-white/10 pt-4">
                <Button variant="hero" asChild className="w-full">
                  {isLinkHandledInApp(navigation.primaryCta.href) ? (
                    <a
                      href={getInAppNavigationHref(navigation.primaryCta.href)}
                      onClick={(event) => {
                        event.preventDefault();
                        handleNavigation(navigation.primaryCta.href, true);
                      }}
                    >
                      {navigation.primaryCta.label}
                    </a>
                  ) : (
                    <a href={navigation.primaryCta.href}>{navigation.primaryCta.label}</a>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
