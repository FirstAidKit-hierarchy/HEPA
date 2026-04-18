import { useEffect, useMemo } from "react";
import { ArrowLeft, Link2, ShieldCheck } from "lucide-react";
import { SiteLink } from "@/components/common";
import { Footer, Navbar } from "@/components/layout";
import { useSiteContent } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { getEmailTemplatePreviewHtml } from "@/lib/emailTemplates";
import { PASSWORD_RESET_EMAIL_PREVIEW_TITLE } from "./config";

function upsertMeta(name: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
}

const previewDescription =
  "Preview the HEPA Firebase password reset email inside the site shell, using the same minimal header and footer treatment as the live outbound emails.";

const PasswordResetEmailPreviewPage = () => {
  const {
    siteContent: { emailTemplates },
  } = useSiteContent();
  const previewHtml = useMemo(
    () => getEmailTemplatePreviewHtml("passwordReset", emailTemplates.passwordReset),
    [emailTemplates.passwordReset],
  );

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = upsertMeta("description");
    const previousDescription = descriptionMeta.getAttribute("content");

    document.title = PASSWORD_RESET_EMAIL_PREVIEW_TITLE;
    descriptionMeta.setAttribute("content", previewDescription);

    return () => {
      document.title = previousTitle;

      if (previousDescription) {
        descriptionMeta.setAttribute("content", previousDescription);
        return;
      }

      descriptionMeta.remove();
    };
  }, []);

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
                <ShieldCheck size={16} className="mr-2 text-[#79D3FF]" />
                System Email Preview
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_10px_35px_rgba(8,15,28,0.24)] sm:text-5xl lg:text-6xl">
                Password reset email
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-100/82 sm:text-lg">{previewDescription}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild className="rounded-full px-6">
                  <SiteLink href="/admin">Open admin</SiteLink>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="rounded-full border-white/15 bg-white/10 px-6 text-white hover:bg-white/14 hover:text-white"
                >
                  <SiteLink href="/">
                    <ArrowLeft size={16} />
                    Back to home
                  </SiteLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="section-container">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]">
              <div className="rounded-[1.8rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-blue">Preview data</p>
                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Application</p>
                    <p className="mt-2 text-sm leading-7 text-foreground">HEPA</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Recipient</p>
                    <p className="mt-2 text-sm leading-7 text-foreground">admin@hepa.sa</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Reset link</p>
                    <p className="mt-2 break-all text-sm leading-7 text-foreground">
                      https://hepa.sa/admin?action=reset-password-preview
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.4rem] border border-border/70 bg-background/80 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Link2 size={16} className="text-accent-blue" />
                    Source file
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    This page renders the password reset HTML currently stored in the admin-controlled site content document,
                    with sample values injected into the live placeholders.
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border/70 bg-card/95 p-3 shadow-[0_20px_48px_rgba(15,23,42,0.08)] sm:p-5">
                <iframe
                  title="HEPA password reset email preview"
                  srcDoc={previewHtml}
                  className="h-[1080px] w-full rounded-[1.35rem] border border-border/60 bg-background"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PasswordResetEmailPreviewPage;
