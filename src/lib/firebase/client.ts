import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const normalizeEnvValue = (value: string | undefined) => value?.trim() ?? "";

const projectId = normalizeEnvValue(import.meta.env.VITE_FIREBASE_PROJECT_ID);
const derivedAuthDomain = projectId ? `${projectId}.firebaseapp.com` : "";

const firebaseConfig = {
  apiKey: normalizeEnvValue(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: normalizeEnvValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || derivedAuthDomain,
  projectId,
  appId: normalizeEnvValue(import.meta.env.VITE_FIREBASE_APP_ID),
  storageBucket: normalizeEnvValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || undefined,
  messagingSenderId: normalizeEnvValue(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || undefined,
  measurementId: normalizeEnvValue(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) || undefined,
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
