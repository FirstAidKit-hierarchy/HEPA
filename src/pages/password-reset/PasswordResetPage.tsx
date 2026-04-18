import { type FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { SiteLink } from "@/components/common";
import { Footer, Navbar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { isInternalPathHref, normalizeAppHref } from "@/lib/site-pages";
import { ADMIN_PAGE_PATH } from "@/pages/admin/config";
import { PASSWORD_RESET_TITLE } from "./config";

function upsertMeta(name: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
}

const pageDescription = "Reset your HEPA admin password securely and return to the administration workspace.";

const resolveContinueHref = (value: string | null) => {
  const normalizedValue = value?.trim() ?? "";

  if (!normalizedValue) {
    return ADMIN_PAGE_PATH;
  }

  if (isInternalPathHref(normalizedValue)) {
    return normalizeAppHref(normalizedValue);
  }

  if (typeof window === "undefined") {
    return ADMIN_PAGE_PATH;
  }

  try {
    const parsedUrl = new URL(normalizedValue, window.location.origin);

    if (parsedUrl.origin !== window.location.origin) {
      return ADMIN_PAGE_PATH;
    }

    return normalizeAppHref(`${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`);
  } catch {
    return ADMIN_PAGE_PATH;
  }
};

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resolvedEmail, setResolvedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifyingCode, setIsVerifyingCode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const searchParams = useMemo(
    () => (typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search)),
    [],
  );
  const oobCode = searchParams.get("oobCode")?.trim() ?? "";
  const continueHref = useMemo(() => resolveContinueHref(searchParams.get("continueUrl")), [searchParams]);

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = upsertMeta("description");
    const previousDescription = descriptionMeta.getAttribute("content");

    document.title = PASSWORD_RESET_TITLE;
    descriptionMeta.setAttribute("content", pageDescription);

    return () => {
      document.title = previousTitle;

      if (previousDescription) {
        descriptionMeta.setAttribute("content", previousDescription);
        return;
      }

      descriptionMeta.remove();
    };
  }, []);

  useEffect(() => {
    if (!firebaseAuth || !isFirebaseConfigured) {
      setErrorMessage("Firebase authentication is not configured.");
      setIsVerifyingCode(false);
      return;
    }

    if (!oobCode) {
      setErrorMessage("This reset link is incomplete or invalid.");
      setIsVerifyingCode(false);
      return;
    }

    let active = true;

    void verifyPasswordResetCode(firebaseAuth, oobCode)
      .then((email) => {
        if (!active) {
          return;
        }

        setResolvedEmail(email.trim().toLowerCase());
        setErrorMessage("");
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setErrorMessage("This reset link is invalid or has expired. Request a new password reset email.");
      })
      .finally(() => {
        if (active) {
          setIsVerifyingCode(false);
        }
      });

    return () => {
      active = false;
    };
  }, [oobCode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firebaseAuth || !oobCode) {
      setErrorMessage("This reset link is invalid or has expired.");
      return;
    }

    if (!newPassword) {
      setErrorMessage("Enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Use at least 8 characters for the new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("The password confirmation does not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await confirmPasswordReset(firebaseAuth, oobCode, newPassword);
      setIsComplete(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setErrorMessage("This reset link is invalid or has expired. Request a new password reset email.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <LockKeyhole size={16} className="mr-2 text-[#79D3FF]" />
                Account security
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_10px_35px_rgba(8,15,28,0.24)] sm:text-5xl lg:text-6xl">
                Reset your password
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-100/82 sm:text-lg">
                Set a new password for your HEPA admin account and continue to the secure workspace.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="section-container">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-border/70 bg-card/95 p-6 shadow-[0_22px_54px_rgba(15,23,42,0.08)] sm:p-8">
              {isVerifyingCode ? (
                <div className="flex min-h-[16rem] items-center justify-center rounded-[1.5rem] border border-border/70 bg-background/70 text-foreground">
                  <Loader2 className="animate-spin" size={22} />
                </div>
              ) : isComplete ? (
                <div className="space-y-6 rounded-[1.5rem] border border-emerald-200/60 bg-emerald-50/80 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck size={20} />
                    <p className="text-base font-semibold">Password updated.</p>
                  </div>
                  <p className="text-sm leading-7 text-foreground/80">
                    Your HEPA admin password has been changed successfully. Use the updated password the next time you sign in.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="hero" asChild className="rounded-full">
                      <SiteLink href={continueHref}>
                        Continue to admin
                        <ArrowRight size={16} />
                      </SiteLink>
                    </Button>
                    <Button variant="outline" asChild className="rounded-full">
                      <SiteLink href="/">Return home</SiteLink>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-blue">Account</p>
                    <p className="mt-3 text-sm leading-7 text-foreground">{resolvedEmail || "Reset link verification required."}</p>
                  </div>

                  {errorMessage ? (
                    <div className="rounded-[1.4rem] border border-rose-300/60 bg-rose-50/80 p-4 text-sm leading-7 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="mt-1 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    </div>
                  ) : null}

                  <div className="grid gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="new-password">
                        New password
                      </label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="Use at least 8 characters"
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="confirm-password">
                        Confirm new password
                      </label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Repeat the new password"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" variant="hero" disabled={isSubmitting || !resolvedEmail} className="rounded-full">
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                      Save new password
                    </Button>
                    <Button type="button" variant="outline" asChild className="rounded-full">
                      <SiteLink href={continueHref}>Back to sign-in</SiteLink>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PasswordResetPage;
