import { type User } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
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

const ADMIN_REQUESTS_COLLECTION = "adminRequests";
const ADMIN_USERS_COLLECTION = "adminUsers";
const adminRequestsCollectionRef = firestore ? collection(firestore, ADMIN_REQUESTS_COLLECTION) : null;
const adminUsersCollectionRef = firestore ? collection(firestore, ADMIN_USERS_COLLECTION) : null;
const ownerEmail = import.meta.env.VITE_ADMIN_OWNER_EMAIL?.trim() ?? "";

const normalizeString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeStatus = (value: unknown): AdminAccessRequestStatus => {
  if (value === "approved" || value === "declined") {
    return value;
  }

  return "pending";
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

const buildRequestDocument = (user: User) => {
  const requesterEmail = user.email?.trim();

  if (!requesterEmail) {
    throw new Error("This account does not have an email address.");
  }
  const requesterName = user.displayName?.trim() ?? "";
  const baseRequest = {
    uid: user.uid,
    email: requesterEmail,
    displayName: requesterName,
    status: "pending" as const,
    requestedAt: new Date().toISOString(),
    reviewedAt: "",
    reviewedByUid: "",
    reviewedByEmail: "",
    ownerEmail,
  };

  if (!ownerEmail) {
    return baseRequest;
  }

  const reviewUrl = getReviewUrl();

  return {
    ...baseRequest,
    to: [ownerEmail],
    message: {
      subject: `HEPA admin access request: ${requesterEmail}`,
      text: [
        `${requesterEmail} requested access to the HEPA admin editor.`,
        requesterName ? `Display name: ${requesterName}` : "",
        `Review the request here: ${reviewUrl}`,
      ]
        .filter(Boolean)
        .join("\n"),
      html: [
        `<p><strong>${requesterEmail}</strong> requested access to the HEPA admin editor.</p>`,
        requesterName ? `<p>Display name: ${requesterName}</p>` : "",
        `<p><a href="${reviewUrl}">Open the admin review page</a></p>`,
      ]
        .filter(Boolean)
        .join(""),
    },
  };
};

export const isAdminRequestConfigured = Boolean(firestore);
export const adminRequestOwnerEmail = ownerEmail;
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

export const submitAdminAccessRequest = async (user: User) => {
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  const requestRef = doc(firestore, ADMIN_REQUESTS_COLLECTION, user.uid);
  const snapshot = await getDoc(requestRef);

  if (snapshot.exists()) {
    const existing = normalizeAdminAccessRequest(snapshot.id, snapshot.data());

    if (existing) {
      return existing;
    }
  }

  const request = buildRequestDocument(user);
  await setDoc(requestRef, request);
  return normalizeAdminAccessRequest(user.uid, request);
};

export const approveAdminAccessRequest = async (request: AdminAccessRequest, reviewer: User) => {
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  await assertOwnerReviewer(reviewer);

  const reviewedAt = new Date().toISOString();

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
      status: "approved",
      reviewedAt,
      reviewedByUid: reviewer.uid,
      reviewedByEmail: reviewer.email?.trim() ?? "",
    },
    { merge: true },
  );
};

export const declineAdminAccessRequest = async (request: AdminAccessRequest, reviewer: User) => {
  if (!firestore) {
    throw new Error("Firebase is not configured.");
  }

  await assertOwnerReviewer(reviewer);

  await setDoc(
    doc(firestore, ADMIN_REQUESTS_COLLECTION, request.uid),
    {
      status: "declined",
      reviewedAt: new Date().toISOString(),
      reviewedByUid: reviewer.uid,
      reviewedByEmail: reviewer.email?.trim() ?? "",
    },
    { merge: true },
  );
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
