/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PATH?: string;
  readonly VITE_ADMIN_REQUEST_EMAIL_API_URL?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
  readonly VITE_ADMIN_OWNER_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type HepaRuntimeEnv = Partial<
  Pick<
    ImportMetaEnv,
    | "VITE_FIREBASE_API_KEY"
    | "VITE_FIREBASE_AUTH_DOMAIN"
    | "VITE_FIREBASE_PROJECT_ID"
    | "VITE_FIREBASE_STORAGE_BUCKET"
    | "VITE_FIREBASE_MESSAGING_SENDER_ID"
    | "VITE_FIREBASE_APP_ID"
    | "VITE_FIREBASE_MEASUREMENT_ID"
    | "VITE_ADMIN_REQUEST_EMAIL_API_URL"
    | "VITE_ADMIN_OWNER_EMAIL"
  >
>;

interface Window {
  __HEPA_RUNTIME_CONFIG__?: HepaRuntimeEnv;
}
