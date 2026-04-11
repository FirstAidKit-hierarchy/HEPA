import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const normalizeEnvValue = (value: string | undefined) => value?.trim() ?? "";

const readEnvValue = (key: keyof HepaRuntimeEnv) => {
  const runtimeValue = typeof window !== "undefined" ? window.__HEPA_RUNTIME_CONFIG__?.[key] : undefined;
  const buildValue = import.meta.env[key];

  return normalizeEnvValue(runtimeValue || buildValue);
};

const projectId = readEnvValue("VITE_FIREBASE_PROJECT_ID");
const derivedAuthDomain = projectId ? `${projectId}.firebaseapp.com` : "";

const firebaseConfig = {
  apiKey: readEnvValue("VITE_FIREBASE_API_KEY"),
  authDomain: readEnvValue("VITE_FIREBASE_AUTH_DOMAIN") || derivedAuthDomain,
  projectId,
  appId: readEnvValue("VITE_FIREBASE_APP_ID"),
  storageBucket: readEnvValue("VITE_FIREBASE_STORAGE_BUCKET") || undefined,
  messagingSenderId: readEnvValue("VITE_FIREBASE_MESSAGING_SENDER_ID") || undefined,
  measurementId: readEnvValue("VITE_FIREBASE_MEASUREMENT_ID") || undefined,
};

export const isFirebaseConfigured = [firebaseConfig.apiKey, firebaseConfig.authDomain, firebaseConfig.projectId, firebaseConfig.appId].every(
  (value) => value.length > 0,
);

const app = isFirebaseConfigured ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;

export const firebaseAuth = app ? getAuth(app) : null;
export const firestore = app ? getFirestore(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;

if (googleProvider) {
  googleProvider.setCustomParameters({ prompt: "select_account" });
}

if (firebaseAuth) {
  void setPersistence(firebaseAuth, browserLocalPersistence).catch(() => undefined);
}
