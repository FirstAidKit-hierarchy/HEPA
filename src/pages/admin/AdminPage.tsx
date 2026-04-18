import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Chrome,
  Eye,
  EyeOff,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  Plus,
  Save,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
  updatePassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";
import { AnimatedHepaLogo } from "@/components/brand";
import { useAppTheme } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import {
  adminRequestOwnerEmail,
  adminRequestOwnerNotificationTransport,
  approveAdminAccessRequest,
  declineAdminAccessRequest,
  revokeAdminAccess,
  isOwnerEmail,
  isOwnerUser,
  submitAdminAccessRequest,
  subscribeToAdminAccessRequest,
  subscribeToAdminAccessRequests,
  subscribeToAdminUserRecord,
  subscribeToAdminUsers,
  updateAdminRole,
  type AdminAccessRequest,
  type AdminUserRecord,
} from "@/lib/firebase/adminRequests";
import { setManagedAdminPassword } from "@/lib/firebase/adminPasswords";
import { sendAdminManualEmail } from "@/lib/firebase/adminManualEmail";
import { firebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase/client";
import { sendCustomPasswordResetEmail } from "@/lib/firebase/passwordResetEmail";
import { isAdminUser, loadSiteContent, saveSiteContent } from "@/lib/firebase/siteContent";
import { normalizePagePath } from "@/lib/site-pages";
import { cn } from "@/lib/utils";
import { createCustomPageDraft, createSiteContentDraft, defaultSiteContent, type SiteContent } from "@/content/site/defaults";
import { NOT_FOUND_PREVIEW_PATH } from "@/pages/not-found/config";
import { PASSWORD_RESET_EMAIL_PREVIEW_PATH } from "@/pages/password-reset-email-preview/config";
import { ADMIN_PAGE_PATH, ADMIN_PAGE_ROBOTS, ADMIN_PAGE_TITLE } from "./config";
import AdminRouteEditor from "./AdminRouteEditor";
import CustomPagesEditor from "./CustomPagesEditor";
import EmailTemplatesEditor from "./EmailTemplatesEditor";
import SiteContentEditor from "./SiteContentEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function upsertMeta(name: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  return element;
}

const usesDirectOwnerRequestNotifications = adminRequestOwnerNotificationTransport === "api";
const usesFirestoreOwnerRequestNotifications = adminRequestOwnerNotificationTransport === "firestore";

const sectionConfig = [
  {
    key: "home",
    label: "Home page",
    description: "Shared site shell plus hero, service tiles, proof cards, insights, and contact sections.",
    previewHref: "/",
  },
  {
    key: "customPages",
    label: "Custom pages",
    description: "Build extra landing pages with editable URLs and drag-and-drop content blocks.",
    previewHref: "/",
  },
  {
    key: "notFoundPage",
    label: "404 page",
    description: "Fallback page copy and return action.",
    previewHref: NOT_FOUND_PREVIEW_PATH,
  },
  {
    key: "emailTemplates",
    label: "Email templates",
    description: "Edit the HTML templates used for password reset, admin request, contact, and manual outbound emails.",
    previewHref: PASSWORD_RESET_EMAIL_PREVIEW_PATH,
  },
] as const;

type SectionKey = (typeof sectionConfig)[number]["key"];
const pageViewSections = sectionConfig.filter((section) => section.key !== "customPages");

const homeEditorSectionConfig = [
  {
    key: "siteShell",
    label: "Site shell",
    description: "Navigation, primary CTA, footer, and shared shell content used across the public site.",
  },
  {
    key: "hero",
    label: "Hero",
    description: "Top-of-page message, visual framing, and first call to action.",
  },
  {
    key: "audiences",
    label: "Who we help",
    description: "Audience cards that explain who HEPA supports and the outcome for each group.",
  },
  {
    key: "solutions",
    label: "Capabilities",
    description: "Service cards, side panel copy, and proof points for what HEPA delivers.",
  },
  {
    key: "ctaPanels",
    label: "CTA panels",
    description: "Mid-page action panels that push visitors toward a next step.",
  },
  {
    key: "productProof",
    label: "Proof",
    description: "Preview cards, supporting text, and product proof messaging.",
  },
  {
    key: "caseStudies",
    label: "Case studies",
    description: "Project snapshots, labels, and case study highlights.",
  },
  {
    key: "workflow",
    label: "Workflow",
    description: "How-it-works steps and the delivery process explanation.",
  },
  {
    key: "trust",
    label: "Trust",
    description: "Trust signals, stats, testimonial, and launch checklist.",
  },
  {
    key: "insights",
    label: "Insights",
    description: "Insight cards, article previews, and editorial section copy.",
  },
  {
    key: "contact",
    label: "Contact",
    description: "Form copy, visible contact info, recipient email, CC emails, and action links.",
  },
  {
    key: "partnersSection",
    label: "Partners",
    description: "Partner logos, supporting copy, and section presentation.",
  },
] as const;

type HomeEditorSectionKey = (typeof homeEditorSectionConfig)[number]["key"];
const HOME_EDITOR_SECTION_STORAGE_KEY = "hepa.admin.homeEditorSection";
const defaultHomeEditorSection: HomeEditorSectionKey = "contact";
const defaultManualEmailDomainSuffix = "@hepa.sa";

const normalizeManualEmailLocalPart = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();

  if (!normalizedValue) {
    return "";
  }

  if (normalizedValue.endsWith(defaultManualEmailDomainSuffix)) {
    return normalizedValue.slice(0, -defaultManualEmailDomainSuffix.length);
  }

  if (normalizedValue.includes("@")) {
    return normalizedValue.split("@")[0] ?? "";
  }

  return normalizedValue;
};

const isHomeEditorSectionKey = (value: unknown): value is HomeEditorSectionKey =>
  homeEditorSectionConfig.some((section) => section.key === value);

const getInitialHomeEditorSection = (): HomeEditorSectionKey => {
  if (typeof window === "undefined") {
    return defaultHomeEditorSection;
  }

  const storedValue = window.localStorage.getItem(HOME_EDITOR_SECTION_STORAGE_KEY);
  return isHomeEditorSectionKey(storedValue) ? storedValue : defaultHomeEditorSection;
};

const emptyManualEmailDraft = {
  fromName: "",
  fromEmail: "",
  to: "",
  cc: "",
  bcc: "",
  subject: "",
  message: "",
};

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

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(className, "pr-12")}
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-300/70 transition-colors hover:text-white"
        aria-label={isVisible ? "Hide password" : "Show password"}
        title={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof FirebaseError) {
    return `${fallback} (${error.code})`;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return `${fallback} (${error.message})`;
  }

  return fallback;
};

const getGoogleSignInErrorMessage = (error: unknown) => {
  if (error instanceof FirebaseError && error.code === "auth/unauthorized-domain") {
    const hostname = typeof window !== "undefined" ? window.location.hostname : "this domain";
    return `Google sign-in is blocked for ${hostname}. Add this domain in Firebase Authentication > Settings > Authorized domains.`;
  }

  return getErrorMessage(error, "Google sign-in failed. Check Firebase Authentication.");
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

const formatDateTime = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value || "Just now";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
};

const AdminPage = () => {
  const { isDark, preference, toggleTheme } = useAppTheme();
  const ThemeIcon = isDark ? Sun : Moon;
  const themeButtonLabel =
    preference === "system" ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Use system theme";
  const [activeSection, setActiveSection] = useState<SectionKey>("home");
  const [activeHomeEditorSection, setActiveHomeEditorSection] = useState<HomeEditorSectionKey>(() => getInitialHomeEditorSection());
  const [user, setUser] = useState<User | null>(firebaseAuth?.currentUser ?? null);
  const [isCheckingSession, setIsCheckingSession] = useState(isFirebaseConfigured);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeAdminUid, setActiveAdminUid] = useState<string | null>(null);
  const [activeRoleUid, setActiveRoleUid] = useState<string | null>(null);
  const [activeManagedPasswordUid, setActiveManagedPasswordUid] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [selectedManagedPasswordUid, setSelectedManagedPasswordUid] = useState("");
  const [managedPassword, setManagedPassword] = useState("");
  const [confirmManagedPassword, setConfirmManagedPassword] = useState("");
  const [manualEmailDraft, setManualEmailDraft] = useState(() => ({ ...emptyManualEmailDraft }));
  const [isSendingManualEmail, setIsSendingManualEmail] = useState(false);
  const [draft, setDraft] = useState<SiteContent>(() => createSiteContentDraft(defaultSiteContent));
  const [publishedContent, setPublishedContent] = useState<SiteContent>(() => createSiteContentDraft(defaultSiteContent));
  const [activeCustomPageId, setActiveCustomPageId] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [currentAccessRequest, setCurrentAccessRequest] = useState<AdminAccessRequest | null>(null);
  const [pendingAccessRequests, setPendingAccessRequests] = useState<AdminAccessRequest[]>([]);
  const [isSubmittingAccessRequest, setIsSubmittingAccessRequest] = useState(false);
  const [activeRequestUid, setActiveRequestUid] = useState<string | null>(null);

  const currentAdminRecord = user ? adminUsers.find((admin) => admin.uid === user.uid) ?? null : null;
  const isOwner = isOwnerUser(user) || currentAdminRecord?.role === "owner";
  const canManageAccess = isOwner;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(HOME_EDITOR_SECTION_STORAGE_KEY, activeHomeEditorSection);
  }, [activeHomeEditorSection]);

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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      if (!nextUser) {
        setDraft(createSiteContentDraft(defaultSiteContent));
        setPublishedContent(createSiteContentDraft(defaultSiteContent));
        setAdminUsers([]);
        setCurrentAccessRequest(null);
        setPendingAccessRequests([]);
        setPassword("");
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
    if (!user || !hasAdminAccess) {
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
    if (!user || hasAdminAccess) {
      setCurrentAccessRequest(null);
      return;
    }

    return subscribeToAdminAccessRequest(
      user.uid,
      (request) => setCurrentAccessRequest(request),
      (error) => {
        console.error("Unable to load the current access request.", error);
        toast.error(getErrorMessage(error, "Unable to load the current access request."));
      },
    );
  }, [hasAdminAccess, user]);

  useEffect(() => {
    if (!user || !hasAdminAccess || !canManageAccess) {
      setPendingAccessRequests([]);
      return;
    }

    return subscribeToAdminAccessRequests(
      (requests) => setPendingAccessRequests(requests.filter((request) => request.status === "pending")),
      (error) => {
        console.error("Unable to load pending access requests.", error);
        toast.error(getErrorMessage(error, "Unable to load pending access requests."));
      },
    );
  }, [canManageAccess, hasAdminAccess, user]);

  useEffect(() => {
    if (!user || hasAdminAccess) {
      return;
    }

    return subscribeToAdminUserRecord(
      user.uid,
      (adminRecord) => {
        if (!adminRecord) {
          return;
        }

        setHasAdminAccess(true);
        setIsLoadingContent(true);
        void loadSiteContent()
          .then((remoteContent) => {
            setDraft(createSiteContentDraft(remoteContent));
            setPublishedContent(createSiteContentDraft(remoteContent));
            toast.success("Admin access approved. The editor is now unlocked.");
          })
          .catch((error) => {
            console.error("Unable to load the site administration workspace.", error);
            toast.error(getErrorMessage(error, "Unable to load the site administration workspace."));
          })
          .finally(() => {
            setIsLoadingContent(false);
            setIsCheckingSession(false);
          });
      },
      (error) => {
        console.error("Unable to watch admin access changes.", error);
      },
    );
  }, [hasAdminAccess, user]);

  useEffect(() => {
    if (!adminUsers.length) {
      setSelectedManagedPasswordUid("");
      return;
    }

    if (!selectedManagedPasswordUid || !adminUsers.some((admin) => admin.uid === selectedManagedPasswordUid)) {
      setSelectedManagedPasswordUid(adminUsers[0].uid);
    }
  }, [adminUsers, selectedManagedPasswordUid]);

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
      toast.error(getGoogleSignInErrorMessage(error));
      setIsCheckingSession(false);
    }
  };

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firebaseAuth) {
      toast.error("Firebase is not configured yet.");
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      toast.error("Enter an email address.");
      return;
    }

    if (!password) {
      toast.error("Enter your password.");
      return;
    }

    try {
      setIsCheckingSession(true);
      await signInWithEmailAndPassword(firebaseAuth, trimmedEmail, password);

      setPassword("");
    } catch (error) {
      console.error("Email authentication failed.", error);
      toast.error(getErrorMessage(error, "Email sign-in failed. Check your password or send a reset link."));
      setIsCheckingSession(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!firebaseAuth) {
      toast.error("Firebase is not configured yet.");
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      toast.error("Enter your email address first.");
      return;
    }

    try {
      setIsSendingResetEmail(true);
      await sendCustomPasswordResetEmail(trimmedEmail);
      toast.success("If that email belongs to an approved admin account, a reset link has been sent.");
    } catch (error) {
      console.error("Unable to send the password reset email.", error);
      toast.error(getErrorMessage(error, "Unable to send the password reset email."));
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!user) {
      toast.error("Sign in first.");
      return;
    }

    try {
      setIsSubmittingAccessRequest(true);
      const result = await submitAdminAccessRequest(user);
      setCurrentAccessRequest(result.request);
      toast.success(
        result.reusedPendingRequest
          ? result.emailQueued
            ? usesDirectOwnerRequestNotifications
              ? "Pending access request kept in the review queue and the owner notification was sent again."
              : "Pending access request kept in the review queue and the owner email was queued again."
            : adminRequestOwnerEmail
              ? usesDirectOwnerRequestNotifications
                ? "Pending access request is still in the review queue. Check the request email service if no email arrives."
                : "Pending access request is still in the review queue. Check the Trigger Email setup if no email arrives."
              : "Pending access request is still in the review queue."
          : result.resubmittedReviewedRequest
            ? result.emailQueued
              ? usesDirectOwnerRequestNotifications
                ? "Access request submitted again and the owner notification was sent."
                : "Access request submitted again and the owner email was queued."
              : adminRequestOwnerEmail
                ? usesDirectOwnerRequestNotifications
                  ? "Access request submitted again. Check the request email service if no email arrives."
                  : "Access request submitted again. Check the Trigger Email setup if no email arrives."
                : "Access request submitted again and returned to the review queue."
          : result.emailQueued
            ? usesDirectOwnerRequestNotifications
              ? "Access request saved and the owner notification was sent."
              : "Access request saved and the owner email was queued."
            : adminRequestOwnerEmail
              ? usesDirectOwnerRequestNotifications
                ? "Access request saved to the review queue. Check the request email service if no email arrives."
                : "Access request saved to the review queue. Check the Trigger Email setup if no email arrives."
              : "Access request saved to the review queue.",
      );
    } catch (error) {
      console.error("Unable to submit the access request.", error);
      toast.error(getErrorMessage(error, "Unable to submit the access request."));
    } finally {
      setIsSubmittingAccessRequest(false);
    }
  };

  const handleApproveAccessRequest = async (request: AdminAccessRequest) => {
    if (!user) {
      return;
    }

    try {
      if (!canManageAccess) {
        toast.error("Only the owner can approve requests.");
        return;
      }

      setActiveRequestUid(request.uid);
      const result = await approveAdminAccessRequest(request, user);
      toast.success(
        result.emailQueued
          ? `Approved ${request.email} and queued the approval email.`
          : `Approved ${request.email}.`,
      );
    } catch (error) {
      console.error("Unable to approve the access request.", error);
      toast.error(getErrorMessage(error, "Unable to approve the access request."));
    } finally {
      setActiveRequestUid(null);
    }
  };

  const handleDeclineAccessRequest = async (request: AdminAccessRequest) => {
    if (!user) {
      return;
    }

    try {
      if (!canManageAccess) {
        toast.error("Only the owner can decline requests.");
        return;
      }

      setActiveRequestUid(request.uid);
      const result = await declineAdminAccessRequest(request, user);
      toast.success(
        result.emailQueued
          ? `Declined ${request.email} and queued the decline email.`
          : `Declined ${request.email}.`,
      );
    } catch (error) {
      console.error("Unable to decline the access request.", error);
      toast.error(getErrorMessage(error, "Unable to decline the access request."));
    } finally {
      setActiveRequestUid(null);
    }
  };

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firebaseAuth?.currentUser || !firebaseAuth.currentUser.email) {
      toast.error("Sign in again before changing the password.");
      return;
    }

    if (!currentPassword) {
      toast.error("Enter your current password.");
      return;
    }

    if (!newPassword) {
      toast.error("Enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Use at least 8 characters for the new password.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("The new password confirmation does not match.");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const credential = EmailAuthProvider.credential(firebaseAuth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseAuth.currentUser, credential);
      await updatePassword(firebaseAuth.currentUser, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      toast.success("Password updated.");
    } catch (error) {
      console.error("Unable to update the password.", error);
      toast.error(getErrorMessage(error, "Unable to update the password."));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    if (!firebaseAuth) {
      return;
    }

    await signOut(firebaseAuth);
    setPassword("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
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

  const handleCreateCustomPage = () => {
    if (!hasAdminAccess) {
      toast.error("Sign in with an approved administrator account to add a page.");
      return;
    }

    const nextPage = createCustomPageDraft();

    setActiveSection("customPages");
    setActiveCustomPageId(nextPage.id);
    setDraft((current) => ({
      ...current,
      customPages: [...current.customPages, nextPage],
    }));
  };

  const handleRevokeAccess = async (admin: AdminUserRecord) => {
    if (!user) {
      return;
    }

    try {
      if (!canManageAccess) {
        toast.error("Only the owner can remove access.");
        return;
      }

      setActiveAdminUid(admin.uid);
      await revokeAdminAccess(admin, user);
      toast.success(`Removed admin access for ${formatVisibleEmail(admin.email)}.`);
    } catch (error) {
      console.error("Unable to remove admin access.", error);
      toast.error(getErrorMessage(error, "Unable to remove admin access."));
    } finally {
      setActiveAdminUid(null);
    }
  };

  const handleToggleAdminRole = async (admin: AdminUserRecord) => {
    if (!user) {
      return;
    }

    try {
      if (!canManageAccess) {
        toast.error("Only the owner can change roles.");
        return;
      }

      const nextRole = admin.role === "owner" ? "admin" : "owner";
      setActiveRoleUid(admin.uid);
      await updateAdminRole(admin, nextRole, user);
      toast.success(`${formatVisibleEmail(admin.email)} is now ${nextRole}.`);
    } catch (error) {
      console.error("Unable to update the admin role.", error);
      toast.error(getErrorMessage(error, "Unable to update the admin role."));
    } finally {
      setActiveRoleUid(null);
    }
  };

  const handleManagedPasswordOverride = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      if (!canManageAccess) {
        toast.error("Only the owner can change another user's password.");
        return;
      }

      if (!selectedManagedPasswordUser) {
        toast.error("Select an account first.");
        return;
      }

      if (!managedPassword) {
        toast.error("Enter a new password.");
        return;
      }

      if (managedPassword.length < 8) {
        toast.error("Use at least 8 characters for the new password.");
        return;
      }

      if (managedPassword !== confirmManagedPassword) {
        toast.error("The password confirmation does not match.");
        return;
      }

      setActiveManagedPasswordUid(selectedManagedPasswordUser.uid);
      const result = await setManagedAdminPassword(selectedManagedPasswordUser.uid, managedPassword);
      setManagedPassword("");
      setConfirmManagedPassword("");
      toast.success(`Password updated for ${formatVisibleEmail(result.email || selectedManagedPasswordUser.email)}.`);
    } catch (error) {
      console.error("Unable to override the password.", error);
      toast.error(getErrorMessage(error, "Unable to override the password."));
    } finally {
      setActiveManagedPasswordUid(null);
    }
  };

  const handleSendManualEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      if (!canManageAccess) {
        toast.error("Only the owner can send manual emails.");
        return;
      }

      if (!manualEmailDraft.to.trim()) {
        toast.error("Enter at least one recipient.");
        return;
      }

      if (!manualEmailDraft.subject.trim()) {
        toast.error("Enter a subject.");
        return;
      }

      if (!manualEmailDraft.message.trim()) {
        toast.error("Enter a message.");
        return;
      }

      setIsSendingManualEmail(true);
      await sendAdminManualEmail(manualEmailDraft);
      setManualEmailDraft((current) => ({
        ...current,
        fromEmail: "",
        to: "",
        cc: "",
        bcc: "",
        subject: "",
        message: "",
      }));
      toast.success("Email sent.");
    } catch (error) {
      console.error("Unable to send the manual email.", error);
      toast.error(getErrorMessage(error, "Unable to send the manual email."));
    } finally {
      setIsSendingManualEmail(false);
    }
  };

  const activeSectionConfig = sectionConfig.find((section) => section.key === activeSection) ?? sectionConfig[0];
  const activeHomeEditorSectionConfig =
    homeEditorSectionConfig.find((section) => section.key === activeHomeEditorSection) ?? homeEditorSectionConfig[0];
  const activeValue = draft[activeSection];
  const activeTemplate = defaultSiteContent[activeSection];
  const activeNotFoundPreviewHref = draft.notFoundPageRoute.aliasPath || NOT_FOUND_PREVIEW_PATH;
  const formatVisibleEmail = (email: string) => (isOwner ? email.trim() : maskEmailAddress(email));
  const visibleAdmins = adminUsers;
  const accessRequestStatus = currentAccessRequest?.status ?? "";
  const accessRequestStatusLabel =
    accessRequestStatus === "pending"
      ? "Access request pending"
      : accessRequestStatus === "approved"
        ? "Access request approved"
        : accessRequestStatus === "declined"
          ? "Access request declined"
          : "";
  const selectedManagedPasswordUser = visibleAdmins.find((admin) => admin.uid === selectedManagedPasswordUid) ?? visibleAdmins[0] ?? null;
  const showEditorWorkspace = hasAdminAccess;
  const showAccessScreen = !showEditorWorkspace;
  const administrationTitle = showEditorWorkspace ? "Edit every page from one workspace" : "Secure admin access";
  const administrationDescription = showEditorWorkspace
    ? "This admin panel controls the homepage and shared site shell, custom landing pages, the 404 page, and the outbound email templates."
    : "Only approved administrator accounts can unlock this workspace. Sign in with an allowlisted account or send a request for review.";
  const administrationPanelContent = !isFirebaseConfigured ? (
    <div className="space-y-4 rounded-[1.5rem] border border-amber-300/18 bg-amber-100/10 p-5 text-sm leading-7 text-slate-100">
      <div className="flex items-center gap-3">
        <LockKeyhole className="text-amber-200" size={18} />
        <p className="font-medium text-white">Firebase is not configured yet.</p>
      </div>
      <p>
        Add the Firebase values to <code>.env.local</code> for local development and to your hosting provider
        environment settings for production, then enable Email/Password sign-in and create an{" "}
        <code>adminUsers/{'{uid}'}</code> Firestore document for each admin.
      </p>
      <p className="text-slate-300/76">Setup steps and security rules are documented in `docs/firebase-admin-setup.md`.</p>
    </div>
  ) : isCheckingSession ? (
    <div className="flex min-h-[14rem] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.04] text-white">
      <Loader2 className="animate-spin" size={22} />
    </div>
  ) : !user ? (
    <div className="space-y-5">
      <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-6 text-slate-300/78">
        Access is limited to approved admins.
      </div>
      <button
        onClick={handleGoogleLogin}
        disabled={isCheckingSession}
        className="flex min-h-[5rem] w-full items-center justify-center gap-3 rounded-[1.4rem] border border-white/12 bg-white/[0.06] px-5 py-4 text-left text-white transition-colors hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCheckingSession ? <Loader2 className="animate-spin" size={18} /> : <Chrome size={18} className="text-[#79D3FF]" />}
        <span>
          <span className="block text-sm font-semibold">Continue with Google</span>
          <span className="mt-1 block text-xs text-slate-300/70">Alternative secure sign-in</span>
        </span>
      </button>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-300/55">or use email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-3 rounded-[1.4rem] border border-white/12 bg-white/[0.06] p-4 sm:p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Mail size={16} className="text-[#79D3FF]" />
          Email access
        </div>
        <p className="text-xs leading-6 text-slate-300/72">
          Use the password already assigned to this admin email. If you forgot it, send a reset link below.
        </p>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@yourdomain.com"
          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
        />
        <PasswordInput
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
        />
        <Button type="submit" variant="hero" className="w-full rounded-full" disabled={isCheckingSession}>
          {isCheckingSession ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
          Sign in
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSendPasswordReset}
          disabled={isSendingResetEmail}
          className="w-full rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
        >
          {isSendingResetEmail ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
          Send password reset email
        </Button>
        <Button
          type="button"
          variant="outline"
          asChild
          className="w-full rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
        >
          <Link to={PASSWORD_RESET_EMAIL_PREVIEW_PATH}>
            <Eye size={16} />
            Preview reset email
          </Link>
        </Button>
      </form>
    </div>
  ) : !hasAdminAccess ? (
    <div className="space-y-4 rounded-[1.5rem] border border-rose-300/16 bg-rose-100/10 p-5 text-sm leading-7 text-slate-100">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-rose-200" size={18} />
        <p className="font-medium text-white">Signed in, but this account is not allowed to edit.</p>
      </div>
      <p>{user.email ?? "This account"} is signed in, but it does not have an allowlisted admin record yet.</p>
      {currentAccessRequest ? (
        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-4 text-xs leading-6 text-slate-200/80">
          <p className="font-semibold uppercase tracking-[0.18em] text-[#79D3FF]">{accessRequestStatusLabel}</p>
          <p className="mt-3">
            Submitted: <span className="text-white">{formatDateTime(currentAccessRequest.requestedAt)}</span>
          </p>
          {currentAccessRequest.reviewedAt ? (
            <p className="mt-1">
              Reviewed: <span className="text-white">{formatDateTime(currentAccessRequest.reviewedAt)}</span>
            </p>
          ) : null}
          {currentAccessRequest.reviewedByEmail ? (
            <p className="mt-1">
              Reviewed by: <span className="text-white">{maskEmailAddress(currentAccessRequest.reviewedByEmail)}</span>
            </p>
          ) : null}
          <p className="mt-3">
            {currentAccessRequest.status === "pending"
              ? adminRequestOwnerEmail
                ? usesDirectOwnerRequestNotifications
                  ? "The owner review queue has been updated. If the owner did not get the email, use the resend action below to send it again."
                  : usesFirestoreOwnerRequestNotifications
                    ? "The owner review queue has been updated. If the owner did not get an email, use the resend action below to queue it again."
                    : "The owner review queue has been updated."
                : usesDirectOwnerRequestNotifications
                  ? "The owner review queue has been updated. Configure the owner email and request email service to send notifications automatically."
                  : "The owner review queue has been updated. Configure the owner email and Trigger Email extension to send notifications automatically."
              : currentAccessRequest.status === "approved"
                ? "Approval was recorded. If the editor does not unlock within a few seconds, reload this page."
                : "This request was declined. You can send a new request after reviewing the account details below."}
          </p>
        </div>
      ) : (
        <p className="rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-4 text-xs leading-6 text-slate-200/80">
          Send a request to the owner to review this account. Once approved, this user will be added to{" "}
          <code>adminUsers/{'{uid}'}</code> automatically.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="hero"
          size="sm"
          onClick={handleRequestAccess}
          disabled={isSubmittingAccessRequest}
          className="rounded-full"
        >
          {isSubmittingAccessRequest ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
          {currentAccessRequest?.status === "pending"
            ? "Resend request email"
            : currentAccessRequest?.status === "declined"
              ? "Request access again"
              : "Request access"}
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
      <form onSubmit={handleChangePassword} className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Password settings</p>
            <p className="mt-1 text-xs leading-6 text-slate-300/72">
              Change the admin password after sign-in. Use at least 8 characters.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <PasswordInput
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Current password"
            className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
          />
          <PasswordInput
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password"
            className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
          />
          <PasswordInput
            value={confirmNewPassword}
            onChange={(event) => setConfirmNewPassword(event.target.value)}
            placeholder="Confirm new password"
            className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
          />
          <Button type="submit" variant="outline" disabled={isUpdatingPassword} className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white">
            {isUpdatingPassword ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
            Update password
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="relative min-h-screen overflow-hidden">
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
          <header
            className={cn(
              "rounded-[1.75rem] border border-white/12 bg-white/[0.08] shadow-[0_20px_60px_rgba(8,15,28,0.18),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-3xl",
              showAccessScreen ? "mx-auto max-w-5xl" : null,
            )}
          >
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

          <div
            className={cn(
              showAccessScreen
                ? "flex min-h-[calc(100dvh-12rem)] items-center justify-center py-8 sm:min-h-[calc(100dvh-13rem)] sm:py-12"
                : "py-8 sm:py-12 lg:py-16",
            )}
          >
            <div
              className={cn(
                "grid gap-6",
                showEditorWorkspace
                  ? "lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]"
                  : "mx-auto w-full max-w-[44rem]",
              )}
            >
              <div className="space-y-6">
                <Panel
                  eyebrow="Administration"
                  title={administrationTitle}
                  description={administrationDescription}
                  className={showAccessScreen ? "mx-auto w-full max-w-[44rem] sm:p-9" : undefined}
                >
                  {administrationPanelContent}
                </Panel>

                {showEditorWorkspace ? (
                  <Panel
                    eyebrow="Pages"
                    title="Workspace views"
                    description="Open the live page or email preview tied to the section you are editing so you can verify the output in a separate tab."
                  >
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      {pageViewSections.map((section) => (
                        (() => {
                          const previewHref = section.key === "notFoundPage" ? activeNotFoundPreviewHref : section.previewHref;

                          return (
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
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-white">{section.label}</p>
                                  <p className="mt-2 text-xs leading-6 text-slate-300/72">{section.description}</p>
                                </div>
                                <a
                                  href={previewHref}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[#79D3FF] transition-transform hover:scale-105"
                                >
                                  <ArrowUpRight size={16} />
                                </a>
                              </div>
                            </button>
                          );
                        })()
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCreateCustomPage}
                        disabled={!hasAdminAccess || isLoadingContent || isCheckingSession}
                        className="w-full rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white"
                      >
                        <Plus size={16} />
                        Add custom page
                      </Button>
                    </div>
                    <div className="mt-5 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Saved custom pages</p>
                      {draft.customPages.map((page) => (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() => {
                            setActiveSection("customPages");
                            setActiveCustomPageId(page.id);
                          }}
                          className={cn(
                            "w-full rounded-[1.25rem] border p-4 text-left transition-all duration-300",
                            activeSection === "customPages" && activeCustomPageId === page.id
                              ? "border-[#79D3FF]/35 bg-white/[0.1] shadow-[0_16px_38px_rgba(8,15,28,0.18)]"
                              : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white">{page.title || "Untitled page"}</p>
                              <p className="mt-1 break-all text-xs leading-6 text-slate-300/72">{normalizePagePath(page.path)}</p>
                              <p className="mt-1 text-[0.72rem] uppercase tracking-[0.18em] text-slate-400/70">
                                {page.blocks.length} block{page.blocks.length === 1 ? "" : "s"}
                              </p>
                            </div>
                            <a
                              href={normalizePagePath(page.path)}
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
                ) : null}

                {showEditorWorkspace ? (
                  <Panel
                    eyebrow="Admin Accounts"
                    title="Access management"
                    description="Owners can review pending requests, approve or decline them, then manage approved administrator accounts."
                  >
                    <div className="space-y-4">
                      {!canManageAccess ? (
                        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4 text-sm leading-7 text-slate-100/78">
                          Only owner accounts can review requests, change roles, or remove access.
                        </div>
                      ) : null}

                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Pending requests</p>
                        {canManageAccess ? (
                          pendingAccessRequests.length ? (
                            pendingAccessRequests.map((request) => (
                              <div key={request.uid} className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-white">{request.email}</p>
                                    <p className="mt-1 text-xs leading-6 text-slate-300/70">
                                      {request.displayName ? `${request.displayName} · ` : ""}
                                      Requested {formatDateTime(request.requestedAt)}
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApproveAccessRequest(request)}
                                      disabled={activeRequestUid === request.uid}
                                      className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white disabled:opacity-50"
                                    >
                                      {activeRequestUid === request.uid ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                      Approve
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeclineAccessRequest(request)}
                                      disabled={activeRequestUid === request.uid}
                                      className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white disabled:opacity-50"
                                    >
                                      {activeRequestUid === request.uid ? <Loader2 className="animate-spin" size={16} /> : <X size={16} />}
                                      Decline
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-[1.35rem] border border-dashed border-white/12 bg-white/[0.03] p-4 text-sm leading-7 text-slate-100/72">
                              No pending access requests right now.
                            </div>
                          )
                        ) : (
                          <div className="rounded-[1.35rem] border border-dashed border-white/12 bg-white/[0.03] p-4 text-sm leading-7 text-slate-100/72">
                            Sign in as an owner account to review pending requests.
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Current admins</p>
                        {visibleAdmins.length ? (
                          visibleAdmins.map((admin) => {
                            const isConfiguredOwner = isOwnerEmail(admin.email);
                            const isOwnerAdmin = isConfiguredOwner || admin.role === "owner";

                            return (
                              <div key={admin.uid} className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-white">{formatVisibleEmail(admin.email)}</p>
                                    <p className="mt-1 text-xs leading-6 text-slate-300/70">
                                      {isConfiguredOwner ? "Primary owner account" : isOwnerAdmin ? "Owner account" : "Admin account"}
                                    </p>
                                  </div>
                                  {canManageAccess ? (
                                    <div className="flex flex-wrap gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleAdminRole(admin)}
                                        disabled={!canManageAccess || isConfiguredOwner || activeRoleUid === admin.uid}
                                        className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white disabled:opacity-50"
                                      >
                                        {activeRoleUid === admin.uid ? (
                                          <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                          <Check size={16} />
                                        )}
                                        {isConfiguredOwner ? "Primary owner" : isOwnerAdmin ? "Set as admin" : "Set as owner"}
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRevokeAccess(admin)}
                                        disabled={!canManageAccess || isOwnerAdmin || activeAdminUid === admin.uid}
                                        className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white disabled:opacity-50"
                                      >
                                        {activeAdminUid === admin.uid ? <Loader2 className="animate-spin" size={16} /> : <X size={16} />}
                                        Remove access
                                      </Button>
                                    </div>
                                  ) : null}
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
                ) : null}

                {showEditorWorkspace ? (
                  <Panel
                    eyebrow="Passwords"
                    title="Password overrides"
                    description="Owners can set a new password for any approved account without needing that user's current password."
                  >
                    {!visibleAdmins.length ? (
                      <div className="rounded-[1.35rem] border border-dashed border-white/12 bg-white/[0.03] p-4 text-sm leading-7 text-slate-100/72">
                        No approved accounts are available yet.
                      </div>
                    ) : !canManageAccess ? (
                      <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4 text-sm leading-7 text-slate-100/78">
                        This section is visible to all admins, but only an owner can set passwords for other users.
                      </div>
                    ) : (
                      <form onSubmit={handleManagedPasswordOverride} className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-white">Target account</p>
                          <Select value={selectedManagedPasswordUid} onValueChange={setSelectedManagedPasswordUid}>
                            <SelectTrigger className="border-white/12 bg-white/10 text-white">
                              <SelectValue placeholder="Select an account" />
                            </SelectTrigger>
                            <SelectContent>
                              {visibleAdmins.map((admin) => (
                                <SelectItem key={admin.uid} value={admin.uid}>
                                  {admin.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedManagedPasswordUser ? (
                          <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4">
                            <p className="text-sm font-semibold text-white">{formatVisibleEmail(selectedManagedPasswordUser.email)}</p>
                            <p className="mt-1 text-xs leading-6 text-slate-300/72">
                              {(isOwnerEmail(selectedManagedPasswordUser.email) || selectedManagedPasswordUser.role === "owner")
                                ? "Owner account"
                                : "Admin account"}
                            </p>
                          </div>
                        ) : null}

                        <PasswordInput
                          value={managedPassword}
                          onChange={(event) => setManagedPassword(event.target.value)}
                          placeholder="New password"
                          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
                        />
                        <PasswordInput
                          value={confirmManagedPassword}
                          onChange={(event) => setConfirmManagedPassword(event.target.value)}
                          placeholder="Confirm new password"
                          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
                        />

                        <Button
                          type="submit"
                          variant="hero"
                          disabled={!selectedManagedPasswordUser || activeManagedPasswordUid === selectedManagedPasswordUser?.uid}
                          className="w-full rounded-full"
                        >
                          {activeManagedPasswordUid === selectedManagedPasswordUser?.uid ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Check size={16} />
                          )}
                          Set password
                        </Button>
                      </form>
                    )}
                  </Panel>
                ) : null}

                {showEditorWorkspace ? (
                  <Panel
                    eyebrow="Manual email"
                    title="Send a one-off email"
                    description="Owner accounts can send a manual email through the configured Worker and verified Resend domain."
                  >
                    {!canManageAccess ? (
                      <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4 text-sm leading-7 text-slate-100/78">
                        Only the owner account can use the manual email sender.
                      </div>
                    ) : (
                      <form onSubmit={handleSendManualEmail} className="space-y-4">
                        <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4 text-xs leading-6 text-slate-300/76">
                          Use a verified sender address on your domain. Enter only the local part in <span className="text-white">From email</span>;
                          the <span className="text-white">{defaultManualEmailDomainSuffix}</span> suffix is fixed. Leave it empty to use the Worker
                          default sender address, and set any display name you want in <span className="text-white">From name</span>.
                        </div>

                        <Input
                          value={manualEmailDraft.fromName}
                          onChange={(event) => setManualEmailDraft((current) => ({ ...current, fromName: event.target.value }))}
                          placeholder="From name, for example HEPA Team"
                          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
                        />
                        <div className="relative">
                          <Input
                            value={manualEmailDraft.fromEmail}
                            onChange={(event) =>
                              setManualEmailDraft((current) => ({
                                ...current,
                                fromEmail: normalizeManualEmailLocalPart(event.target.value),
                              }))
                            }
                            placeholder="From email name, for example noreply"
                            className="border-white/12 bg-white/10 pr-28 text-white placeholder:text-slate-300/55"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-slate-200/82">
                            {defaultManualEmailDomainSuffix}
                          </div>
                        </div>
                        <Input
                          value={manualEmailDraft.to}
                          onChange={(event) => setManualEmailDraft((current) => ({ ...current, to: event.target.value }))}
                          placeholder="To emails, separated by commas"
                          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
                        />
                        <Input
                          value={manualEmailDraft.cc}
                          onChange={(event) => setManualEmailDraft((current) => ({ ...current, cc: event.target.value }))}
                          placeholder="CC emails, optional"
                          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
                        />
                        <Input
                          value={manualEmailDraft.bcc}
                          onChange={(event) => setManualEmailDraft((current) => ({ ...current, bcc: event.target.value }))}
                          placeholder="BCC emails, optional"
                          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
                        />
                        <Input
                          value={manualEmailDraft.subject}
                          onChange={(event) => setManualEmailDraft((current) => ({ ...current, subject: event.target.value }))}
                          placeholder="Subject"
                          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
                        />
                        <Textarea
                          rows={8}
                          value={manualEmailDraft.message}
                          onChange={(event) => setManualEmailDraft((current) => ({ ...current, message: event.target.value }))}
                          placeholder="Write the email message here."
                          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
                        />

                        <Button type="submit" variant="hero" disabled={isSendingManualEmail} className="w-full rounded-full">
                          {isSendingManualEmail ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                          Send email
                        </Button>
                      </form>
                    )}
                  </Panel>
                ) : null}
              </div>

              {showEditorWorkspace ? (
                <Panel
                  eyebrow="Content editor"
                  title={activeSectionConfig.label}
                  description={activeSectionConfig.description}
                  className="min-h-[32rem]"
                >
                  {isLoadingContent || isCheckingSession ? (
                    <div className="flex min-h-[18rem] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/[0.04] text-white">
                      <Loader2 className="animate-spin" size={22} />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-100/78">
                        <LayoutDashboard size={16} className="text-[#79D3FF]" />
                        {activeSection === "customPages"
                          ? "Add pages, edit the public URL, and drag blocks into the order you want."
                          : activeSection === "home"
                            ? "Choose a subsection, then edit that part of the home experience without scrolling the full content tree."
                            : activeSection === "emailTemplates"
                              ? "Edit the raw HTML stored in Firebase, preview it live, and let the Worker use it the next time it sends an email."
                            : activeSection === "notFoundPage"
                              ? "Set an optional route alias, apply it to the draft, then save to publish it while keeping the fixed fallback route."
                              : "Use the add and remove controls inside list sections to build new tiles, cards, references, prompts, or links."}
                      </div>

                      {activeSection === "customPages" ? (
                        <CustomPagesEditor
                          notFoundAliasPath={draft.notFoundPageRoute.aliasPath}
                          value={draft.customPages}
                          selectedPageId={activeCustomPageId}
                          onSelectedPageIdChange={setActiveCustomPageId}
                          onChange={(nextValue) =>
                            setDraft((current) => ({
                              ...current,
                              customPages: nextValue,
                            }))
                          }
                        />
                      ) : activeSection === "home" ? (
                        <div className="space-y-6">
                          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white">Home page sections</p>
                              <p className="mt-1 text-xs leading-6 text-slate-300/72">
                                Pick one section and edit only that part. Your last open section stays selected when you come back.
                              </p>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-2">
                              {homeEditorSectionConfig.map((section) => {
                                const isActive = section.key === activeHomeEditorSection;

                                return (
                                  <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => setActiveHomeEditorSection(section.key)}
                                    className={cn(
                                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                                      isActive
                                        ? "border-[#79D3FF]/55 bg-[#79D3FF]/12 text-white"
                                        : "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06]",
                                    )}
                                  >
                                    {section.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                            <div className="mb-5">
                              <p className="text-sm font-semibold text-white">{activeHomeEditorSectionConfig.label}</p>
                              <p className="mt-1 text-xs leading-6 text-slate-300/72">{activeHomeEditorSectionConfig.description}</p>
                              {activeHomeEditorSection === "contact" ? (
                                <p className="mt-2 text-xs leading-6 text-slate-300/60">
                                  Contact delivery settings live here, including the submission recipient, CC emails, and action links.
                                </p>
                              ) : null}
                            </div>
                            {activeHomeEditorSection === "siteShell" ? (
                              <SiteContentEditor
                                label="Site shell"
                                value={draft.siteShell}
                                template={defaultSiteContent.siteShell}
                                path={["siteShell"]}
                                onChange={(nextValue) =>
                                  setDraft((current) => ({
                                    ...current,
                                    siteShell: nextValue as SiteContent["siteShell"],
                                  }))
                                }
                              />
                            ) : (
                              <SiteContentEditor
                                label={activeHomeEditorSectionConfig.label}
                                value={draft.home[activeHomeEditorSection]}
                                template={defaultSiteContent.home[activeHomeEditorSection]}
                                path={["home", activeHomeEditorSection]}
                                onChange={(nextValue) =>
                                  setDraft((current) => ({
                                    ...current,
                                    home: {
                                      ...current.home,
                                      [activeHomeEditorSection]: nextValue as SiteContent["home"][typeof activeHomeEditorSection],
                                    },
                                  }))
                                }
                              />
                            )}
                          </div>
                        </div>
                      ) : activeSection === "emailTemplates" ? (
                        <EmailTemplatesEditor
                          value={draft.emailTemplates}
                          onChange={(nextValue) =>
                            setDraft((current) => ({
                              ...current,
                              emailTemplates: nextValue,
                            }))
                          }
                        />
                      ) : activeSection === "notFoundPage" ? (
                        <div className="space-y-6">
                          <AdminRouteEditor
                            aliasPath={draft.notFoundPageRoute.aliasPath}
                            customPagePaths={draft.customPages.map((page) => page.path)}
                            description="Add an optional alias for previewing the 404 page on a named route. The fixed preview route remains active as a fallback."
                            fixedPath={NOT_FOUND_PREVIEW_PATH}
                            fixedPathLabel="Fixed preview route"
                            otherBuiltInPaths={[
                              "/",
                              ADMIN_PAGE_PATH,
                              "/reference-projects",
                            ].filter((path): path is string => typeof path === "string" && path.length > 0)}
                            placeholder="/preview-404"
                            title="404 preview alias"
                            onChange={(nextAliasPath) =>
                              setDraft((current) => ({
                                ...current,
                                notFoundPageRoute: {
                                  ...current.notFoundPageRoute,
                                  aliasPath: nextAliasPath,
                                },
                              }))
                            }
                          />
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
                      ) : (
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
                      )}
                    </div>
                  )}
                </Panel>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
