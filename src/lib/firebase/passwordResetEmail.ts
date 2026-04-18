import { getContactFormEmailApiUrl, isValidEmailAddress } from "@/lib/contact-form";
import { resolveAppHref } from "@/lib/site-pages";
import { ADMIN_PAGE_PATH } from "@/pages/admin/config";
import { PASSWORD_RESET_PATH } from "@/pages/password-reset/config";

const normalizeString = (value: string) => value.trim();

export const sendCustomPasswordResetEmail = async (email: string) => {
  const normalizedEmail = normalizeString(email).toLowerCase();

  if (!isValidEmailAddress(normalizedEmail)) {
    throw new Error("Enter a valid email address first.");
  }

  const requestEmailApiUrl = getContactFormEmailApiUrl();

  if (!requestEmailApiUrl) {
    throw new Error("The email API is not configured.");
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const resetHref = resolveAppHref(PASSWORD_RESET_PATH);
  const continueHref = resolveAppHref(ADMIN_PAGE_PATH);
  const resetPageUrl = origin && resetHref ? `${origin}${resetHref}` : PASSWORD_RESET_PATH;
  const continueUrl = origin && continueHref ? `${origin}${continueHref}` : ADMIN_PAGE_PATH;

  const response = await fetch(`${requestEmailApiUrl}/send-password-reset-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: normalizedEmail,
      resetPageUrl,
      continueUrl,
    }),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = (contentType.includes("application/json") ? await response.json().catch(() => ({})) : {}) as {
    ok?: boolean;
    error?: string;
  };

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Unable to send the password reset email.");
  }
};
