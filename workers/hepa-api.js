const ALLOWED_ORIGINS = new Set([
  "https://hepa.sa",
  "https://www.hepa.sa",
  "http://localhost:8080",
  "http://localhost:5173",
    "http://localhost:8081",

]);
const HEPA_SITE_URL = "https://hepa.sa";
const HEPA_LOGO_EMAIL_URL = `${HEPA_SITE_URL}/HEPA%20Email.png`;
const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIREBASE_ADMIN_SCOPES = [
  "https://www.googleapis.com/auth/identitytoolkit",
  "https://www.googleapis.com/auth/datastore",
];
const RAW_EMAIL_TEMPLATE_TOKENS = new Set(["DETAILS_HTML", "BODY_HTML", "ACTION_HTML"]);
const EMAIL_TEMPLATE_TOKEN_PATTERN = /{{\s*([A-Z0-9_]+)\s*}}/g;
const EMAIL_TEMPLATE_SHARED_STYLES = `
      :root {
        color-scheme: light dark;
      }

      body,
      table,
      td,
      div,
      p,
      a,
      span {
        font-family: "Segoe UI", Arial, sans-serif !important;
      }

      @media (prefers-color-scheme: dark) {
        .email-bg {
          background: #07131f !important;
        }

        .email-shell {
          background: linear-gradient(180deg, #0f1d2d 0%, #091421 100%) !important;
          border-color: #21415a !important;
        }

        .email-header {
          border-bottom-color: #21415a !important;
        }

        .email-field-row {
          border-bottom-color: #1f364c !important;
        }

        .email-divider {
          border-top-color: #21415a !important;
        }

        .email-title,
        .email-text,
        .email-copy strong {
          color: #f4f8fb !important;
        }

        .email-muted,
        .email-footer {
          color: #bfd0df !important;
        }

        .email-label,
        .email-eyebrow {
          color: #8ed8ff !important;
        }

        .email-link {
          color: #8ed8ff !important;
        }

        .email-button-wrap {
          background: linear-gradient(135deg, #9be36f 0%, #6fddb8 100%) !important;
        }

        .email-button {
          color: #041018 !important;
        }
      }
    `;

function buildDefaultEmailTemplateHtml() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>{{TITLE}}</title>
    <style>${EMAIL_TEMPLATE_SHARED_STYLES}</style>
  </head>
  <body style="margin:0;padding:0;background:#edf3f8;" class="email-bg">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">{{PREHEADER}}</div>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#edf3f8;" class="email-bg">
      <tr>
        <td style="padding:32px 16px;">
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="100%"
            style="max-width:640px;margin:0 auto;border-radius:28px;border:1px solid #d6e2ec;background:linear-gradient(180deg,#fbfdff,#f2f7fb);overflow:hidden;"
            class="email-shell"
          >
            <tr>
              <td style="padding:26px 28px 18px;border-bottom:1px solid #dde7ef;" class="email-header">
                <div style="margin:0 0 18px;">
                  <a href="{{SITE_URL}}" style="display:inline-block;text-decoration:none;">
                    <img
                      src="{{LOGO_URL}}"
                      alt="HEPA"
                      width="230"
                      style="display:block;width:230px;max-width:100%;height:auto;border:0;"
                    />
                  </a>
                </div>
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#79d3ff;" class="email-eyebrow">
                  {{EYEBROW}}
                </p>
                <h1 style="margin:0;font-size:30px;line-height:1.16;font-weight:700;color:#122033;" class="email-title">{{TITLE}}</h1>
                <p style="margin:12px 0 0;font-size:15px;line-height:1.75;color:#5f7289;" class="email-muted">{{INTRO}}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 12px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  {{DETAILS_HTML}}
                </table>
                {{BODY_HTML}}
                {{ACTION_HTML}}
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <div style="border-top:1px solid #d8e2ec;padding-top:18px;font-size:12px;line-height:1.8;color:#6c7b90;" class="email-divider email-footer">
                  {{FOOTER_NOTE}}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const defaultEmailTemplates = {
  passwordReset: buildDefaultEmailTemplateHtml(),
  adminRequest: buildDefaultEmailTemplateHtml(),
  contactForm: buildDefaultEmailTemplateHtml(),
  manual: buildDefaultEmailTemplateHtml(),
  blank: buildDefaultEmailTemplateHtml(),
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

function isEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function normalizeString(value = "") {
  return String(value).trim();
}

function isSameOriginUrl(value, origin) {
  try {
    const parsedUrl = new URL(normalizeString(value));
    return parsedUrl.origin === origin;
  } catch {
    return false;
  }
}

function base64UrlEncodeBytes(value) {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlEncodeString(value) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function pemPrivateKeyToArrayBuffer(value) {
  const normalizedValue = normalizeString(value).replace(/\\n/g, "\n");
  const base64Payload = normalizedValue
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(base64Payload);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

function extractEmailAddress(value = "") {
  const normalizedValue = normalizeString(value);
  const match = normalizedValue.match(/<([^>]+)>/);
  return normalizeString(match ? match[1] : normalizedValue).toLowerCase();
}

function normalizeEmailList(value = []) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((item) => normalizeString(item).toLowerCase())
        .filter((item) => item && isEmail(item)),
    ),
  );
}

function getBearerToken(headerValue = "") {
  const normalizedHeader = normalizeString(headerValue);
  const [scheme, token] = normalizedHeader.split(" ");
  return scheme && scheme.toLowerCase() === "bearer" ? normalizeString(token) : "";
}

async function lookupFirebaseUserByIdToken(idToken, apiKey) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));
  const user = Array.isArray(payload.users) ? payload.users[0] : null;
  const email = normalizeString(user?.email).toLowerCase();

  if (!email || !isEmail(email)) {
    return null;
  }

  return {
    uid: normalizeString(user?.localId),
    email,
    displayName: normalizeString(user?.displayName),
  };
}

async function createServiceAccountJwt(clientEmail, privateKey) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 3600;
  const unsignedToken = [
    base64UrlEncodeString(JSON.stringify({ alg: "RS256", typ: "JWT" })),
    base64UrlEncodeString(
      JSON.stringify({
        iss: clientEmail,
        scope: FIREBASE_ADMIN_SCOPES.join(" "),
        aud: GOOGLE_OAUTH_TOKEN_URL,
        iat: issuedAt,
        exp: expiresAt,
      }),
    ),
  ].join(".");
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pemPrivateKeyToArrayBuffer(privateKey),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(unsignedToken));

  return `${unsignedToken}.${base64UrlEncodeBytes(signature)}`;
}

async function getGoogleAccessToken(env) {
  const clientEmail = normalizeString(env.FIREBASE_ADMIN_CLIENT_EMAIL);
  const privateKey = normalizeString(env.FIREBASE_ADMIN_PRIVATE_KEY);

  if (!clientEmail || !privateKey) {
    throw new Error("Firebase admin credentials are not configured on the Worker.");
  }

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: await createServiceAccountJwt(clientEmail, privateKey),
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to obtain a Google access token.");
  }

  const payload = await response.json().catch(() => ({}));
  const accessToken = normalizeString(payload?.access_token);

  if (!accessToken) {
    throw new Error("Google access token response was empty.");
  }

  return accessToken;
}

async function loadApprovedAdminByEmail(accessToken, projectId, email) {
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "adminUsers" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "email" },
              op: "EQUAL",
              value: { stringValue: email },
            },
          },
          limit: 1,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Unable to load the admin user record.");
  }

  const payload = await response.json().catch(() => []);
  const results = Array.isArray(payload) ? payload : [];
  const matchedDocument = results.find((item) => item?.document?.fields?.email?.stringValue)?.document;
  const matchedEmail = normalizeString(matchedDocument?.fields?.email?.stringValue).toLowerCase();

  if (!matchedDocument || matchedEmail !== email) {
    return null;
  }

  return {
    email: matchedEmail,
    role: normalizeString(matchedDocument?.fields?.role?.stringValue) || "admin",
  };
}

async function loadAdminUserDocumentByUid(accessToken, projectId, uid) {
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/adminUsers/${uid}`,
    {
      method: "GET",
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

  const payload = await response.json().catch(() => ({}));
  const email = normalizeString(payload?.fields?.email?.stringValue).toLowerCase();

  return {
    email,
    role: normalizeString(payload?.fields?.role?.stringValue) || "admin",
  };
}

function parseFirestoreValue(value) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  if ("stringValue" in value) {
    return String(value.stringValue ?? "");
  }

  if ("integerValue" in value) {
    return Number(value.integerValue);
  }

  if ("doubleValue" in value) {
    return Number(value.doubleValue);
  }

  if ("booleanValue" in value) {
    return Boolean(value.booleanValue);
  }

  if ("nullValue" in value) {
    return null;
  }

  if ("arrayValue" in value) {
    return Array.isArray(value.arrayValue?.values) ? value.arrayValue.values.map((item) => parseFirestoreValue(item)) : [];
  }

  if ("mapValue" in value) {
    const fields = value.mapValue?.fields ?? {};
    return Object.fromEntries(Object.entries(fields).map(([key, item]) => [key, parseFirestoreValue(item)]));
  }

  return undefined;
}

async function loadEditableEmailTemplates(env, existingAccessToken = "") {
  const projectId = normalizeString(env.FIREBASE_ADMIN_PROJECT_ID);

  if (!projectId || !env.FIREBASE_ADMIN_CLIENT_EMAIL || !env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return defaultEmailTemplates;
  }

  try {
    const accessToken = existingAccessToken || (await getGoogleAccessToken(env));
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/siteContent/site-pages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      return defaultEmailTemplates;
    }

    const payload = await response.json().catch(() => ({}));
    const emailTemplatesValue = parseFirestoreValue(payload?.fields?.emailTemplates);
    const source = emailTemplatesValue && typeof emailTemplatesValue === "object" ? emailTemplatesValue : {};

    return {
      passwordReset:
        typeof source.passwordReset === "string" && source.passwordReset.trim().length > 0
          ? source.passwordReset
          : defaultEmailTemplates.passwordReset,
      adminRequest:
        typeof source.adminRequest === "string" && source.adminRequest.trim().length > 0
          ? source.adminRequest
          : defaultEmailTemplates.adminRequest,
      contactForm:
        typeof source.contactForm === "string" && source.contactForm.trim().length > 0
          ? source.contactForm
          : defaultEmailTemplates.contactForm,
      manual:
        typeof source.manual === "string" && source.manual.trim().length > 0 ? source.manual : defaultEmailTemplates.manual,
      blank:
        typeof source.blank === "string" && source.blank.trim().length > 0 ? source.blank : defaultEmailTemplates.blank,
    };
  } catch {
    return defaultEmailTemplates;
  }
}

async function generatePasswordResetOobLink(accessToken, projectId, email) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:sendOobCode`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requestType: "PASSWORD_RESET",
      email,
      returnOobLink: true,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = normalizeString(payload?.error?.message || payload?.message);
    throw new Error(message || "Unable to generate the password reset link.");
  }

  const oobLink = normalizeString(payload?.oobLink);

  if (!oobLink) {
    throw new Error("The password reset link response was empty.");
  }

  return oobLink;
}

async function updateFirebaseUserPassword(accessToken, projectId, uid, password) {
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
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = normalizeString(payload?.error?.message || payload?.message);
    throw new Error(message ? `Unable to update the password (${message}).` : "Unable to update the password.");
  }
}

function buildCustomPasswordResetUrl(resetPageUrl, oobLink, continueUrl = "") {
  const parsedOobLink = new URL(oobLink);
  const oobCode = normalizeString(parsedOobLink.searchParams.get("oobCode"));

  if (!oobCode) {
    throw new Error("The password reset code was missing from the Firebase response.");
  }

  const targetUrl = new URL(resetPageUrl);
  targetUrl.searchParams.set("mode", "resetPassword");
  targetUrl.searchParams.set("oobCode", oobCode);

  if (continueUrl) {
    targetUrl.searchParams.set("continueUrl", continueUrl);
  }

  return targetUrl.toString();
}

function isRecoverablePasswordResetError(error) {
  const message = error instanceof Error ? error.message.toUpperCase() : "";
  return message.includes("EMAIL_NOT_FOUND") || message.includes("USER_NOT_FOUND");
}

function buildManualEmailText({ senderEmail, senderName, message }) {
  return [
    senderName ? `Sent by: ${senderName}` : "",
    senderEmail ? `Sender address: ${senderEmail}` : "",
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmailParagraphs(value = "") {
  return escapeHtml(value)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, "<br />"))
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#122033;" class="email-text">${paragraph}</p>`,
    )
    .join("");
}

function renderEmailField(label, value) {
  if (!value) {
    return "";
  }

  return `
    <tr>
      <td style="padding:0 0 12px;border-bottom:1px solid #e3ebf2;" class="email-field-row">
        <div style="padding:0 0 12px;">
          <div style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#5d7898;" class="email-label">${escapeHtml(label)}</div>
          <div style="margin:0;font-size:15px;line-height:1.7;color:#122033;word-break:break-word;" class="email-text">${escapeHtml(value)}</div>
        </div>
      </td>
    </tr>
  `;
}

function renderEmailAction(label, href) {
  if (!label || !href) {
    return "";
  }

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:22px 0 0;">
      <tr>
        <td style="border-radius:999px;background:linear-gradient(135deg,#7ed957,#55c7a1);text-align:center;" class="email-button-wrap">
          <a
            href="${escapeHtml(href)}"
            style="display:inline-block;padding:14px 24px;font-size:14px;font-weight:700;line-height:1;color:#091220;text-decoration:none;"
            class="email-button"
          >
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

function renderEmailTemplateHtml(templateHtml, values) {
  return templateHtml.replace(EMAIL_TEMPLATE_TOKEN_PATTERN, (_, token) => {
    const value = values[token] || "";
    return RAW_EMAIL_TEMPLATE_TOKENS.has(token) ? value : escapeHtml(value);
  });
}

function createBodyBlock(contentHtml = "") {
  return contentHtml ? `<div style="padding:18px 0 0;">${contentHtml}</div>` : "";
}

function buildHepaEmailHtml({
  templateHtml = defaultEmailTemplates.manual,
  preheader,
  eyebrow,
  title,
  intro,
  detailsHtml = "",
  bodyHtml = "",
  actionHtml = "",
  footerNote = "",
}) {
  return renderEmailTemplateHtml(templateHtml, {
    SITE_URL: HEPA_SITE_URL,
    LOGO_URL: HEPA_LOGO_EMAIL_URL,
    PREHEADER: preheader,
    EYEBROW: eyebrow,
    TITLE: title,
    INTRO: intro,
    DETAILS_HTML: detailsHtml,
    BODY_HTML: createBodyBlock(bodyHtml),
    ACTION_HTML: actionHtml,
    FOOTER_NOTE: footerNote || "Sent from HEPA. Reply to this email if you need to continue the conversation.",
  });
}

function buildManualEmailHtml({ templateHtml, senderEmail, senderName, subject, message }) {
  const detailsHtml = [
    renderEmailField("From", senderName || senderEmail),
    senderName && senderEmail ? renderEmailField("Sender address", senderEmail) : "",
  ]
    .filter(Boolean)
    .join("");

  const bodyHtml = `${renderEmailParagraphs(message)}`;

  return buildHepaEmailHtml({
    templateHtml,
    preheader: subject,
    eyebrow: "HEPA message",
    title: subject,
    intro: "A direct message from the HEPA team.",
    detailsHtml,
    bodyHtml,
    footerNote: "Sent from HEPA. You can reply directly to this email to continue the conversation.",
  });
}

function buildPasswordResetEmailText({ appName, email, resetUrl }) {
  return [
    `Reset your ${appName} password.`,
    `Account email: ${email}`,
    "",
    "We received a request to reset the password for this HEPA account.",
    "Open the secure reset link below to choose a new password:",
    resetUrl,
    "",
    "If you did not request this password reset, you can ignore this email.",
  ].join("\n");
}

function buildPasswordResetEmailHtml({ templateHtml, appName, email, resetUrl }) {
  const detailsHtml = [renderEmailField("Application", appName), renderEmailField("Account email", email)].join("");
  const bodyHtml = [
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#122033;" class="email-text">Hello,</p>`,
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#122033;" class="email-text">We received a request to reset the password for your <strong>${escapeHtml(appName)}</strong> account linked to <strong>${escapeHtml(email)}</strong>.</p>`,
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#122033;" class="email-text">Use the button below to choose a new password and sign back in securely.</p>`,
    `<p style="margin:22px 0 10px;font-size:14px;line-height:1.8;color:#5f7289;" class="email-muted">If the button does not open, copy and paste this link into your browser:</p>`,
    `<p style="margin:0 0 18px;word-break:break-word;"><a href="${escapeHtml(resetUrl)}" style="color:#2b8abf;font-size:14px;line-height:1.7;text-decoration:underline;">${escapeHtml(resetUrl)}</a></p>`,
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#122033;" class="email-text">If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged.</p>`,
  ].join("");

  return buildHepaEmailHtml({
    templateHtml,
    preheader: "Reset your password and return to your HEPA workspace.",
    eyebrow: "Account security",
    title: "Reset your password",
    intro: "Use the secure link below to restore access to your HEPA workspace.",
    detailsHtml,
    bodyHtml,
    actionHtml: renderEmailAction("Reset password", resetUrl),
    footerNote: "This security email was sent by HEPA for your account. If you did not request this action, no further action is required.",
  });
}

function buildContactFormTextLines({
  firstName,
  lastName,
  company,
  email,
  phone,
  service,
  message,
  ccEmails,
  pageUrl,
  submittedAt,
}) {
  return [
    "A new HEPA contact form request was submitted.",
    `Name: ${firstName} ${lastName}`.trim(),
    company ? `Company: ${company}` : "",
    `Email: ${email}`,
    ccEmails?.length ? `CC: ${ccEmails.join(", ")}` : "",
    phone ? `Phone: ${phone}` : "",
    service ? `Project Need: ${service}` : "",
    message ? `Message: ${message}` : "",
    pageUrl ? `Page URL: ${pageUrl}` : "",
    `Submitted at: ${submittedAt}`,
  ].filter(Boolean);
}

function buildContactFormHtmlLines({
  templateHtml,
  firstName,
  lastName,
  company,
  email,
  phone,
  service,
  message,
  ccEmails,
  pageUrl,
  submittedAt,
}) {
  const detailsHtml = [
    renderEmailField("Contact", `${firstName} ${lastName}`.trim()),
    company ? renderEmailField("Company", company) : "",
    renderEmailField("Email", email),
    ccEmails?.length ? renderEmailField("CC", ccEmails.join(", ")) : "",
    phone ? renderEmailField("Phone", phone) : "",
    service ? renderEmailField("Project need", service) : "",
    renderEmailField("Submitted at", submittedAt),
  ]
    .filter(Boolean)
    .join("");

  const bodyHtml = message
    ? `
      <div style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#5d7898;" class="email-label">Message</div>
      ${renderEmailParagraphs(message)}
    `
    : "";

  const actionHtml = pageUrl ? renderEmailAction("Open source page", pageUrl) : "";

  return buildHepaEmailHtml({
    templateHtml,
    preheader: `${firstName} ${lastName} submitted a new contact request.`,
    eyebrow: "New inbound lead",
    title: `${firstName} ${lastName}`,
    intro: service ? `New HEPA contact form submission for ${service}.` : "New HEPA contact form submission.",
    detailsHtml,
    bodyHtml,
    actionHtml,
  });
}

function buildAdminRequestEmailHtml({ templateHtml, requesterEmail, displayName, reviewUrl }) {
  const detailsHtml = [renderEmailField("Requester email", requesterEmail), displayName ? renderEmailField("Display name", displayName) : ""]
    .filter(Boolean)
    .join("");

  return buildHepaEmailHtml({
    templateHtml,
    preheader: `${requesterEmail} requested HEPA admin access.`,
    eyebrow: "Admin access request",
    title: "New admin request",
    intro: `${requesterEmail} requested access to the HEPA admin editor.`,
    detailsHtml,
    actionHtml: renderEmailAction("Open admin review", reviewUrl),
    footerNote: "Review the request in the HEPA admin workspace and approve or decline access.",
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/debug-config") {
      return new Response(
        JSON.stringify({
          hasResendApiKey: Boolean(env.RESEND_API_KEY),
          hasResendFromEmail: Boolean(env.RESEND_FROM_EMAIL),
          hasOwnerEmail: Boolean(env.OWNER_EMAIL),
          hasFirebaseApiKey: Boolean(env.FIREBASE_API_KEY),
          hasFirebaseAdminProjectId: Boolean(env.FIREBASE_ADMIN_PROJECT_ID),
          hasFirebaseAdminClientEmail: Boolean(env.FIREBASE_ADMIN_CLIENT_EMAIL),
          hasFirebaseAdminPrivateKey: Boolean(env.FIREBASE_ADMIN_PRIVATE_KEY),
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "";

    if (request.method === "OPTIONS") {
      if (!allowedOrigin) {
        return new Response(null, { status: 403 });
      }

      return new Response(null, {
        status: 204,
        headers: corsHeaders(allowedOrigin),
      });
    }

    if (request.method === "GET" && url.pathname === "/") {
      return new Response("hepa-api is running");
    }

    if (!allowedOrigin) {
      return json({ error: "Origin not allowed" }, 403);
    }

    if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
      return json({ error: "Server is not configured yet." }, 500, corsHeaders(allowedOrigin));
    }

    let payload;

    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400, corsHeaders(allowedOrigin));
    }

    if (request.method === "POST" && url.pathname === "/set-admin-password") {
      const projectId = normalizeString(env.FIREBASE_ADMIN_PROJECT_ID);

      if (!projectId || !env.FIREBASE_API_KEY || !env.FIREBASE_ADMIN_CLIENT_EMAIL || !env.FIREBASE_ADMIN_PRIVATE_KEY) {
        return json({ error: "Password overrides are not configured on the server." }, 500, corsHeaders(allowedOrigin));
      }

      const idToken = getBearerToken(request.headers.get("Authorization") || "");
      const targetUid = normalizeString(payload.targetUid);
      const newPassword = typeof payload.newPassword === "string" ? payload.newPassword : "";

      if (!idToken) {
        return json({ error: "Missing admin session." }, 401, corsHeaders(allowedOrigin));
      }

      if (!targetUid) {
        return json({ error: "Missing target user." }, 400, corsHeaders(allowedOrigin));
      }

      if (newPassword.trim().length < 8) {
        return json({ error: "Use at least 8 characters for the new password." }, 400, corsHeaders(allowedOrigin));
      }

      try {
        const requester = await lookupFirebaseUserByIdToken(idToken, env.FIREBASE_API_KEY);

        if (!requester?.uid || !requester.email) {
          return json({ error: "Unable to verify the current admin session." }, 401, corsHeaders(allowedOrigin));
        }

        const accessToken = await getGoogleAccessToken(env);
        const requesterAdminRecord = await loadAdminUserDocumentByUid(accessToken, projectId, requester.uid);
        const configuredOwnerEmail = normalizeString(env.OWNER_EMAIL).toLowerCase();
        const isRequesterOwner =
          (configuredOwnerEmail && requester.email === configuredOwnerEmail) || requesterAdminRecord?.role === "owner";

        if (!isRequesterOwner) {
          return json({ error: "Only owners can change another user's password." }, 403, corsHeaders(allowedOrigin));
        }

        const targetAdminRecord = await loadAdminUserDocumentByUid(accessToken, projectId, targetUid);

        if (!targetAdminRecord?.email) {
          return json({ error: "The target admin account could not be found." }, 404, corsHeaders(allowedOrigin));
        }

        await updateFirebaseUserPassword(accessToken, projectId, targetUid, newPassword);

        return json(
          {
            ok: true,
            email: targetAdminRecord.email,
          },
          200,
          corsHeaders(allowedOrigin),
        );
      } catch (error) {
        const message = error instanceof Error && error.message.trim().length > 0 ? error.message : "Unable to change the password.";
        return json({ error: message }, 500, corsHeaders(allowedOrigin));
      }
    }

    if (request.method === "POST" && url.pathname === "/send-password-reset-email") {
      if (
        !env.FIREBASE_ADMIN_PROJECT_ID ||
        !env.FIREBASE_ADMIN_CLIENT_EMAIL ||
        !env.FIREBASE_ADMIN_PRIVATE_KEY
      ) {
        return json({ error: "Password reset email is not configured on the server." }, 500, corsHeaders(allowedOrigin));
      }

      const email = normalizeString(payload.email).toLowerCase();
      const resetPageUrl = normalizeString(payload.resetPageUrl);
      const continueUrl = normalizeString(payload.continueUrl);
      const ownerEmail = normalizeString(env.OWNER_EMAIL).toLowerCase();

      if (!isEmail(email)) {
        return json({ error: "Invalid email address." }, 400, corsHeaders(allowedOrigin));
      }

      if (!resetPageUrl || !isSameOriginUrl(resetPageUrl, allowedOrigin)) {
        return json({ error: "Invalid reset page URL." }, 400, corsHeaders(allowedOrigin));
      }

      if (continueUrl && !isSameOriginUrl(continueUrl, allowedOrigin)) {
        return json({ error: "Invalid continue URL." }, 400, corsHeaders(allowedOrigin));
      }

      try {
        const accessToken = await getGoogleAccessToken(env);
        const approvedAdmin =
          email === ownerEmail
            ? { email, role: "owner" }
            : await loadApprovedAdminByEmail(accessToken, env.FIREBASE_ADMIN_PROJECT_ID, email);

        if (!approvedAdmin) {
          return json({ ok: true }, 200, corsHeaders(allowedOrigin));
        }

        let oobLink = "";

        try {
          oobLink = await generatePasswordResetOobLink(accessToken, env.FIREBASE_ADMIN_PROJECT_ID, email);
        } catch (error) {
          if (isRecoverablePasswordResetError(error)) {
            return json({ ok: true }, 200, corsHeaders(allowedOrigin));
          }

          throw error;
        }

        const resetUrl = buildCustomPasswordResetUrl(resetPageUrl, oobLink, continueUrl);
        const emailTemplates = await loadEditableEmailTemplates(env, accessToken);
        const subject = "Reset your HEPA password";
        const text = buildPasswordResetEmailText({
          appName: "HEPA",
          email,
          resetUrl,
        });
        const html = buildPasswordResetEmailHtml({
          templateHtml: emailTemplates.passwordReset,
          appName: "HEPA",
          email,
          resetUrl,
        });
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: env.RESEND_FROM_EMAIL,
            to: email,
            subject,
            text,
            html,
          }),
        });
        const resendPayload = await resendResponse.json().catch(() => ({}));

        if (!resendResponse.ok) {
          return json(
            {
              error: "Resend password reset request failed.",
              details: resendPayload,
            },
            502,
            corsHeaders(allowedOrigin),
          );
        }

        return json(
          {
            ok: true,
            id: resendPayload.id || "",
          },
          200,
          corsHeaders(allowedOrigin),
        );
      } catch (error) {
        const message = error instanceof Error && error.message.trim().length > 0 ? error.message : "Unable to send the password reset email.";
        return json({ error: message }, 500, corsHeaders(allowedOrigin));
      }
    }

    if (request.method === "POST" && url.pathname === "/send-admin-request-email") {
      if (!env.OWNER_EMAIL) {
        return json({ error: "Server is not configured yet." }, 500, corsHeaders(allowedOrigin));
      }

      const requesterEmail = normalizeString(payload.requesterEmail).toLowerCase();
      const displayName = normalizeString(payload.displayName);
      const reviewUrl = normalizeString(payload.reviewUrl || "https://hepa.sa/admin");
      const emailTemplates = await loadEditableEmailTemplates(env);

      if (!isEmail(requesterEmail)) {
        return json({ error: "Invalid requesterEmail." }, 400, corsHeaders(allowedOrigin));
      }

      const subject = `HEPA admin access request: ${requesterEmail}`;
      const text = [
        `${requesterEmail} requested access to the HEPA admin editor.`,
        displayName ? `Display name: ${displayName}` : "",
        `Review the request here: ${reviewUrl}`,
      ]
        .filter(Boolean)
        .join("\n");

      const html = buildAdminRequestEmailHtml({
        templateHtml: emailTemplates.adminRequest,
        requesterEmail,
        displayName,
        reviewUrl,
      });

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL,
          to: env.OWNER_EMAIL,
          reply_to: requesterEmail,
          subject,
          text,
          html,
        }),
      });
      const resendPayload = await resendResponse.json().catch(() => ({}));

      if (!resendResponse.ok) {
        return json(
          {
            error: "Resend request failed.",
            details: resendPayload,
          },
          502,
          corsHeaders(allowedOrigin),
        );
      }

      return json(
        {
          ok: true,
          id: resendPayload.id || "",
        },
        200,
        corsHeaders(allowedOrigin),
      );
    }

    if (request.method === "POST" && url.pathname === "/send-contact-form-email") {
      const firstName = normalizeString(payload.firstName);
      const lastName = normalizeString(payload.lastName);
      const company = normalizeString(payload.company);
      const email = normalizeString(payload.email).toLowerCase();
      const phone = normalizeString(payload.phone);
      const service = normalizeString(payload.service);
      const message = normalizeString(payload.message);
      const recipientEmail = normalizeString(payload.recipientEmail).toLowerCase();
      const ccEmails = normalizeEmailList(payload.ccEmails).filter((ccEmail) => ccEmail !== recipientEmail);
      const pageUrl = normalizeString(payload.pageUrl || "https://hepa.sa/#contact");
      const emailTemplates = await loadEditableEmailTemplates(env);

      if (!firstName || !lastName || !isEmail(email) || !isEmail(recipientEmail)) {
        return json({ error: "Missing or invalid required contact form fields." }, 400, corsHeaders(allowedOrigin));
      }

      const submittedAt = new Date().toISOString();
      const serviceLabel = service || "General";
      const subject = `HEPA contact form: ${serviceLabel} - ${firstName} ${lastName}`;
      const text = buildContactFormTextLines({
        firstName,
        lastName,
        company,
        email,
        phone,
        service,
        message,
        ccEmails,
        pageUrl,
        submittedAt,
      }).join("\n");
      const html = buildContactFormHtmlLines({
        templateHtml: emailTemplates.contactForm,
        firstName,
        lastName,
        company,
        email,
        phone,
        service,
        message,
        ccEmails,
        pageUrl,
        submittedAt,
      });

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL,
          to: recipientEmail,
          ...(ccEmails.length ? { cc: ccEmails } : {}),
          reply_to: email,
          subject,
          text,
          html,
        }),
      });
      const resendPayload = await resendResponse.json().catch(() => ({}));

      if (!resendResponse.ok) {
        return json(
          {
            error: "Resend contact form request failed.",
            details: resendPayload,
          },
          502,
          corsHeaders(allowedOrigin),
        );
      }

      return json(
        {
          ok: true,
          id: resendPayload.id || "",
        },
        200,
        corsHeaders(allowedOrigin),
      );
    }

    if (request.method === "POST" && url.pathname === "/send-admin-manual-email") {
      if (!env.FIREBASE_API_KEY || !env.OWNER_EMAIL) {
        return json({ error: "Server is not configured yet." }, 500, corsHeaders(allowedOrigin));
      }

      const idToken = getBearerToken(request.headers.get("Authorization") || "");

      if (!idToken) {
        return json({ error: "Missing admin session." }, 401, corsHeaders(allowedOrigin));
      }

      const requester = await lookupFirebaseUserByIdToken(idToken, env.FIREBASE_API_KEY);

      if (!requester) {
        return json({ error: "Unable to verify the current admin session." }, 401, corsHeaders(allowedOrigin));
      }

      const ownerEmail = normalizeString(env.OWNER_EMAIL).toLowerCase();

      if (requester.email !== ownerEmail) {
        return json({ error: "Only the owner account can send manual emails." }, 403, corsHeaders(allowedOrigin));
      }

      const defaultSenderEmail = extractEmailAddress(env.RESEND_FROM_EMAIL);
      const defaultSenderDomain = defaultSenderEmail.split("@")[1] || "";
      const fromName = normalizeString(payload.fromName);
      const fromEmail = normalizeString(payload.fromEmail || defaultSenderEmail).toLowerCase();
      const toEmails = normalizeEmailList(payload.toEmails);
      const ccEmails = normalizeEmailList(payload.ccEmails).filter((email) => !toEmails.includes(email));
      const bccEmails = normalizeEmailList(payload.bccEmails).filter(
        (email) => !toEmails.includes(email) && !ccEmails.includes(email),
      );
      const subject = normalizeString(payload.subject);
      const message = normalizeString(payload.message);
      const emailTemplates = await loadEditableEmailTemplates(env);

      if (!defaultSenderDomain || !fromEmail || !subject || !message || !toEmails.length) {
        return json({ error: "Missing required manual email fields." }, 400, corsHeaders(allowedOrigin));
      }

      if (!isEmail(fromEmail) || fromEmail.split("@")[1] !== defaultSenderDomain) {
        return json(
          { error: `Sender email must use the verified ${defaultSenderDomain} domain.` },
          400,
          corsHeaders(allowedOrigin),
        );
      }

      const senderValue = fromName ? `${fromName} <${fromEmail}>` : fromEmail;
      const text = buildManualEmailText({
        senderEmail: fromEmail,
        senderName: fromName,
        message,
      });
      const html = buildManualEmailHtml({
        templateHtml: emailTemplates.manual,
        senderEmail: fromEmail,
        senderName: fromName,
        subject,
        message,
      });

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: senderValue,
          to: toEmails,
          ...(ccEmails.length ? { cc: ccEmails } : {}),
          ...(bccEmails.length ? { bcc: bccEmails } : {}),
          reply_to: fromEmail,
          subject,
          text,
          html,
        }),
      });
      const resendPayload = await resendResponse.json().catch(() => ({}));

      if (!resendResponse.ok) {
        return json(
          {
            error: "Resend manual email request failed.",
            details: resendPayload,
          },
          502,
          corsHeaders(allowedOrigin),
        );
      }

      return json(
        {
          ok: true,
          id: resendPayload.id || "",
        },
        200,
        corsHeaders(allowedOrigin),
      );
    }

    return json({ error: "Not found" }, 404, corsHeaders(allowedOrigin));
  },
};
