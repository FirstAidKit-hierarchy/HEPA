import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { createSiteContentDraft, normalizeSiteContent, type SiteContent } from "@/content/site/defaults";
import { firestore } from "@/lib/firebase/client";

const SITE_CONTENT_COLLECTION = "siteContent";
const SITE_CONTENT_DOCUMENT = "site-pages";
const ADMIN_USERS_COLLECTION = "adminUsers";

const siteContentRef = firestore ? doc(firestore, SITE_CONTENT_COLLECTION, SITE_CONTENT_DOCUMENT) : null;

const stripUndefined = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, stripUndefined(item)]),
    );
  }

  return value;
};

export const loadSiteContent = async () => {
  if (!siteContentRef) {
    return createSiteContentDraft();
  }

  const snapshot = await getDoc(siteContentRef);
  return snapshot.exists() ? normalizeSiteContent(snapshot.data()) : createSiteContentDraft();
};

export const subscribeToSiteContent = (
  onValue: (content: SiteContent | null) => void,
  onError?: (error: Error) => void,
) => {
  if (!siteContentRef) {
    onValue(createSiteContentDraft());
    return () => undefined;
  }

  return onSnapshot(
    siteContentRef,
    (snapshot) => onValue(snapshot.exists() ? normalizeSiteContent(snapshot.data()) : createSiteContentDraft()),
    (error) => onError?.(error),
  );
};

export const saveSiteContent = async (content: SiteContent) => {
  if (!siteContentRef) {
    throw new Error("Firebase is not configured.");
  }

  const normalized = normalizeSiteContent(content);
  await setDoc(siteContentRef, stripUndefined(normalized), { merge: true });
  return normalized;
};

export const isAdminUser = async (uid: string) => {
  if (!firestore) {
    return false;
  }

  const snapshot = await getDoc(doc(firestore, ADMIN_USERS_COLLECTION, uid));
  return snapshot.exists();
};
