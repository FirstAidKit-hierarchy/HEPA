import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Chrome,
  Clock3,
  Eye,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  Save,
  ShieldCheck,
  Sun,
  UserPlus,
  X,
} from "lucide-react";
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";
import { AnimatedHepaLogo } from "@/components/brand";
import { useAppTheme } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  adminRequestOwnerEmail,
  isOwnerEmail,
  isOwnerUser,
  approveAdminAccessRequest,
  declineAdminAccessRequest,
  isAdminRequestConfigured,
  loadAdminAccessRequest,
  revokeAdminAccess,
  submitAdminAccessRequest,
  subscribeToAdminAccessRequest,
  subscribeToAdminAccessRequests,
  subscribeToAdminUsers,
  type AdminAccessRequest,
  type AdminUserRecord,
} from "@/lib/firebase/adminRequests";
import { firebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase/client";
import { isAdminUser, loadSiteContent, saveSiteContent } from "@/lib/firebase/siteContent";
import { cn } from "@/lib/utils";
import { createSiteContentDraft, defaultSiteContent, type SiteContent } from "@/content/site/defaults";
import { PRIVATE_PAGE_PATH } from "@/pages/private/config";
import { ADMIN_PAGE_ROBOTS, ADMIN_PAGE_TITLE } from "./config";
import SiteContentEditor from "./SiteContentEditor";

function upsertMeta(name: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
}

const sectionConfig = [
  {
    key: "siteShell",
    label: "Site shell",
    description: "Navigation, CTA, and footer content shared across the public site.",
    previewHref: "/",
  },
  {
    key: "home",
    label: "Home page",
    description: "Hero, service tiles, proof cards, insights, and contact sections.",
    previewHref: "/",
  },
  {
    key: "privatePage",
    label: "Private page",
    description: "Workshop attendee page content, agenda links, and payment actions.",
    previewHref: PRIVATE_PAGE_PATH,
  },
  {
    key: "notFoundPage",
    label: "404 page",
    description: "Fallback page copy and return action.",
    previewHref: "/__preview-404",
  },
] as const;

type SectionKey = (typeof sectionConfig)[number]["key"];

const Panel = ({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={cn(
      "relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(8,15,28,0.52),rgba(8,15,28,0.26))] p-5 shadow-[0_28px_70px_rgba(8,15,28,0.22)] backdrop-blur-2xl sm:p-8",
      className,
    )}
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(43,138,191,0.22),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(126,217,87,0.14),_transparent_30%)]" />
    <div className="relative">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#79D3FF]">{eyebrow}</p>
      <h2 className="mt-4 text-xl font-bold leading-tight text-white sm:text-[1.85rem]">{title}</h2>
      {description ? <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-100/78">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </div>
  </section>
);

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof FirebaseError) {
    return `${fallback} (${error.code})`;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return `${fallback} (${error.message})`;
  }

  return fallback;
};

const maskEmailAddress = (email: string) => {
  const trimmed = email.trim();
  const [localPart, domainPart] = trimmed.split("@");

  if (!localPart || !domainPart) {
    return trimmed;
  }

  const maskedLocal =
    localPart.length <= 2 ? `${localPart.slice(0, 1)}***` : `${localPart.slice(0, 2)}***${localPart.slice(-1)}`;
  const domainSegments = domainPart.split(".");
  const domainName = domainSegments[0] ?? "";
  const domainSuffix = domainSegments.slice(1).join(".");
  const maskedDomain = domainName.length <= 2 ? `${domainName.slice(0, 1)}***` : `${domainName.slice(0, 2)}***`;

  return `${maskedLocal}@${maskedDomain}${domainSuffix ? `.${domainSuffix}` : ""}`;
};

const AdminPage = () => {
  const { isDark, preference, toggleTheme } = useAppTheme();
  const ThemeIcon = isDark ? Sun : Moon;
  const themeButtonLabel =
    preference === "system" ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Use system theme";
  const [activeSection, setActiveSection] = useState<SectionKey>("home");
  const [user, setUser] = useState<User | null>(firebaseAuth?.currentUser ?? null);
  const [isCheckingSession, setIsCheckingSession] = useState(isFirebaseConfigured);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [activeRequestActionUid, setActiveRequestActionUid] = useState<string | null>(null);
  const [activeAdminUid, setActiveAdminUid] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState<SiteContent>(() => createSiteContentDraft(defaultSiteContent));
  const [publishedContent, setPublishedContent] = useState<SiteContent>(() => createSiteContentDraft(defaultSiteContent));
  const [ownAccessRequest, setOwnAccessRequest] = useState<AdminAccessRequest | null>(null);
  const [accessRequests, setAccessRequests] = useState<AdminAccessRequest[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);

  useEffect(() => {
    const previousTitle = document.title;
    const robotsMeta = upsertMeta("robots");
    const previousRobots = robotsMeta.getAttribute("content");

    document.title = ADMIN_PAGE_TITLE;
    robotsMeta.setAttribute("content", ADMIN_PAGE_ROBOTS);

    return () => {
      document.title = previousTitle;

      if (previousRobots) {
        robotsMeta.setAttribute("content", previousRobots);
        return;
      }

      robotsMeta.remove();
    };
  }, []);

  useEffect(() => {
    if (!firebaseAuth) {
      setIsCheckingSession(false);
      return;
    }

    let active = true;

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      if (!active) {
        return;
      }

      setUser(nextUser);
      setHasAdminAccess(false);

      if (!nextUser) {
        setDraft(createSiteContentDraft(defaultSiteContent));
        setPublishedContent(createSiteContentDraft(defaultSiteContent));
        setOwnAccessRequest(null);
        setAccessRequests([]);
        setAdminUsers([]);
        setIsCheckingSession(false);
        return;
      }

      setIsCheckingSession(true);

      try {
        const allowed = await isAdminUser(nextUser.uid);

        if (!active) {
          return;
        }

        setHasAdminAccess(allowed);

        if (!allowed) {
          setIsCheckingSession(false);
          return;
        }

        setIsLoadingContent(true);
        const remoteContent = await loadSiteContent();

        if (!active) {
          return;
        }

        setDraft(createSiteContentDraft(remoteContent));
        setPublishedContent(createSiteContentDraft(remoteContent));
      } catch (error) {
        console.error("Unable to load the site administration workspace.", error);
        if (active) {
          toast.error(getErrorMessage(error, "Unable to load the site administration workspace."));
        }
      } finally {
        if (active) {
          setIsLoadingContent(false);
          setIsCheckingSession(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user || hasAdminAccess) {
      setOwnAccessRequest(null);
      return;
    }

    let active = true;

    const hydrateRequest = async () => {
      try {
        const request = await loadAdminAccessRequest(user.uid);

        if (active) {
          setOwnAccessRequest(request);
        }
      } catch (error) {
        if (active) {
          console.error("Unable to load the access request status.", error);
          toast.error(getErrorMessage(error, "Unable to load the access request status."));
        }
      }
    };

    void hydrateRequest();

    return subscribeToAdminAccessRequest(
      user.uid,
      (request) => {
        if (active) {
          setOwnAccessRequest(request);
        }
      },
      (error) => {
        if (active) {
          console.error("Unable to subscribe to the access request status.", error);
          toast.error(getErrorMessage(error, "Unable to load the access request status."));
        }
      },
    );
  }, [hasAdminAccess, user]);

  useEffect(() => {
    if (!user || !hasAdminAccess || !isOwnerUser(user)) {
      setAccessRequests([]);
      return;
    }

    return subscribeToAdminAccessRequests(
      (requests) => setAccessRequests(requests),
      (error) => {
        console.error("Unable to load admin access requests.", error);
        toast.error(getErrorMessage(error, "Unable to load admin access requests."));
      },
    );
  }, [hasAdminAccess, user]);

  useEffect(() => {
    if (!user || !hasAdminAccess || !isOwnerUser(user)) {
      setAdminUsers([]);
      return;
    }

    return subscribeToAdminUsers(
      (admins) => setAdminUsers(admins),
      (error) => {
        console.error("Unable to load current admins.", error);
        toast.error(getErrorMessage(error, "Unable to load current admins."));
      },
    );
  }, [hasAdminAccess, user]);

  useEffect(() => {
    if (!user || hasAdminAccess || ownAccessRequest?.status !== "approved") {
      return;
    }

    let active = true;

    void isAdminUser(user.uid)
      .then((allowed) => {
        if (active && allowed) {
          setHasAdminAccess(true);
          toast.success("Admin access approved. The editor is now unlocked.");
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [hasAdminAccess, ownAccessRequest?.status, user]);

  const handleGoogleLogin = async () => {
    if (!firebaseAuth || !googleProvider) {
      toast.error("Firebase is not configured yet.");
      return;
    }

    try {
      setIsCheckingSession(true);
      await signInWithPopup(firebaseAuth, googleProvider);
    } catch (error) {
      console.error("Google sign-in failed.", error);
      toast.error(getErrorMessage(error, "Google sign-in failed. Check Firebase Authentication."));
      setIsCheckingSession(false);
    }
  };

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firebaseAuth) {
      toast.error("Firebase is not configured yet.");
      return;
    }

    try {
      setIsCheckingSession(true);
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      setPassword("");
    } catch (error) {
      console.error("Email sign-in failed.", error);
      toast.error(getErrorMessage(error, "Email sign-in failed. Use an existing Firebase Auth account."));
      setIsCheckingSession(false);
    }
  };

  const handleSignOut = async () => {
    if (!firebaseAuth) {
      return;
    }

    await signOut(firebaseAuth);
    toast.success("Signed out.");
  };

  const handleSave = async () => {
    if (!hasAdminAccess) {
      toast.error("This account is not on the admin allowlist.");
      return;
    }

    try {
      setIsSaving(true);
      const saved = await saveSiteContent(draft);
      setDraft(createSiteContentDraft(saved));
      setPublishedContent(createSiteContentDraft(saved));
      toast.success("Site content updated.");
    } catch (error) {
      console.error("Unable to save the site content.", error);
      toast.error(getErrorMessage(error, "Unable to save the site content."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setDraft(createSiteContentDraft(publishedContent));
  };

  const handleRequestAccess = async () => {
    if (!user) {
      return;
    }

    try {
      setIsSubmittingRequest(true);
      const request = await submitAdminAccessRequest(user);
      setOwnAccessRequest(request);

      if (request?.status === "pending") {
        toast.success("Request sent. Owner can review it in the admin panel.");
        return;
      }

      toast.success(`Your access request is currently marked as ${request?.status ?? "pending"}.`);
    } catch (error) {
      console.error("Unable to submit the access request.", error);
      toast.error(getErrorMessage(error, "Unable to submit the access request."));
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleApproveRequest = async (request: AdminAccessRequest) => {
    if (!user) {
      return;
    }

    try {
      if (!isOwnerUser(user)) {
        toast.error("Only the owner can approve access.");
        return;
      }

      setActiveRequestActionUid(request.uid);
      await approveAdminAccessRequest(request, user);
      toast.success(`Approved admin access for ${maskEmailAddress(request.email)}.`);
    } catch (error) {
      console.error("Unable to approve the admin request.", error);
      toast.error(getErrorMessage(error, "Unable to approve the admin request."));
    } finally {
      setActiveRequestActionUid(null);
    }
  };

  const handleDeclineRequest = async (request: AdminAccessRequest) => {
    if (!user) {
      return;
    }

    try {
      if (!isOwnerUser(user)) {
        toast.error("Only the owner can decline access.");
        return;
      }

      setActiveRequestActionUid(request.uid);
      await declineAdminAccessRequest(request, user);
      toast.success(`Declined admin access for ${maskEmailAddress(request.email)}.`);
    } catch (error) {
      console.error("Unable to decline the admin request.", error);
      toast.error(getErrorMessage(error, "Unable to decline the admin request."));
    } finally {
      setActiveRequestActionUid(null);
    }
  };

  const handleRevokeAccess = async (admin: AdminUserRecord) => {
    if (!user) {
      return;
    }

    try {
      if (!isOwnerUser(user)) {
        toast.error("Only the owner can remove access.");
        return;
      }

      setActiveAdminUid(admin.uid);
      await revokeAdminAccess(admin, user);
      toast.success(`Removed admin access for ${maskEmailAddress(admin.email)}.`);
    } catch (error) {
      console.error("Unable to remove admin access.", error);
      toast.error(getErrorMessage(error, "Unable to remove admin access."));
    } finally {
      setActiveAdminUid(null);
    }
  };

  const activeSectionConfig = sectionConfig.find((section) => section.key === activeSection) ?? sectionConfig[0];
  const activeValue = draft[activeSection];
  const activeTemplate = defaultSiteContent[activeSection];
  const isOwner = isOwnerUser(user);
  const pendingAccessRequests = accessRequests.filter((request) => request.status === "pending");
  const reviewedAccessRequests = accessRequests.filter((request) => request.status !== "pending").slice(0, 4);
  const manageableAdmins = adminUsers.filter((admin) => admin.role === "admin");
  const requestStatusCopy =
    ownAccessRequest?.status === "pending"
      ? "Request sent. The owner can review it in the admin panel and approve or decline it there."
      : ownAccessRequest?.status === "approved"
        ? "This request has been approved. If the editor does not unlock immediately, refresh this page."
        : ownAccessRequest?.status === "declined"
          ? "This request was declined. Ask the owner directly if you need another review."
          : "Send a request for admin approval. The owner can review it in the admin panel.";
  const requestStatusLabel =
    ownAccessRequest?.status === "pending"
      ? "Pending owner review"
      : ownAccessRequest?.status === "approved"
        ? "Approved"
        : ownAccessRequest?.status === "declined"
          ? "Declined"
          : "No request sent";
  const requestStatusClassName =
    ownAccessRequest?.status === "approved"
      ? "border-emerald-300/18 bg-emerald-200/10 text-emerald-100"
      : ownAccessRequest?.status === "declined"
        ? "border-rose-300/16 bg-rose-200/10 text-rose-100"
        : "border-white/10 bg-white/[0.06] text-slate-100";

  return (
    <div className="min-h-screen bg-background">
      <main className="relative overflow-hidden">
        <div
          className={cn(
            "absolute inset-0",
            "bg-[linear-gradient(180deg,rgba(36,48,66,0.34)_0%,rgba(24,36,52,0.5)_100%),radial-gradient(circle_at_78%_18%,rgba(43,138,191,0.2)_0%,transparent_40%)]",
            "dark:bg-[linear-gradient(180deg,rgba(8,15,28,0.7)_0%,rgba(8,15,28,0.88)_100%),radial-gradient(circle_at_78%_18%,rgba(43,138,191,0.18)_0%,transparent_40%)]",
          )}
        />
        <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-[#2B8ABF]/16 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute bottom-10 left-0 h-40 w-40 rounded-full bg-[#7ED957]/10 blur-3xl sm:h-[18rem] sm:w-[18rem]" />
        <div className="section-container relative z-10 py-5 sm:py-6">
          <header className="rounded-[1.75rem] border border-white/12 bg-white/[0.08] shadow-[0_20px_60px_rgba(8,15,28,0.18),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:h-16 sm:flex-nowrap sm:px-5 sm:py-0">
              <Link to="/" className="group inline-flex items-center">
                <AnimatedHepaLogo
                  dark={isDark}
                  className="h-7 sm:h-8"
                  imageClassName="h-7 w-auto transition-transform duration-400 group-hover:scale-105 sm:h-8"
                  autoPlay
                />
              </Link>

              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full border-white/12 bg-white/10 px-3 text-white hover:bg-white/14 hover:text-white"
                >
                  <a href={activeSectionConfig.previewHref} target="_blank" rel="noreferrer">
                    <Eye size={15} />
                    Preview page
                  </a>
                </Button>
                <button
                  onClick={toggleTheme}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/15"
                  aria-label={themeButtonLabel}
                  title={themeButtonLabel}
                >
                  <ThemeIcon size={16} className="text-[#79D3FF]" />
                </button>
              </div>
            </div>
          </header>

          <div className="py-8 sm:py-12 lg:py-16">
            <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
              <div className="space-y-6">
                <Panel
                  eyebrow="Administration"
                  title="Edit every page from one workspace"
                  description="This admin panel controls the site shell, homepage sections, the private attendee page, and the 404 page. Array sections act as tile builders, so you can add and remove cards without touching code."
                >
                  {!isFirebaseConfigured ? (
                    <div className="space-y-4 rounded-[1.5rem] border border-amber-300/18 bg-amber-100/10 p-5 text-sm leading-7 text-slate-100">
                      <div className="flex items-center gap-3">
                        <LockKeyhole className="text-amber-200" size={18} />
                        <p className="font-medium text-white">Firebase is not configured yet.</p>
                      </div>
                      <p>Add the Firebase values to `.env.local`, enable Google and Email/Password sign-in, then create an <code>adminUsers/{'{uid}'}</code> Firestore document for each admin.</p>
                      <p className="text-slate-300/76">Setup steps and security rules are documented in `docs/firebase-admin-setup.md`.</p>
                    </div>
                  ) : !user ? (
                    <div className="space-y-4">
                      <button
                        onClick={handleGoogleLogin}
                        disabled={isCheckingSession}
                        className="flex w-full items-center justify-center gap-3 rounded-[1.4rem] border border-white/12 bg-white/[0.06] px-5 py-4 text-left text-white transition-colors hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isCheckingSession ? <Loader2 className="animate-spin" size={18} /> : <Chrome size={18} className="text-[#79D3FF]" />}
                        <span>
                          <span className="block text-sm font-semibold">Continue with Google</span>
                          <span className="mt-1 block text-xs text-slate-300/70">Secure Firebase sign-in</span>
                        </span>
                      </button>

                      <form onSubmit={handleEmailLogin} className="space-y-3 rounded-[1.4rem] border border-white/12 bg-white/[0.06] p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          <Mail size={16} className="text-[#79D3FF]" />
                          Sign in with email
                        </div>
                        <Input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="admin@yourdomain.com"
                          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
                        />
                        <Input
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="Password"
                          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
                        />
                        <Button type="submit" variant="hero" className="w-full rounded-full" disabled={isCheckingSession}>
                          {isCheckingSession ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                          Sign in securely
                        </Button>
                      </form>
                    </div>
                  ) : !hasAdminAccess ? (
                    <div className="space-y-4 rounded-[1.5rem] border border-rose-300/16 bg-rose-100/10 p-5 text-sm leading-7 text-slate-100">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="text-rose-200" size={18} />
                        <p className="font-medium text-white">Signed in, but this account is not allowed to edit.</p>
                      </div>
                      <p>
                        {user.email ?? "This account"} is authenticated, but it does not have a matching <code>adminUsers/{'{uid}'}</code> document in Firestore.
                      </p>
                      <div className={cn("rounded-[1.35rem] border p-4", requestStatusClassName)}>
                        <div className="flex items-start gap-3">
                          <Clock3 size={18} className="mt-0.5 shrink-0 text-[#79D3FF]" />
                          <div>
                            <p className="text-sm font-semibold text-white">{requestStatusLabel}</p>
                            <p className="mt-2 text-xs leading-6 text-slate-200/80">{requestStatusCopy}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={handleRequestAccess}
                          disabled={isSubmittingRequest || !isAdminRequestConfigured || Boolean(ownAccessRequest)}
                          className="rounded-full"
                        >
                          {isSubmittingRequest ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
                          {ownAccessRequest ? "Request submitted" : "Request owner approval"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSignOut}
                          className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
                        >
                          <LogOut size={16} />
                          Sign out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
                        <p className="text-sm font-semibold text-white">{user.email ?? "Signed-in admin"}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-300/66">Admin access verified</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="hero"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="rounded-full px-6 shadow-[0_18px_40px_rgba(126,217,87,0.22)]"
                        >
                          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                          Save changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleReset}
                          className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
                        >
                          Reset draft
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSignOut}
                          className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
                        >
                          <LogOut size={16} />
                          Sign out
                        </Button>
                      </div>
                    </div>
                  )}
                </Panel>

                <Panel
                  eyebrow="Pages"
                  title="Page views"
                  description="Open the live page you are editing in a new tab to verify spacing, tile flow, and device behavior."
                >
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {sectionConfig.map((section) => (
                      <button
                        key={section.key}
                        type="button"
                        onClick={() => setActiveSection(section.key)}
                        className={cn(
                          "rounded-[1.35rem] border p-4 text-left transition-all duration-300",
                          activeSection === section.key
                            ? "border-[#79D3FF]/35 bg-white/[0.1] shadow-[0_16px_38px_rgba(8,15,28,0.18)]"
                            : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{section.label}</p>
                            <p className="mt-2 text-xs leading-6 text-slate-300/72">{section.description}</p>
                          </div>
                          <a
                            href={section.previewHref}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[#79D3FF] transition-transform hover:scale-105"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        </div>
                      </button>
                    ))}
                  </div>
                </Panel>

                {hasAdminAccess && isOwner ? (
                  <Panel
                    eyebrow="Access Requests"
                    title="Approve or decline editor access"
                    description="Signed-in users can request approval. Only the owner can approve, decline, or revoke editor access."
                  >
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Pending</p>
                          <p className="mt-3 text-2xl font-bold text-white">{pendingAccessRequests.length}</p>
                        </div>
                        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Notifications</p>
                          <p className="mt-3 text-sm font-medium text-white">
                            {adminRequestOwnerEmail ? `Optional email: ${maskEmailAddress(adminRequestOwnerEmail)}` : "Manual review in admin panel"}
                          </p>
                        </div>
                      </div>

                      {pendingAccessRequests.length ? (
                        <div className="space-y-3">
                          {pendingAccessRequests.map((request) => (
                            <div key={request.uid} className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-white">{maskEmailAddress(request.email)}</p>
                                  <p className="mt-1 text-xs leading-6 text-slate-300/70">
                                    {request.displayName || "No display name"} | Requested {request.requestedAt || "recently"}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    type="button"
                                    variant="hero"
                                    size="sm"
                                    onClick={() => handleApproveRequest(request)}
                                    disabled={activeRequestActionUid === request.uid}
                                    className="rounded-full px-4"
                                  >
                                    {activeRequestActionUid === request.uid ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                    Approve
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeclineRequest(request)}
                                    disabled={activeRequestActionUid === request.uid}
                                    className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
                                  >
                                    <X size={16} />
                                    Decline
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-[1.35rem] border border-dashed border-white/12 bg-white/[0.03] p-4 text-sm leading-7 text-slate-100/72">
                          No pending access requests right now.
                        </div>
                      )}

                      {reviewedAccessRequests.length ? (
                        <div className="space-y-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Recently reviewed</p>
                          {reviewedAccessRequests.map((request) => (
                            <div key={request.uid} className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3">
                              <p className="text-sm font-medium text-white">{maskEmailAddress(request.email)}</p>
                              <p className="mt-1 text-xs leading-6 text-slate-300/70">
                                {request.status === "approved" ? "Approved" : "Declined"} by{" "}
                                {request.reviewedByEmail ? maskEmailAddress(request.reviewedByEmail) : "an admin"}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Current admins</p>
                        {manageableAdmins.length ? (
                          manageableAdmins.map((admin) => {
                            const isOwnerAdmin = isOwnerEmail(admin.email);

                            return (
                              <div key={admin.uid} className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-white">{maskEmailAddress(admin.email)}</p>
                                    <p className="mt-1 text-xs leading-6 text-slate-300/70">
                                      {isOwnerAdmin ? "Owner account" : "Admin account"}
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRevokeAccess(admin)}
                                    disabled={isOwnerAdmin || activeAdminUid === admin.uid}
                                    className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white disabled:opacity-50"
                                  >
                                    {activeAdminUid === admin.uid ? <Loader2 className="animate-spin" size={16} /> : <X size={16} />}
                                    Remove access
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="rounded-[1.35rem] border border-dashed border-white/12 bg-white/[0.03] p-4 text-sm leading-7 text-slate-100/72">
                            No admin accounts found.
                          </div>
                        )}
                      </div>
                    </div>
                  </Panel>
                ) : hasAdminAccess ? (
                  <Panel
                    eyebrow="Access Requests"
                    title="Owner-only access management"
                    description="Only the owner account can approve, decline, or remove admin access."
                  >
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4 text-sm leading-7 text-slate-100/78">
                      Access requests and admin removal are restricted to {adminRequestOwnerEmail || "the configured owner"}.
                    </div>
                  </Panel>
                ) : null}
              </div>

              <Panel
                eyebrow="Content editor"
                title={activeSectionConfig.label}
                description={activeSectionConfig.description}
                className="min-h-[32rem]"
              >
                {!hasAdminAccess ? (
                  <div className="rounded-[1.5rem] border border-dashed border-white/12 bg-white/[0.03] p-6 text-sm leading-7 text-slate-100/72">
                    Sign in with an approved administrator account to unlock the editor.
                  </div>
                ) : isLoadingContent || isCheckingSession ? (
                  <div className="flex min-h-[18rem] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.04] text-white">
                    <Loader2 className="animate-spin" size={22} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-100/78">
                      <LayoutDashboard size={16} className="text-[#79D3FF]" />
                      Use the add and remove controls inside list sections to build new tiles, cards, references, prompts, or links.
                    </div>

                    <SiteContentEditor
                      label={activeSectionConfig.label}
                      value={activeValue}
                      template={activeTemplate}
                      path={[activeSection]}
                      onChange={(nextValue) =>
                        setDraft((current) => ({
                          ...current,
                          [activeSection]: nextValue,
                        }))
                      }
                    />
                  </div>
                )}
              </Panel>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
