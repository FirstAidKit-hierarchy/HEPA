import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { AnimatedHepaLogo } from "@/components/brand";
import { useAppTheme } from "@/components/providers";
import { sharedCtas } from "@/content/home";
import { navigationLinks } from "@/content/navigation";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/scroll";

const MOBILE_NAV_PANEL_ID = "mobile-site-navigation";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useAppTheme();
  const onHero = !scrolled;
  const desktopLinkClass = onHero
    ? isDark
      ? "relative text-sm font-medium text-white/78 transition-colors duration-300 hover:text-white after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-[#79D3FF] after:transition-transform after:duration-300 after:content-[''] hover:after:origin-left hover:after:scale-x-100"
      : "relative text-sm font-medium text-slate-700/90 transition-colors duration-300 hover:text-slate-950 after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-[#2B8ABF] after:transition-transform after:duration-300 after:content-[''] hover:after:origin-left hover:after:scale-x-100"
    : "relative text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-accent-blue after:transition-transform after:duration-300 after:content-[''] hover:after:origin-left hover:after:scale-x-100";
  const iconButtonClass = onHero
    ? "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/15"
    : "flex h-9 w-9 items-center justify-center rounded-full bg-accent-blue/10 transition-all duration-300 hover:scale-110 hover:bg-accent-blue/20";
  const mobileToggleClass = onHero ? (isDark ? "text-white" : "text-slate-900") : "text-foreground";
  const mobileLinkClass = onHero
    ? isDark
      ? "block text-sm font-medium text-white/80 transition-colors hover:text-white"
      : "block text-sm font-medium text-slate-700/90 transition-colors hover:text-slate-950"
    : "block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  const navShellClass = onHero
    ? "border border-white/12 bg-white/[0.08] shadow-[0_20px_60px_rgba(8,15,28,0.18),inset_0_1px_0_rgba(255,255,255,0.18)]"
    : isDark
      ? "border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] shadow-[0_22px_60px_rgba(8,15,28,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]"
      : "border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(241,247,252,0.44))] shadow-[0_18px_40px_rgba(148,163,184,0.18),inset_0_1px_0_rgba(255,255,255,0.95)]";
  const navGlowClass = onHero
    ? "bg-[radial-gradient(circle_at_12%_12%,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(43,138,191,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]"
    : isDark
      ? "bg-[radial-gradient(circle_at_14%_14%,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(43,138,191,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))]"
      : "bg-[radial-gradient(circle_at_14%_14%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(43,138,191,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0.05))]";
  const mobilePanelClass = onHero
    ? "mt-2 overflow-hidden rounded-[1.4rem] border border-white/12 bg-white/[0.08] shadow-[0_18px_50px_rgba(8,15,28,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-3xl"
    : isDark
      ? "mt-2 overflow-hidden rounded-[1.4rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] shadow-[0_18px_50px_rgba(8,15,28,0.2),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-3xl"
      : "mt-2 overflow-hidden rounded-[1.4rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(241,247,252,0.5))] shadow-[0_16px_38px_rgba(148,163,184,0.16),inset_0_1px_0_rgba(255,255,255,0.96)] backdrop-blur-3xl";
  const themeButtonLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
  const themeIconClass = onHero ? "text-[#79D3FF]" : "text-accent-blue";
  const navCtaClassName = onHero
    ? "rounded-full px-5 shadow-[0_18px_40px_rgba(126,217,87,0.22)] hover:shadow-[0_22px_50px_rgba(43,138,191,0.28)]"
    : "rounded-full px-5 shadow-[0_14px_34px_rgba(43,138,191,0.18)]";
  const themeIcon = isDark ? (
    <Sun size={16} className={themeIconClass} />
  ) : (
    <Moon size={16} className={themeIconClass} />
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigation = (href: string, closeMobileMenu = false) => {
    if (closeMobileMenu) {
      setOpen(false);
      window.setTimeout(() => scrollToSection(href), 250);
      return;
    }

    scrollToSection(href);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 pt-3 transition-all duration-500 sm:pt-4">
      <div className="section-container">
        <div className={`relative overflow-hidden rounded-[1.75rem] backdrop-blur-3xl ${navShellClass}`}>
          <div className={`pointer-events-none absolute inset-0 ${navGlowClass}`} />
          <div className="relative flex h-16 items-center justify-between px-4 sm:px-5">
            <a href="#home" className="group flex items-center">
              <AnimatedHepaLogo
                dark={!scrolled || isDark}
                className="h-8"
                imageClassName="h-8 w-auto transition-transform duration-400 group-hover:scale-105"
              />
            </a>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-8">
                {navigationLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigation(link.href);
                    }}
                    className={desktopLinkClass}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <Button variant="hero" size="sm" asChild className={navCtaClassName}>
                <a
                  href={sharedCtas.primary.href}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavigation(sharedCtas.primary.href);
                  }}
                >
                  {sharedCtas.primary.label}
                </a>
              </Button>
              <button
                onClick={toggleTheme}
                className={iconButtonClass}
                aria-label={themeButtonLabel}
                title={themeButtonLabel}
              >
                {themeIcon}
              </button>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={toggleTheme}
                className={iconButtonClass}
                aria-label={themeButtonLabel}
                title={themeButtonLabel}
              >
                {themeIcon}
              </button>
              <button
                className={mobileToggleClass}
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
          className={`md:hidden transition-all duration-300 ease-out ${open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className={mobilePanelClass}>
            <div className="space-y-3 px-4 pb-4 pt-3">
              {navigationLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavigation(link.href, true);
                  }}
                  className={mobileLinkClass}
                >
                  {link.label}
                </a>
              ))}
              <div className="grid gap-3 border-t border-white/10 pt-4">
                <Button variant="hero" asChild className="w-full">
                  <a
                    href={sharedCtas.primary.href}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigation(sharedCtas.primary.href, true);
                    }}
                  >
                    {sharedCtas.primary.label}
                  </a>
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
