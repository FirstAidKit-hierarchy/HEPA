import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Chrome,
  Clock3,
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
  UserPlus,
  X,
} from "lucide-react";
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
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
  updateAdminRole,
  type AdminAccessRequest,
  type AdminUserRecord,
} from "@/lib/firebase/adminRequests";
import { setManagedAdminPassword } from "@/lib/firebase/adminPasswords";
import { firebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase/client";
import { isAdminUser, loadSiteContent, saveSiteContent } from "@/lib/firebase/siteContent";
import { normalizePagePath } from "@/lib/site-pages";
import { cn } from "@/lib/utils";
import { createCustomPageDraft, createSiteContentDraft, defaultSiteContent, type SiteContent } from "@/content/site/defaults";
import { NOT_FOUND_PREVIEW_PATH } from "@/pages/not-found/config";
import { PRIVATE_PAGE_PATH } from "@/pages/private/config";
import { ADMIN_PAGE_PATH, ADMIN_PAGE_ROBOTS, ADMIN_PAGE_TITLE } from "./config";
import AdminRouteEditor from "./AdminRouteEditor";
import CustomPagesEditor from "./CustomPagesEditor";
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

const sectionConfig = [
  {
    key: "home",
    label: "Home page",
    description: "Shared site shell plus hero, service tiles, proof cards, insights, and contact sections.",
    previewHref: "/",
  },
  {
    key: "privatePage",
    label: "Private page",
    description: "Workshop attendee page content, agenda links, and payment actions.",
    previewHref: PRIVATE_PAGE_PATH,
  },
  {
    key: "customPages",
    label: "Custom pages",
    description: "Build extra landing pages with editable URLs and drag-and-drop content blocks.",
    previewHref: "/",
  },
  {
    key: "adminPage",
    label: "Admin page",
    description: "Optional editable alias for the secure admin workspace. The fixed secret route remains active.",
    previewHref: ADMIN_PAGE_PATH,
  },
  {
    key: "notFoundPage",
    label: "404 page",
    description: "Fallback page copy and return action.",
    previewHref: NOT_FOUND_PREVIEW_PATH,
  },
] as const;

type SectionKey = (typeof sectionConfig)[number]["key"];
const pageViewSections = sectionConfig.filter((section) => section.key !== "privatePage" && section.key !== "customPages");

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
  const [activeRoleUid, setActiveRoleUid] = useState<string | null>(null);
  const [activeManagedPasswordUid, setActiveManagedPasswordUid] = useState<string | null>(null);
  const [emailAuthMode, setEmailAuthMode] = useState<"signIn" | "createPassword">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [selectedManagedPasswordUid, setSelectedManagedPasswordUid] = useState("");
  const [managedPassword, setManagedPassword] = useState("");
  const [confirmManagedPassword, setConfirmManagedPassword] = useState("");
  const [draft, setDraft] = useState<SiteContent>(() => createSiteContentDraft(defaultSiteContent));
  const [publishedContent, setPublishedContent] = useState<SiteContent>(() => createSiteContentDraft(defaultSiteContent));
  const [activeCustomPageId, setActiveCustomPageId] = useState<string | null>(null);
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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      if (!nextUser) {
        setDraft(createSiteContentDraft(defaultSiteContent));
        setPublishedContent(createSiteContentDraft(defaultSiteContent));
        setOwnAccessRequest(null);
        setAccessRequests([]);
        setAdminUsers([]);
        setEmailAuthMode("signIn");
        setPassword("");
        setConfirmPassword("");
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

    const active = true;

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
    if (!user || !hasAdminAccess) {
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

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      toast.error("Enter an email address.");
      return;
    }

    if (!password) {
      toast.error(emailAuthMode === "createPassword" ? "Enter a password to create the account." : "Enter your password.");
      return;
    }

    if (emailAuthMode === "createPassword") {
      if (password.length < 8) {
        toast.error("Use at least 8 characters for the new password.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("The password confirmation does not match.");
        return;
      }
    }

    try {
      setIsCheckingSession(true);
      if (emailAuthMode === "createPassword") {
        await createUserWithEmailAndPassword(firebaseAuth, trimmedEmail, password);
        toast.success("Password created. You are now signed in.");
      } else {
        await signInWithEmailAndPassword(firebaseAuth, trimmedEmail, password);
      }

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Email authentication failed.", error);
      toast.error(
        getErrorMessage(
          error,
          emailAuthMode === "createPassword"
            ? "Unable to create the password. If the account already exists, switch to sign in or send a reset link."
            : "Email sign-in failed. Check your password or send a reset link.",
        ),
      );
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
      await sendPasswordResetEmail(firebaseAuth, trimmedEmail);
      toast.success("Password reset email sent.");
    } catch (error) {
      console.error("Unable to send the password reset email.", error);
      toast.error(getErrorMessage(error, "Unable to send the password reset email."));
    } finally {
      setIsSendingResetEmail(false);
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
    setEmailAuthMode("signIn");
    setPassword("");
    setConfirmPassword("");
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
      if (!canManageAccess) {
        toast.error("Only the owner can approve access.");
        return;
      }

      setActiveRequestActionUid(request.uid);
      await approveAdminAccessRequest(request, user);
      toast.success(`Approved admin access for ${formatVisibleEmail(request.email)}.`);
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
      if (!canManageAccess) {
        toast.error("Only the owner can decline access.");
        return;
      }

      setActiveRequestActionUid(request.uid);
      await declineAdminAccessRequest(request, user);
      toast.success(`Declined admin access for ${formatVisibleEmail(request.email)}.`);
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

  const activeSectionConfig = sectionConfig.find((section) => section.key === activeSection) ?? sectionConfig[0];
  const activeValue = draft[activeSection];
  const activeTemplate = defaultSiteContent[activeSection];
  const activeCustomPage = draft.customPages.find((page) => page.id === activeCustomPageId) ?? draft.customPages[0] ?? null;
  const activeAdminPreviewHref = draft.adminPage.aliasPath || ADMIN_PAGE_PATH;
  const activePrivatePreviewHref = draft.privatePageRoute.aliasPath || PRIVATE_PAGE_PATH;
  const activeNotFoundPreviewHref = draft.notFoundPageRoute.aliasPath || NOT_FOUND_PREVIEW_PATH;
  const activeCustomPreviewHref = normalizePagePath(activeCustomPage?.path ?? "/");
  const savedPageCards = [
    {
      key: "privatePage",
      label: "Private page",
      description: "Workshop attendee page content, agenda links, and payment actions.",
      href: activePrivatePreviewHref,
      isActive: activeSection === "privatePage",
      onClick: () => setActiveSection("privatePage" as SectionKey),
    },
    {
      key: "customPages",
      label: "Custom pages",
      description: "Build extra landing pages with editable URLs and drag-and-drop content blocks.",
      href: activeCustomPreviewHref,
      isActive: activeSection === "customPages",
      onClick: () => setActiveSection("customPages" as SectionKey),
    },
  ] as const;
  const currentAdminRecord = user ? adminUsers.find((admin) => admin.uid === user.uid) ?? null : null;
  const isOwner = isOwnerUser(user) || currentAdminRecord?.role === "owner";
  const canManageAccess = isOwner;
  const formatVisibleEmail = (email: string) => (isOwner ? email.trim() : maskEmailAddress(email));
  const pendingAccessRequests = accessRequests.filter((request) => request.status === "pending");
  const reviewedAccessRequests = accessRequests.filter((request) => request.status !== "pending").slice(0, 4);
  const visibleAdmins = adminUsers;
  const ownerAccounts = adminUsers.filter((admin) => isOwnerEmail(admin.email) || admin.role === "owner");
  const currentAdminCards = canManageAccess ? visibleAdmins : ownerAccounts;
  const selectedManagedPasswordUser = visibleAdmins.find((admin) => admin.uid === selectedManagedPasswordUid) ?? visibleAdmins[0] ?? null;
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
  const showEditorWorkspace = hasAdminAccess;
  const showAccessScreen = !showEditorWorkspace;
  const administrationTitle = showEditorWorkspace ? "Edit every page from one workspace" : "Secure admin access";
  const administrationDescription = showEditorWorkspace
    ? "This admin panel controls the homepage and shared site shell, the private attendee page, custom landing pages, and the 404 page. Array sections and custom pages both support no-code content building."
    : "Only approved administrator accounts can unlock the editor workspace. Sign in to continue.";
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Mail size={16} className="text-[#79D3FF]" />
            Email access
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={emailAuthMode === "signIn" ? "hero" : "outline"}
              size="sm"
              onClick={() => {
                setEmailAuthMode("signIn");
                setConfirmPassword("");
              }}
              className={cn(
                "rounded-full",
                emailAuthMode === "signIn" ? "" : "border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white",
              )}
            >
              Sign in
            </Button>
            <Button
              type="button"
              variant={emailAuthMode === "createPassword" ? "hero" : "outline"}
              size="sm"
              onClick={() => setEmailAuthMode("createPassword")}
              className={cn(
                "rounded-full",
                emailAuthMode === "createPassword" ? "" : "border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white",
              )}
            >
              First login
            </Button>
          </div>
        </div>
        <p className="text-xs leading-6 text-slate-300/72">
          {emailAuthMode === "createPassword"
            ? "Create the email/password account on the first login. After that, use the same email and password to sign in."
            : "Use the password you already created for this admin email. If you forgot it, send a reset link below."}
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
          placeholder={emailAuthMode === "createPassword" ? "Create password" : "Password"}
          className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
        />
        {emailAuthMode === "createPassword" ? (
          <PasswordInput
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm password"
            className="border-white/12 bg-white/10 text-white placeholder:text-slate-300/55"
          />
        ) : null}
        <Button type="submit" variant="hero" className="w-full rounded-full" disabled={isCheckingSession}>
          {isCheckingSession ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
          {emailAuthMode === "createPassword" ? "Create password and continue" : "Sign in securely"}
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
      </form>
    </div>
  ) : !hasAdminAccess ? (
    <div className="space-y-4 rounded-[1.5rem] border border-rose-300/16 bg-rose-100/10 p-5 text-sm leading-7 text-slate-100">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-rose-200" size={18} />
        <p className="font-medium text-white">Signed in, but this account is not allowed to edit.</p>
      </div>
      <p>
        {user.email ?? "This account"} is signed in, but it has not been approved for editor access yet.
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
                    title="Page views"
                    description="Open the live page you are editing in a new tab to verify spacing, route paths, block order, and device behavior."
                  >
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      {pageViewSections.map((section) => (
                        (() => {
                          const previewHref =
                            section.key === "customPages"
                              ? normalizePagePath(activeCustomPage?.path ?? "/")
                              : section.key === "adminPage"
                                ? activeAdminPreviewHref
                                : section.key === "privatePage"
                                  ? activePrivatePreviewHref
                                  : section.key === "notFoundPage"
                                    ? activeNotFoundPreviewHref
                                  : section.previewHref;

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
                      {savedPageCards.map((page) => (
                        <button
                          key={page.key}
                          type="button"
                          onClick={page.onClick}
                          className={cn(
                            "w-full rounded-[1.25rem] border p-4 text-left transition-all duration-300",
                            page.isActive
                              ? "border-[#79D3FF]/35 bg-white/[0.1] shadow-[0_16px_38px_rgba(8,15,28,0.18)]"
                              : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white">{page.label}</p>
                              <p className="mt-2 text-xs leading-6 text-slate-300/72">{page.description}</p>
                            </div>
                            <a
                              href={page.href}
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
                    eyebrow="Access Requests"
                    title="Access management"
                    description="Approved admins can monitor pending requests and current roles. Only the owner can approve, decline, change roles, or remove access."
                  >
                    <div className="space-y-4">
                      {!canManageAccess ? (
                        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4 text-sm leading-7 text-slate-100/78">
                          You can review access activity here, but only {adminRequestOwnerEmail || "the configured owner"} can approve, decline, change roles, or remove access.
                        </div>
                      ) : null}
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Pending</p>
                          <p className="mt-3 text-2xl font-bold text-white">{pendingAccessRequests.length}</p>
                        </div>
                        <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">Notifications</p>
                          <p className="mt-3 text-sm font-medium text-white">
                            {adminRequestOwnerEmail ? `Optional email: ${formatVisibleEmail(adminRequestOwnerEmail)}` : "Manual review in admin panel"}
                          </p>
                        </div>
                      </div>

                      {pendingAccessRequests.length ? (
                        <div className="space-y-3">
                          {pendingAccessRequests.map((request) => (
                            <div key={request.uid} className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-white">{formatVisibleEmail(request.email)}</p>
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
                                    disabled={!canManageAccess || activeRequestActionUid === request.uid}
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
                                    disabled={!canManageAccess || activeRequestActionUid === request.uid}
                                    className="rounded-full border-white/12 bg-white/10 text-white hover:bg-white/14 hover:text-white disabled:opacity-50"
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
                              <p className="text-sm font-medium text-white">{formatVisibleEmail(request.email)}</p>
                              <p className="mt-1 text-xs leading-6 text-slate-300/70">
                                {request.status === "approved" ? "Approved" : "Declined"} by{" "}
                                {request.reviewedByEmail ? formatVisibleEmail(request.reviewedByEmail) : "an admin"}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/66">
                          {canManageAccess ? "Current admins" : "Current owners"}
                        </p>
                        {currentAdminCards.length ? (
                          currentAdminCards.map((admin) => {
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
                            {canManageAccess ? "No admin accounts found." : "No owner accounts found."}
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
                            ? "Edit the shared site shell and homepage sections from one screen."
                          : activeSection === "adminPage" || activeSection === "privatePage" || activeSection === "notFoundPage"
                            ? "Set an optional route alias, apply it to the draft, then save to publish it while keeping the fixed fallback route."
                            : "Use the add and remove controls inside list sections to build new tiles, cards, references, prompts, or links."}
                      </div>

                      {activeSection === "customPages" ? (
                        <CustomPagesEditor
                          adminAliasPath={draft.adminPage.aliasPath}
                          notFoundAliasPath={draft.notFoundPageRoute.aliasPath}
                          privateAliasPath={draft.privatePageRoute.aliasPath}
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
                            <div className="mb-5">
                              <p className="text-sm font-semibold text-white">Site shell</p>
                              <p className="mt-1 text-xs leading-6 text-slate-300/72">
                                Edit the shared navigation, primary CTA, and footer content used across the public site.
                              </p>
                            </div>
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
                          </div>

                          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                            <div className="mb-5">
                              <p className="text-sm font-semibold text-white">Home page sections</p>
                              <p className="mt-1 text-xs leading-6 text-slate-300/72">
                                Edit the homepage hero, tiles, proof, trust, insights, contact, and partner sections.
                              </p>
                            </div>
                            <SiteContentEditor
                              label={activeSectionConfig.label}
                              value={draft.home}
                              template={defaultSiteContent.home}
                              path={["home"]}
                              onChange={(nextValue) =>
                                setDraft((current) => ({
                                  ...current,
                                  home: nextValue as SiteContent["home"],
                                }))
                              }
                            />
                          </div>
                        </div>
                      ) : activeSection === "adminPage" ? (
                        <AdminRouteEditor
                          aliasPath={draft.adminPage.aliasPath}
                          customPagePaths={draft.customPages.map((page) => page.path)}
                          description="Add an optional public alias like `/admin` or `/workspace`. The fixed secret route stays active as a fallback even if the alias changes later."
                          fixedPath={ADMIN_PAGE_PATH}
                          fixedPathLabel="Fixed secret route"
                          otherBuiltInPaths={[
                            "/",
                            PRIVATE_PAGE_PATH,
                            draft.privatePageRoute.aliasPath,
                            NOT_FOUND_PREVIEW_PATH,
                            draft.notFoundPageRoute.aliasPath,
                          ].filter((path): path is string => typeof path === "string" && path.length > 0)}
                          placeholder="/admin"
                          title="Admin route alias"
                          onChange={(nextAliasPath) =>
                            setDraft((current) => ({
                              ...current,
                              adminPage: {
                                ...current.adminPage,
                                aliasPath: nextAliasPath,
                              },
                            }))
                          }
                        />
                      ) : activeSection === "privatePage" ? (
                        <div className="space-y-6">
                          <AdminRouteEditor
                            aliasPath={draft.privatePageRoute.aliasPath}
                            customPagePaths={draft.customPages.map((page) => page.path)}
                            description="Add an optional alias like `/attendees` or `/workshop-access`. The fixed private route remains active as a fallback."
                            fixedPath={PRIVATE_PAGE_PATH}
                            otherBuiltInPaths={[
                              "/",
                              ADMIN_PAGE_PATH,
                              draft.adminPage.aliasPath,
                              NOT_FOUND_PREVIEW_PATH,
                              draft.notFoundPageRoute.aliasPath,
                            ].filter((path): path is string => typeof path === "string" && path.length > 0)}
                            placeholder="/attendees"
                            title="Private page alias"
                            onChange={(nextAliasPath) =>
                              setDraft((current) => ({
                                ...current,
                                privatePageRoute: {
                                  ...current.privatePageRoute,
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
                              draft.adminPage.aliasPath,
                              PRIVATE_PAGE_PATH,
                              draft.privatePageRoute.aliasPath,
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
