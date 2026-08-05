export type ExpertInvitation = {
  name: string;
  center: string;
  project: string;
  responseStatus: string;
};

export type ExpertInvitationResponseStatus = "Confirmed" | "Declined";

type ExpertInvitationApiPayload = {
  ok?: boolean;
  invitation?: ExpertInvitation;
  error?: string;
};

const normalizeString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const readEnvValue = (key: keyof HepaRuntimeEnv) => {
  const runtimeValue = typeof window !== "undefined" ? window.__HEPA_RUNTIME_CONFIG__?.[key] : undefined;
  const buildValue = import.meta.env[key];

  return normalizeString(runtimeValue || buildValue);
};

export const getExpertInvitationApiUrl = () => {
  const expertInvitationApiUrl = readEnvValue("VITE_EXPERT_INVITATION_API_URL").replace(/\/+$/, "");

  if (expertInvitationApiUrl) {
    return expertInvitationApiUrl;
  }

  const contactFormEmailApiUrl = readEnvValue("VITE_CONTACT_FORM_EMAIL_API_URL").replace(/\/+$/, "");

  if (contactFormEmailApiUrl) {
    return contactFormEmailApiUrl;
  }

  return readEnvValue("VITE_ADMIN_REQUEST_EMAIL_API_URL").replace(/\/+$/, "");
};

const postExpertInvitationApi = async (path: string, body: Record<string, unknown>) => {
  const apiUrl = getExpertInvitationApiUrl();

  if (!apiUrl) {
    throw new Error("The invitation API is not configured.");
  }

  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const contentType = response.headers.get("content-type") ?? "";
  const responseText = await response.text().catch(() => "");
  let payload: ExpertInvitationApiPayload = {};

  if (contentType.includes("application/json") && responseText) {
    try {
      payload = JSON.parse(responseText) as ExpertInvitationApiPayload;
    } catch {
      payload = {};
    }
  }

  if (!contentType.includes("application/json") && /<!doctype html|<html/i.test(responseText)) {
    throw new Error("The invitation API is not available here. Configure the Cloudflare Worker backend first.");
  }

  if (!response.ok || !payload.ok || !payload.invitation) {
    throw new Error(payload.error || "Unable to process the invitation request.");
  }

  return payload.invitation;
};

export const loadExpertInvitation = (projectSlug: string, invitationReference: string) =>
  postExpertInvitationApi("/expert-invitations/lookup", {
    projectSlug,
    invitationReference,
  });

export const submitExpertInvitationResponse = ({
  projectSlug,
  invitationReference,
  responseStatus,
  interviewFormat,
  preferredDateTime,
  comments,
  detectedTheme,
  timeZone,
}: {
  projectSlug: string;
  invitationReference: string;
  responseStatus: ExpertInvitationResponseStatus;
  interviewFormat: string;
  preferredDateTime: string;
  comments: string;
  detectedTheme: "light" | "dark";
  timeZone: string;
}) =>
  postExpertInvitationApi("/expert-invitations/respond", {
    projectSlug,
    invitationReference,
    responseStatus,
    interviewFormat,
    preferredDateTime,
    comments,
    detectedTheme,
    timeZone,
  });
