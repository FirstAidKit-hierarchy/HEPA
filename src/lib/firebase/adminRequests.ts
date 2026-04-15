import { type User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";
import { ADMIN_PAGE_PATH } from "@/pages/admin/config";

export type AdminAccessRequestStatus = "pending" | "approved" | "declined";

export type AdminAccessRequest = {
  uid: string;
  email: string;
  displayName: string;
  status: AdminAccessRequestStatus;
  requestedAt: string;
  reviewedAt: string;
  reviewedByUid: string;
  reviewedByEmail: string;
  ownerEmail: string;
};

export type AdminUserRecord = {
  uid: string;
  email: string;
  role: string;
  grantedAt: string;
  grantedByUid: string;
  grantedByEmail: string;
};

export type AdminAccessRequestMutationResult = {
  request: AdminAccessRequest;
  emailQueued: boolean;
  reusedPendingRequest?: boolean;
  resubmittedReviewedRequest?: boolean;
};

export type AdminRequestOwnerNotificationTransport = "api" | "firestore" | "disabled";

const ADMIN_REQUESTS_COLLECTION = "adminRequests";
const ADMIN_USERS_COLLECTION = "adminUsers";
const ADMIN_EMAIL_COLLECTION = "mail";
const adminRequestsCollectionRef = firestore ? collection(firestore, ADMIN_REQUESTS_COLLECTION) : null;
const adminUsersCollectionRef = firestore ? collection(firestore, ADMIN_USERS_COLLECTION) : null;
const adminEmailCollectionRef = firestore ? collection(firestore, ADMIN_EMAIL_COLLECTION) : null;

const normalizeEnvValue = (value: string | undefined) => value?.trim() ?? "";
const normalizeEmail = (value: string | undefined) => normalizeEnvValue(value).toLowerCase();
const readEnvValue = (key: keyof HepaRuntimeEnv) => {
  const runtimeValue = typeof window !== "undefined" ? window.__HEPA_RUNTIME_CONFIG__?.[key] : undefined;
  const buildValue = import.meta.env[key];

  return normalizeEnvValue(runtimeValue || buildValue);
};

const ownerRequestEmailApiUrl = readEnvValue("VITE_ADMIN_REQUEST_EMAIL_API_URL").replace(/\/+$/, "");
const ownerEmail = normalizeEmail(readEnvValue("VITE_ADMIN_OWNER_EMAIL"));

const normalizeString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeStatus = (value: unknown): AdminAccessRequestStatus => {
  if (value === "approved" || value === "declined") {
    return value;
  }

  return "pending";
};

const queueAdminAccessEmail = async ({
  to,
  subject,
  textLines,
  htmlLines,
  notificationType,
  relatedRequestUid,
}: {
  to: string;
  subject: string;
  textLines: string[];
  htmlLines: string[];
  notificationType: "admin-access-request-submitted" | "admin-access-request-reviewed";
  relatedRequestUid: string;
}) => {
  const recipient = normalizeString(to).toLowerCase();

  if (!adminEmailCollectionRef || !recipient) {
    return false;
  }

  await addDoc(adminEmailCollectionRef, {
    to: recipient,
    adminNotificationType: notificationType,
    relatedRequestUid,
    createdAt: new Date().toISOString(),
    message: {
      subject,
      text: textLines.filter(Boolean).join("\n"),
      html: htmlLines.filter(Boolean).join(""),
    },
  });

  return true;
};

const sendOwnerReviewEmailThroughApi = async (request: AdminAccessRequest) => {
  if (!ownerRequestEmailApiUrl) {
    return false;
  }

  const response = await fetch(`${ownerRequestEmailApiUrl}/send-admin-request-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requesterEmail: request.email,
      displayName: request.displayName,
      reviewUrl: getReviewUrl(),
    }),
  });
  const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || `Owner notification request failed (${response.status}).`);
  }

  return true;
};

const normalizeAdminUserRecord = (uid: string, value: unknown): AdminUserRecord | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source = value as Record<string, unknown>;
  const email = normalizeString(source.email);

  if (!email) {
    return null;
  }

  return {
    uid,
    email,
    role: normalizeString(source.role) || "admin",
    grantedAt: normalizeString(source.grantedAt),
    grantedByUid: normalizeString(source.grantedByUid),
    grantedByEmail: normalizeString(source.grantedByEmail),
  };
};

const getReviewUrl = () => {
  if (typeof window === "undefined") {
    return ADMIN_PAGE_PATH;
  }

  return `${window.location.origin}${ADMIN_PAGE_PATH}`;
};

const normalizeAdminAccessRequest = (uid: string, value: unknown): AdminAccessRequest | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source = value as Record<string, unknown>;
  const email = normalizeString(source.email);

  if (!email) {
    return null;
  }

  return {
    uid,
    email,
    displayName: normalizeString(source.displayName),
    status: normalizeStatus(source.status),
    requestedAt: normalizeString(source.requestedAt),
    reviewedAt: normalizeString(source.reviewedAt),
    reviewedByUid: normalizeString(source.reviewedByUid),
    reviewedByEmail: normalizeString(source.reviewedByEmail),
    ownerEmail: normalizeString(source.ownerEmail),
  };
};

const buildRequestDocument = (user: User, existingRequest?: AdminAccessRequest | null) => {
  const requesterEmail = normalizeEmail(user.email);

  if (!requesterEmail) {
    throw new Error("This account does not have an email address.");
  }

  const resolvedOwnerEmail = normalizeEmail(existingRequest?.ownerEmail) || ownerEmail;

  return {
    uid: user.uid,
    email: requesterEmail,
    displayName: user.displayName?.trim() ?? "",
    status: "pending" as const,
    requestedAt: new Date().toISOString(),
    reviewedAt: "",
    reviewedByUid: "",
    reviewedByEmail: "",
    ownerEmail: resolvedOwnerEmail,
  };
};

const queueOwnerReviewEmail = async (request: AdminAccessRequest) => {
  const reviewOwnerEmail = normalizeEmail(request.ownerEmail) || ownerEmail;

  if (!reviewOwnerEmail && !ownerRequestEmailApiUrl) {
    return false;
  }

  if (ownerRequestEmailApiUrl) {
    return sendOwnerReviewEmailThroughApi(request);
  }

  const reviewUrl = getReviewUrl();

  return queueAdminAccessEmail({
    to: reviewOwnerEmail,
    subject: `HEPA admin access request: ${request.email}`,
    textLines: [
      `${request.email} requested access to the HEPA admin editor.`,
      request.displayName ? `Display name: ${request.displayName}` : "",
      `Review the request here: ${reviewUrl}`,
    ],
    htmlLines: [
      `<p><strong>${request.email}</strong> requested access to the HEPA admin editor.</p>`,
      request.displayName ? `<p>Display name: ${request.displayName}</p>` : "",
      `<p><a href="${reviewUrl}">Open the admin review page</a></p>`,
    ],
    notificationType: "admin-access-request-submitted",
    relatedRequestUid: request.uid,
  });
};

const queueRequesterReviewEmail = async (
  request: AdminAccessRequest,
  reviewer: Pick<User, "email">,
  nextStatus: Extract<AdminAccessRequestStatus, "approved" | "declined">,
) => {
  const reviewUrl = getReviewUrl();
  const reviewerEmail = reviewer.email?.trim() ?? ownerEmail;
  const outcomeLabel = nextStatus === "approved" ? "approved" : "declined";

  return queueAdminAccessEmail({
    to: request.email,
    subject: `HEPA admin access ${outcomeLabel}: ${request.email}`,
    textLines: [
      `Your HEPA admin access request has been ${outcomeLabel}.`,
      reviewerEmail ? `Reviewed by: ${reviewerEmail}` : "",
      nextStatus === "approved" ? `Sign in here: ${reviewUrl}` : "",
    ],
    htmlLines: [
      `<p>Your HEPA admin access request has been <strong>${outcomeLabel}</strong>.</p>`,
      reviewerEmail ? `<p>Reviewed by: ${reviewerEmail}</p>` : "",
      nextStatus === "approved" ? `<p><a href="${reviewUrl}">Open the admin page</a></p>` : "",
    ],
    notificationType: "admin-access-request-reviewed",
    relatedRequestUid: request.uid,
  });
};

export const isAdminRequestConfigured = Boolean(firestore);
export const adminRequestOwnerEmail = ownerEmail;
export const adminRequestOwnerNotificationTransport: AdminRequestOwnerNotificationTransport = ownerRequestEmailApiUrl
  ? "api"
  : adminEmailCollectionRef
    ? "firestore"
    : "disabled";
export const isOwnerEmail = (email: string | null | undefined) =>
  Boolean(ownerEmail) && typeof email === "string" && email.trim().toLowerCase() === ownerEmail.toLowerCase();
export const isOwnerUser = (user: Pick<User, "email"> | null | undefined) => isOwnerEmail(user?.email);

const loadAdminUserRecordByUid = async (uid: string) => {
  if (!firestore) {
    return null;
  }

  const snapshot = await getDoc(doc(firestore, ADMIN_USERS_COLLECTION, uid));
  return snapshot.exists() ? normalizeAdminUserRecord(snapshot.id, snapshot.data()) : null;
};

const assertOwnerReviewer = async (reviewer: User) => {
  if (isOwnerUser(reviewer)) {
    return;
  }

  const adminRecord = await loadAdminUserRecordByUid(reviewer.uid);

  if (adminRecord?.role === "owner") {
    return;
  }

  throw new Error("Only the owner can manage admin access.");
};

export const loadAdminAccessRequest = async (uid: string) => {
  if (!firestore) {
    return null;
  }

  const snapshot = await getDoc(doc(firestore, ADMIN_REQUESTS_COLLECTION, uid));
  return snapshot.exists() ? normalizeAdminAccessRequest(snapshot.id, snapshot.data()) : null;
};

export const subscribeToAdminAccessRequest = (
  uid: string,
  onValue: (request: AdminAccessRequest | null) => void,
  onError?: (error: Error) => void,
) => {
  if (!firestore) {
    onValue(null);
    return () => undefined;
  }

  return onSnapshot(
    doc(firestore, ADMIN_REQUESTS_COLLECTION, uid),
    (snapshot) => onValue(snapshot.exists() ? normalizeAdminAccessRequest(snapshot.id, snapshot.data()) : null),
    (error) => onError?.(error),
  );
};

export const subscribeToAdminAccessRequests = (
  onValue: (requests: AdminAccessRequest[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!adminRequestsCollectionRef) {
    onValue([]);
    return () => undefined;
  }

  return onSnapshot(
    query(adminRequestsCollectionRef, orderBy("requestedAt", "desc")),
    (snapshot) =>
      onValue(
        snapshot.docs
          .map((item) => normalizeAdminAccessRequest(item.id, item.data()))
          .filter((item): item is AdminAccessRequest => Boolean(item)),
      ),
    (error) => onError?.(error),
  );
};

export const subscribeToAdminUsers = (
  onValue: (admins: AdminUserRecord[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!adminUsersCollectionRef) {
    onValue([]);
    return () => undefined;
  }

  return onSnapshot(
    query(adminUsersCollectionRef, orderBy("email", "asc")),
    (snapshot) =>
      onValue(
        snapshot.docs
          .map((item) => normalizeAdminUserRecord(item.id, item.data()))
          .filter((item): item is AdminUserRecord => Boolean(item)),
      ),
    (error) => onError?.(error),
  );
};

export const subscribeToAdminUserRecord = (
  uid: string,
  onValue: (admin: AdminUserRecord | null) => void,
  onError?: (error: Error) => void,
) => {
  if (!firestore) {
    onValue(null);
    return () => undefined;
  }

  return onSnapshot(
    doc(firestore, ADMIN_USERS_COLLECTION, uid),
    (snapshot) => onValue(snapshot.exists() ? normalizeAdminUserRecord(snapshot.id, snapshot.data()) : null),
    (error) => onError?.(error),
  );
};

export const submitAdminAccessRequest = async (user: User): Promise<AdminAccessRequestMutationResult> => {
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  const requestRef = doc(firestore, ADMIN_REQUESTS_COLLECTION, user.uid);
  const snapshot = await getDoc(requestRef);
  let resubmittedReviewedRequest = false;
  let existingRequest: AdminAccessRequest | null = null;

  if (snapshot.exists()) {
    existingRequest = normalizeAdminAccessRequest(snapshot.id, snapshot.data());

    if (existingRequest?.status === "pending") {
      let emailQueued = false;

      try {
        emailQueued = await queueOwnerReviewEmail(existingRequest);
      } catch (error) {
        console.error("Unable to queue the owner review email for the pending request.", error);
      }

      return {
        request: existingRequest,
        emailQueued,
        reusedPendingRequest: true,
      };
    }

    if (existingRequest?.status === "approved" || existingRequest?.status === "declined") {
      resubmittedReviewedRequest = true;
    }
  }

  const request = buildRequestDocument(user, existingRequest);
  await setDoc(requestRef, request);
  const normalizedRequest = normalizeAdminAccessRequest(user.uid, request);

  if (!normalizedRequest) {
    throw new Error("Unable to save the access request.");
  }

  let emailQueued = false;

  try {
    emailQueued = await queueOwnerReviewEmail(normalizedRequest);
  } catch (error) {
    console.error("Unable to queue the owner review email.", error);
  }

  return {
    request: normalizedRequest,
    emailQueued,
    resubmittedReviewedRequest,
  };
};

export const approveAdminAccessRequest = async (
  request: AdminAccessRequest,
  reviewer: User,
): Promise<AdminAccessRequestMutationResult> => {
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  await assertOwnerReviewer(reviewer);

  const reviewedAt = new Date().toISOString();
  const nextRequest = {
    ...request,
    status: "approved" as const,
    reviewedAt,
    reviewedByUid: reviewer.uid,
    reviewedByEmail: reviewer.email?.trim() ?? "",
  };

  await setDoc(
    doc(firestore, ADMIN_USERS_COLLECTION, request.uid),
    {
      email: request.email,
      role: "admin",
      grantedAt: reviewedAt,
      grantedByUid: reviewer.uid,
      grantedByEmail: reviewer.email?.trim() ?? "",
    },
    { merge: true },
  );

  await setDoc(
    doc(firestore, ADMIN_REQUESTS_COLLECTION, request.uid),
    {
      status: nextRequest.status,
      reviewedAt: nextRequest.reviewedAt,
      reviewedByUid: nextRequest.reviewedByUid,
      reviewedByEmail: nextRequest.reviewedByEmail,
    },
    { merge: true },
  );

  let emailQueued = false;

  try {
    emailQueued = await queueRequesterReviewEmail(nextRequest, reviewer, "approved");
  } catch (error) {
    console.error("Unable to queue the approval email.", error);
  }

  return {
    request: nextRequest,
    emailQueued,
  };
};

export const declineAdminAccessRequest = async (
  request: AdminAccessRequest,
  reviewer: User,
): Promise<AdminAccessRequestMutationResult> => {
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  await assertOwnerReviewer(reviewer);
  const nextRequest = {
    ...request,
    status: "declined" as const,
    reviewedAt: new Date().toISOString(),
    reviewedByUid: reviewer.uid,
    reviewedByEmail: reviewer.email?.trim() ?? "",
  };

  await setDoc(
    doc(firestore, ADMIN_REQUESTS_COLLECTION, request.uid),
    {
      status: nextRequest.status,
      reviewedAt: nextRequest.reviewedAt,
      reviewedByUid: nextRequest.reviewedByUid,
      reviewedByEmail: nextRequest.reviewedByEmail,
    },
    { merge: true },
  );

  let emailQueued = false;

  try {
    emailQueued = await queueRequesterReviewEmail(nextRequest, reviewer, "declined");
  } catch (error) {
    console.error("Unable to queue the decline email.", error);
  }

  return {
    request: nextRequest,
    emailQueued,
  };
};

export const revokeAdminAccess = async (admin: AdminUserRecord, reviewer: User) => {
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  await assertOwnerReviewer(reviewer);

  if (isOwnerEmail(admin.email) || admin.role === "owner") {
    throw new Error("Owner access cannot be removed.");
  }

  await deleteDoc(doc(firestore, ADMIN_USERS_COLLECTION, admin.uid));

  await setDoc(
    doc(firestore, ADMIN_REQUESTS_COLLECTION, admin.uid),
    {
      uid: admin.uid,
      email: admin.email,
      status: "declined",
      reviewedAt: new Date().toISOString(),
      reviewedByUid: reviewer.uid,
      reviewedByEmail: reviewer.email?.trim() ?? "",
      ownerEmail,
    },
    { merge: true },
  );
};

export const updateAdminRole = async (admin: AdminUserRecord, nextRole: "owner" | "admin", reviewer: User) => {
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  await assertOwnerReviewer(reviewer);

  if (isOwnerEmail(admin.email) && nextRole !== "owner") {
    throw new Error("The configured owner account cannot be demoted.");
  }

  await setDoc(
    doc(firestore, ADMIN_USERS_COLLECTION, admin.uid),
    {
      role: nextRole,
      grantedByUid: reviewer.uid,
      grantedByEmail: reviewer.email?.trim() ?? "",
    },
    { merge: true },
  );
};
