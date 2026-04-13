import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type FirebaseLookupUser = {
  localId?: string;
  email?: string;
};

type FirestoreStringField = {
  stringValue?: string;
};

type FirestoreDocument = {
  fields?: Record<string, FirestoreStringField | undefined>;
};

type ApiRequest = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  setHeader: (name: string, value: string) => ApiResponse;
  send: (body: string) => void;
};

const json = (res: ApiResponse, status: number, body: Record<string, unknown>) => {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
};

const normalizeEnv = (value: string | undefined) => value?.trim() ?? "";

type LocalServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

const firstEnv = (...names: string[]) => {
  for (const name of names) {
    const value = normalizeEnv(process.env[name]);

    if (value) {
      return value;
    }
  }

  return "";
};

const loadLocalServiceAccount = (): LocalServiceAccount => {
  const serviceAccountPath = path.join(process.cwd(), "firebase-service-account.local.json");

  try {
    if (!fs.existsSync(serviceAccountPath)) {
      return {
        projectId: "",
        clientEmail: "",
        privateKey: "",
      };
    }

    const payload = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8")) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };

    return {
      projectId: normalizeEnv(payload.project_id),
      clientEmail: normalizeEnv(payload.client_email),
      privateKey: normalizeEnv(payload.private_key),
    };
  } catch {
    return {
      projectId: "",
      clientEmail: "",
      privateKey: "",
    };
  }
};

const localServiceAccount = loadLocalServiceAccount();

const projectId =
  firstEnv("FIREBASE_ADMIN_PROJECT_ID", "VITE_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_PROJECT_ID") ||
  localServiceAccount.projectId;
const apiKey = firstEnv("FIREBASE_API_KEY", "VITE_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_API_KEY");
const ownerEmail = firstEnv("VITE_ADMIN_OWNER_EMAIL", "NEXT_PUBLIC_ADMIN_OWNER_EMAIL").toLowerCase();
const serviceAccountEmail = normalizeEnv(process.env.FIREBASE_ADMIN_CLIENT_EMAIL) || localServiceAccount.clientEmail;
const serviceAccountPrivateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? localServiceAccount.privateKey ?? "").replace(/\\n/g, "\n");

const requiredScopes = [
  "https://www.googleapis.com/auth/identitytoolkit",
  "https://www.googleapis.com/auth/datastore",
];

const getBearerToken = (headerValue: string | string[] | undefined) => {
  if (!headerValue) {
    return "";
  }

  const normalizedHeader = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  const [scheme, token] = normalizedHeader.split(" ");

  return scheme?.toLowerCase() === "bearer" ? token?.trim() ?? "" : "";
};

const parseBody = (body: unknown) => {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  return typeof body === "object" ? (body as Record<string, unknown>) : {};
};

const base64UrlEncode = (value: string) => Buffer.from(value).toString("base64url");

const createServiceAccountJwt = () => {
  const tokenUri = "https://oauth2.googleapis.com/token";
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 3600;
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: serviceAccountEmail,
      scope: requiredScopes.join(" "),
      aud: tokenUri,
      iat: issuedAt,
      exp: expiresAt,
    }),
  );
  const unsignedToken = `${header}.${payload}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsignedToken).end().sign(serviceAccountPrivateKey, "base64url");

  return `${unsignedToken}.${signature}`;
};

const getGoogleAccessToken = async () => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: createServiceAccountJwt(),
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to obtain a Google access token.");
  }

  const payload = (await response.json()) as { access_token?: string };

  if (!payload.access_token) {
    throw new Error("Google access token response was empty.");
  }

  return payload.access_token;
};

const lookupFirebaseUserByIdToken = async (idToken: string) => {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("Unable to verify the current Firebase session.");
  }

  const payload = (await response.json()) as { users?: FirebaseLookupUser[] };
  const user = payload.users?.[0];

  if (!user?.localId || !user.email) {
    throw new Error("The current Firebase session could not be resolved.");
  }

  return {
    uid: user.localId,
    email: user.email.trim().toLowerCase(),
  };
};

const loadAdminUserDocument = async (accessToken: string, uid: string) => {
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/adminUsers/${uid}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load the admin user record.");
  }

  const payload = (await response.json()) as FirestoreDocument;
  const email = payload.fields?.email?.stringValue?.trim() ?? "";
  const role = payload.fields?.role?.stringValue?.trim() ?? "admin";

  return {
    email,
    role,
  };
};

const updateFirebaseUserPassword = async (accessToken: string, uid: string, password: string) => {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      localId: uid,
      password,
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      typeof payload === "object" && payload && "error" in payload && payload.error && typeof payload.error === "object"
        ? (payload.error as { message?: string }).message
        : "";
    throw new Error(message ? `Unable to update the password (${message}).` : "Unable to update the password.");
  }
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed." });
  }

  if (!projectId || !apiKey || !serviceAccountEmail || !serviceAccountPrivateKey) {
    return json(res, 500, { error: "Password overrides are not configured on the server." });
  }

  const idToken = getBearerToken(req.headers?.authorization);
  const body = parseBody(req.body);
  const targetUid = typeof body.targetUid === "string" ? body.targetUid.trim() : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!idToken) {
    return json(res, 401, { error: "Missing Firebase session." });
  }

  if (!targetUid) {
    return json(res, 400, { error: "Missing target user." });
  }

  if (newPassword.trim().length < 8) {
    return json(res, 400, { error: "Use at least 8 characters for the new password." });
  }

  try {
    const requester = await lookupFirebaseUserByIdToken(idToken);
    const accessToken = await getGoogleAccessToken();
    const requesterAdminRecord = await loadAdminUserDocument(accessToken, requester.uid);
    const isRequesterOwner = requester.email === ownerEmail || requesterAdminRecord?.role === "owner";

    if (!isRequesterOwner) {
      return json(res, 403, { error: "Only owners can change another user's password." });
    }

    const targetAdminRecord = await loadAdminUserDocument(accessToken, targetUid);

    if (!targetAdminRecord?.email) {
      return json(res, 404, { error: "The target admin account could not be found." });
    }

    await updateFirebaseUserPassword(accessToken, targetUid, newPassword);
    return json(res, 200, { ok: true, email: targetAdminRecord.email });
  } catch (error) {
    const message = error instanceof Error && error.message.trim().length > 0 ? error.message : "Unable to change the password.";
    return json(res, 500, { error: message });
  }
}
