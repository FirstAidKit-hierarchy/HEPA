type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  setHeader: (name: string, value: string) => ApiResponse;
  send: (body: string) => void;
};

const json = (res: ApiResponse, status: number, body: Record<string, unknown>) => {
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.send(JSON.stringify(body));
};

const normalizeEnv = (value: string | undefined) => value?.trim() ?? "";

const firstEnv = (...names: string[]) => {
  for (const name of names) {
    const value = normalizeEnv(process.env[name]);

    if (value) {
      return value;
    }
  }

  return "";
};

export default function handler(_req: unknown, res: ApiResponse) {
  const projectId = firstEnv("VITE_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "FIREBASE_ADMIN_PROJECT_ID");
  const authDomain =
    firstEnv("VITE_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "FIREBASE_AUTH_DOMAIN") ||
    (projectId ? `${projectId}.firebaseapp.com` : "");
  const payload = {
    apiKey: firstEnv("VITE_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_API_KEY", "FIREBASE_API_KEY"),
    authDomain,
    projectId,
    appId: firstEnv("VITE_FIREBASE_APP_ID", "NEXT_PUBLIC_FIREBASE_APP_ID", "FIREBASE_APP_ID"),
    storageBucket: firstEnv("VITE_FIREBASE_STORAGE_BUCKET", "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: firstEnv(
      "VITE_FIREBASE_MESSAGING_SENDER_ID",
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "FIREBASE_MESSAGING_SENDER_ID",
    ),
    measurementId: firstEnv("VITE_FIREBASE_MEASUREMENT_ID", "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", "FIREBASE_MEASUREMENT_ID"),
    adminRequestEmailApiUrl: firstEnv("VITE_ADMIN_REQUEST_EMAIL_API_URL", "NEXT_PUBLIC_ADMIN_REQUEST_EMAIL_API_URL"),
    ownerEmail: firstEnv("VITE_ADMIN_OWNER_EMAIL", "NEXT_PUBLIC_ADMIN_OWNER_EMAIL"),
  };

  return json(res, 200, {
    ...payload,
    isConfigured: [payload.apiKey, payload.authDomain, payload.projectId, payload.appId].every((value) => value.length > 0),
  });
}
