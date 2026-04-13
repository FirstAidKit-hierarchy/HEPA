import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const environment = process.argv[2] || "production";
const rootDir = process.cwd();
const envPath = path.join(rootDir, ".env.local");
const serviceAccountPath = path.join(rootDir, "firebase-service-account.local.json");
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const normalizeValue = (value) => value.trim();

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fail(`Missing ${path.basename(filePath)}.`);
  }

  const source = fs.readFileSync(filePath, "utf8");
  const result = new Map();

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);
    result.set(key, value);
  }

  return result;
};

const parseServiceAccountFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fail(
      "Missing firebase-service-account.local.json. Copy firebase-service-account.local.example.json and paste the Firebase service-account JSON into it.",
    );
  }

  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const projectId = normalizeValue(String(payload.project_id || ""));
  const clientEmail = normalizeValue(String(payload.client_email || ""));
  const privateKey = String(payload.private_key || "").trim();

  if (!projectId || !clientEmail || !privateKey) {
    fail("firebase-service-account.local.json is missing project_id, client_email, or private_key.");
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
};

const envMap = parseEnvFile(envPath);
const serviceAccount = parseServiceAccountFile(serviceAccountPath);

const requireEnv = (key) => {
  const value = envMap.get(key)?.trim() ?? "";

  if (!value) {
    fail(`Missing ${key} in .env.local.`);
  }

  return value;
};

const optionalEnv = (key) => envMap.get(key)?.trim() ?? "";

const upserts = [
  ["VITE_FIREBASE_API_KEY", requireEnv("VITE_FIREBASE_API_KEY")],
  ["VITE_FIREBASE_AUTH_DOMAIN", requireEnv("VITE_FIREBASE_AUTH_DOMAIN")],
  ["VITE_FIREBASE_PROJECT_ID", requireEnv("VITE_FIREBASE_PROJECT_ID")],
  ["VITE_FIREBASE_STORAGE_BUCKET", optionalEnv("VITE_FIREBASE_STORAGE_BUCKET")],
  ["VITE_FIREBASE_MESSAGING_SENDER_ID", optionalEnv("VITE_FIREBASE_MESSAGING_SENDER_ID")],
  ["VITE_FIREBASE_APP_ID", requireEnv("VITE_FIREBASE_APP_ID")],
  ["VITE_FIREBASE_MEASUREMENT_ID", optionalEnv("VITE_FIREBASE_MEASUREMENT_ID")],
  ["VITE_ADMIN_OWNER_EMAIL", requireEnv("VITE_ADMIN_OWNER_EMAIL")],
  ["FIREBASE_ADMIN_PROJECT_ID", serviceAccount.projectId],
  ["FIREBASE_ADMIN_CLIENT_EMAIL", serviceAccount.clientEmail],
  ["FIREBASE_ADMIN_PRIVATE_KEY", serviceAccount.privateKey],
  ["FIREBASE_API_KEY", requireEnv("VITE_FIREBASE_API_KEY")],
].filter(([, value]) => value.length > 0);

const runVercelEnvAdd = (name, value) => {
  const result = spawnSync(npxCommand, ["--yes", "vercel@latest", "env", "add", name, environment, "--yes", "--force", "--sensitive"], {
    cwd: rootDir,
    stdio: ["pipe", "inherit", "inherit"],
    env: process.env,
    input: value,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

for (const [name, value] of upserts) {
  runVercelEnvAdd(name, value);
}

console.log(`Firebase environment variables synced to Vercel (${environment}).`);
