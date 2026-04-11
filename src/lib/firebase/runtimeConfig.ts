type RuntimeConfigPayload = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  appId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  measurementId?: string;
  ownerEmail?: string;
};

const normalizeEnvValue = (value: string | undefined) => value?.trim() ?? "";

const looksLikeHtmlDocument = (value: string) => /<!doctype html|<html/i.test(value);

export const bootstrapFirebaseRuntimeConfig = async () => {
  if (typeof window === "undefined" || window.__HEPA_RUNTIME_CONFIG__) {
    return;
  }

  try {
    const response = await fetch("/api/firebase-config", {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      const responseText = await response.text().catch(() => "");

      if (looksLikeHtmlDocument(responseText)) {
        return;
      }

      return;
    }

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as RuntimeConfigPayload;
    const projectId = normalizeEnvValue(payload.projectId);
    const authDomain = normalizeEnvValue(payload.authDomain) || (projectId ? `${projectId}.firebaseapp.com` : "");
    const runtimeConfig: HepaRuntimeEnv = {
      VITE_FIREBASE_API_KEY: normalizeEnvValue(payload.apiKey),
      VITE_FIREBASE_AUTH_DOMAIN: authDomain,
      VITE_FIREBASE_PROJECT_ID: projectId,
      VITE_FIREBASE_STORAGE_BUCKET: normalizeEnvValue(payload.storageBucket) || undefined,
      VITE_FIREBASE_MESSAGING_SENDER_ID: normalizeEnvValue(payload.messagingSenderId) || undefined,
      VITE_FIREBASE_APP_ID: normalizeEnvValue(payload.appId),
      VITE_FIREBASE_MEASUREMENT_ID: normalizeEnvValue(payload.measurementId) || undefined,
      VITE_ADMIN_OWNER_EMAIL: normalizeEnvValue(payload.ownerEmail) || undefined,
    };

    if (Object.values(runtimeConfig).some((value) => normalizeEnvValue(value).length > 0)) {
      window.__HEPA_RUNTIME_CONFIG__ = runtimeConfig;
    }
  } catch {
    return;
  }
};
