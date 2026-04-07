import { Linkedin, Mail, MapPin } from "lucide-react";
import { navigationLinks } from "@/content/navigation";

const Footer = () => (
  <footer className="border-t border-border/60 bg-section-gradient py-12">
    <div className="section-container">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_220px_260px]">
        <div>
          <img
            src="/icons/hepa-logo.svg"
            alt="HEPA"
            className="h-8 transition-transform duration-300 hover:scale-105 dark:brightness-0 dark:invert"
          />
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            Decision-ready evidence, pricing research, and market access support for healthcare teams across the GCC.
          </p>
          <div className="mt-5 space-y-3 text-sm text-muted-foreground">
            <a href="mailto:info@digitalhepa.com" className="flex items-center gap-3 transition-colors hover:text-foreground">
              <Mail size={16} className="text-accent-blue" />
              <span>info@digitalhepa.com</span>
            </a>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent-blue" />
              <span>Riyadh and Jeddah, Saudi Arabia; Dubai, United Arab Emirates</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground/75">Quick links</p>
          <div className="mt-5 space-y-3">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground/75">Connect</p>
          <div className="mt-5 space-y-3">
            <a href="#" className="block text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
              Terms & Conditions
            </a>
            <a href="#" className="block text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
              Privacy Policy
            </a>
            <a
              href="https://www.linkedin.com/company/digitalhepa/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-accent-blue"
            >
              <Linkedin size={18} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HEPA. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
