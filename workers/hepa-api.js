const ALLOWED_ORIGINS = new Set([
  "https://hepa.sa",
  "https://www.hepa.sa",
  "http://localhost:8080",
  "http://localhost:5173",
]);
const HEPA_SITE_URL = "https://hepa.sa";
const HEPA_LOGO_LIGHT_URL = `${HEPA_SITE_URL}/icons/hepa-logo.svg`;
const HEPA_LOGO_DARK_URL = `${HEPA_SITE_URL}/icons/hepa-logo-dark.svg`;

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
      <td style="padding:0 0 12px;">
        <div
          style="border:1px solid #dde7ef;border-radius:20px;background:#ffffff;padding:16px 18px;"
          class="email-card"
        >
          <div style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#5d7898;" class="email-label">${escapeHtml(label)}</div>
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

function buildHepaEmailHtml({ preheader, eyebrow, title, intro, detailsHtml = "", bodyHtml = "", actionHtml = "", footerNote = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${escapeHtml(title)}</title>
    <style>
      .email-logo-dark {
        display: none;
      }

      @media (prefers-color-scheme: dark) {
        body, .email-bg {
          background: #08111d !important;
        }

        .email-shell {
          background: linear-gradient(180deg, rgba(8,15,28,0.76), rgba(8,15,28,0.92)) !important;
          border-color: #22384c !important;
          box-shadow: 0 28px 70px rgba(8,15,28,0.26) !important;
        }

        .email-header {
          border-bottom-color: #22384c !important;
        }

        .email-muted {
          color: #a7bbd1 !important;
        }

        .email-title,
        .email-text {
          color: #f7fbff !important;
        }

        .email-card {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.12) !important;
        }

        .email-label {
          color: #8fdcff !important;
        }

        .email-divider {
          border-top-color: #23364d !important;
        }

        .email-footer {
          color: #90a2b8 !important;
        }

        .email-button-wrap {
          background: linear-gradient(135deg, #7ed957, #55c7a1) !important;
        }

        .email-button {
          color: #08111d !important;
        }

        .email-logo-light {
          display: none !important;
        }

        .email-logo-dark {
          display: inline-block !important;
        }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#edf3f8;" class="email-bg">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}</div>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#edf3f8;" class="email-bg">
      <tr>
        <td style="padding:32px 16px;">
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="100%"
            style="max-width:640px;margin:0 auto;border-radius:28px;border:1px solid #d6e2ec;background:linear-gradient(180deg,#fbfdff,#f2f7fb);overflow:hidden;box-shadow:0 20px 48px rgba(148,163,184,0.14);"
            class="email-shell"
          >
            <tr>
              <td
                style="padding:26px 28px 18px;border-bottom:1px solid #dde7ef;"
                class="email-header"
              >
                <div style="margin:0 0 18px;">
                  <a href="${HEPA_SITE_URL}" style="display:inline-block;text-decoration:none;">
                    <img
                      src="${HEPA_LOGO_LIGHT_URL}"
                      alt="HEPA"
                      width="122"
                      style="display:block;width:122px;height:auto;border:0;"
                      class="email-logo-light"
                    />
                    <img
                      src="${HEPA_LOGO_DARK_URL}"
                      alt="HEPA"
                      width="122"
                      style="display:none;width:122px;height:auto;border:0;"
                      class="email-logo-dark"
                    />
                  </a>
                </div>
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#79d3ff;">
                  ${escapeHtml(eyebrow)}
                </p>
                <h1 style="margin:0;font-size:30px;line-height:1.16;font-weight:700;color:#122033;" class="email-title">${escapeHtml(title)}</h1>
                <p style="margin:12px 0 0;font-size:15px;line-height:1.75;color:#5f7289;" class="email-muted">${escapeHtml(intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 28px 12px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  ${detailsHtml}
                </table>
                ${bodyHtml ? `<div style="padding:12px 0 0;">${bodyHtml}</div>` : ""}
                ${actionHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <div style="border-top:1px solid #d8e2ec;padding-top:18px;font-size:12px;line-height:1.8;color:#6c7b90;" class="email-divider email-footer">
                  ${escapeHtml(footerNote || "Sent from HEPA. Reply to this email if you need to continue the conversation.")}
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

function buildManualEmailHtml({ senderEmail, senderName, subject, message }) {
  const detailsHtml = [
    renderEmailField("From", senderName || senderEmail),
    senderName && senderEmail ? renderEmailField("Sender address", senderEmail) : "",
  ]
    .filter(Boolean)
    .join("");

  const bodyHtml = `
    <div
      style="border:1px solid #dde7ef;border-radius:20px;background:#ffffff;padding:22px 22px 10px;"
      class="email-card"
    >
      ${renderEmailParagraphs(message)}
    </div>
  `;

  return buildHepaEmailHtml({
    preheader: subject,
    eyebrow: "HEPA message",
    title: subject,
    intro: "A direct message from the HEPA team.",
    detailsHtml,
    bodyHtml,
    footerNote: "Sent from HEPA. You can reply directly to this email to continue the conversation.",
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
      <div
        style="border:1px solid #dde7ef;border-radius:20px;background:#ffffff;padding:22px 22px 10px;"
        class="email-card"
      >
        <div style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#5d7898;" class="email-label">Message</div>
        ${renderEmailParagraphs(message)}
      </div>
    `
    : "";

  const actionHtml = pageUrl ? renderEmailAction("Open source page", pageUrl) : "";

  return buildHepaEmailHtml({
    preheader: `${firstName} ${lastName} submitted a new contact request.`,
    eyebrow: "New inbound lead",
    title: `${firstName} ${lastName}`,
    intro: service ? `New HEPA contact form submission for ${service}.` : "New HEPA contact form submission.",
    detailsHtml,
    bodyHtml,
    actionHtml,
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

    if (request.method === "POST" && url.pathname === "/send-admin-request-email") {
      if (!env.OWNER_EMAIL) {
        return json({ error: "Server is not configured yet." }, 500, corsHeaders(allowedOrigin));
      }

      const requesterEmail = normalizeString(payload.requesterEmail).toLowerCase();
      const displayName = normalizeString(payload.displayName);
      const reviewUrl = normalizeString(payload.reviewUrl || "https://hepa.sa/admin");

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

      const html = [
        buildHepaEmailHtml({
          preheader: `${requesterEmail} requested HEPA admin access.`,
          eyebrow: "Admin access request",
          title: "New admin request",
          intro: `${requesterEmail} requested access to the HEPA admin editor.`,
          detailsHtml: [
            renderEmailField("Requester email", requesterEmail),
            displayName ? renderEmailField("Display name", displayName) : "",
          ]
            .filter(Boolean)
            .join(""),
          actionHtml: renderEmailAction("Open admin review", reviewUrl),
          footerNote: "Review the request in the HEPA admin workspace and approve or decline access.",
        }),
      ].join("");

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
