import { firebaseAuth } from "@/lib/firebase/client";
import { getContactFormEmailApiUrl } from "@/lib/contact-form";

export const setManagedAdminPassword = async (targetUid: string, newPassword: string) => {
  if (!firebaseAuth?.currentUser) {
    throw new Error("Sign in first.");
  }

  const workerApiUrl = getContactFormEmailApiUrl();
  const requestUrl = workerApiUrl ? `${workerApiUrl}/set-admin-password` : "/api/admin-passwords";
  const unavailableMessage = workerApiUrl
    ? "The password override API is not available here. Configure the Cloudflare Worker backend first."
    : "The password override API is not available here. On GitHub Pages, including hepa.sa, this feature needs a separate backend-capable deployment. For local development, use a deployed server route or `vercel dev`.";
  const idToken = await firebaseAuth.currentUser.getIdToken();
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      targetUid,
      newPassword,
    }),
  });
  const contentType = response.headers.get("content-type") ?? "";
  const isJsonResponse = contentType.includes("application/json");
  const payload = (isJsonResponse ? await response.json().catch(() => ({})) : {}) as {
    email?: string;
    error?: string;
    ok?: boolean;
  };

  if (!isJsonResponse) {
    const responseText = await response.text().catch(() => "");
    const looksLikeHtml = /<!doctype html|<html/i.test(responseText);

    if (looksLikeHtml) {
      throw new Error(unavailableMessage);
    }
  }

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Unable to change the password.");
  }

  return {
    email: payload.email?.trim() ?? "",
  };
};
