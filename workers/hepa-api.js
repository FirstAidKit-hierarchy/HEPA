const ALLOWED_ORIGINS = new Set([
  "https://hepa.sa",
  "https://www.hepa.sa",
  "http://localhost:8080",
  "http://localhost:5173",
]);

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildContactFormTextLines({
  firstName,
  lastName,
  company,
  email,
  phone,
  service,
  message,
  pageUrl,
  submittedAt,
}) {
  return [
    "A new HEPA contact form request was submitted.",
    `Name: ${firstName} ${lastName}`.trim(),
    company ? `Company: ${company}` : "",
    `Email: ${email}`,
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
  pageUrl,
  submittedAt,
}) {
  return [
    "<p>A new HEPA contact form request was submitted.</p>",
    `<p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>`,
    company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : "",
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : "",
    service ? `<p><strong>Project Need:</strong> ${escapeHtml(service)}</p>` : "",
    message ? `<p><strong>Message:</strong><br />${escapeHtml(message).replace(/\n/g, "<br />")}</p>` : "",
    pageUrl ? `<p><strong>Page URL:</strong> <a href="${escapeHtml(pageUrl)}">${escapeHtml(pageUrl)}</a></p>` : "",
    `<p><strong>Submitted at:</strong> ${escapeHtml(submittedAt)}</p>`,
  ].filter(Boolean);
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
        `<p><strong>${escapeHtml(requesterEmail)}</strong> requested access to the HEPA admin editor.</p>`,
        displayName ? `<p>Display name: ${escapeHtml(displayName)}</p>` : "",
        `<p><a href="${escapeHtml(reviewUrl)}">Open the admin review page</a></p>`,
      ]
        .filter(Boolean)
        .join("");

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
        pageUrl,
        submittedAt,
      }).join("");

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL,
          to: recipientEmail,
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

    return json({ error: "Not found" }, 404, corsHeaders(allowedOrigin));
  },
};
