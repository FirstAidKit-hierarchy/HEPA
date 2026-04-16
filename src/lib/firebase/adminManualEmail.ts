import { firebaseAuth } from "@/lib/firebase/client";
import { getContactFormEmailApiUrl, normalizeEmailAddressList } from "@/lib/contact-form";

export type AdminManualEmailInput = {
  fromName: string;
  fromEmail: string;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  message: string;
};

const normalizeString = (value: string) => value.trim();
const DEFAULT_SENDER_DOMAIN_SUFFIX = "@hepa.sa";

const normalizeSenderEmailInput = (value: string) => {
  const normalizedValue = normalizeString(value).toLowerCase();

  if (!normalizedValue || normalizedValue === DEFAULT_SENDER_DOMAIN_SUFFIX) {
    return "";
  }

  if (normalizedValue.endsWith(DEFAULT_SENDER_DOMAIN_SUFFIX)) {
    const localPart = normalizedValue.slice(0, -DEFAULT_SENDER_DOMAIN_SUFFIX.length);
    return localPart ? `${localPart}${DEFAULT_SENDER_DOMAIN_SUFFIX}` : "";
  }

  if (normalizedValue.includes("@")) {
    return normalizedValue;
  }

  return `${normalizedValue}${DEFAULT_SENDER_DOMAIN_SUFFIX}`;
};

export const sendAdminManualEmail = async (input: AdminManualEmailInput) => {
  if (!firebaseAuth?.currentUser) {
    throw new Error("Sign in first.");
  }

  const requestEmailApiUrl = getContactFormEmailApiUrl();

  if (!requestEmailApiUrl) {
    throw new Error("The email API is not configured.");
  }

  const idToken = await firebaseAuth.currentUser.getIdToken();
  const response = await fetch(`${requestEmailApiUrl}/send-admin-manual-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      fromName: normalizeString(input.fromName),
      fromEmail: normalizeSenderEmailInput(input.fromEmail),
      toEmails: normalizeEmailAddressList(input.to),
      ccEmails: normalizeEmailAddressList(input.cc),
      bccEmails: normalizeEmailAddressList(input.bcc),
      subject: normalizeString(input.subject),
      message: input.message.trim(),
    }),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJsonResponse = contentType.includes("application/json");
  const payload = (isJsonResponse ? await response.json().catch(() => ({})) : {}) as {
    ok?: boolean;
    error?: string;
    id?: string;
  };

  if (!isJsonResponse) {
    const responseText = await response.text().catch(() => "");
    const looksLikeHtml = /<!doctype html|<html/i.test(responseText);

    if (looksLikeHtml) {
      throw new Error("The manual email API is not available here. Configure the Cloudflare Worker email backend first.");
    }
  }

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Unable to send the email.");
  }

  return {
    id: payload.id?.trim() ?? "",
  };
};
