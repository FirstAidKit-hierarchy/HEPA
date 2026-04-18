export const emailTemplateEditorConfig = [
  {
    key: "passwordReset",
    label: "Password reset",
    description: "Sent when an approved administrator requests a password reset link.",
  },
  {
    key: "adminRequest",
    label: "Admin request",
    description: "Sent to the owner when someone requests admin access.",
  },
  {
    key: "contactForm",
    label: "Contact form",
    description: "Sent when the site contact form creates a new inbound lead.",
  },
  {
    key: "manual",
    label: "Manual email",
    description: "Sent from the admin panel for one-off owner messages.",
  },
  {
    key: "blank",
    label: "Blank template",
    description: "Reusable HEPA shell for future custom email flows.",
  },
] as const;

export type EmailTemplateKey = (typeof emailTemplateEditorConfig)[number]["key"];

export const emailTemplatePlaceholderHelp = [
  {
    token: "{{SITE_URL}}",
    description: "HEPA site link used by the logo and any shell links.",
  },
  {
    token: "{{LOGO_URL}}",
    description: "Public HEPA Email.png logo image URL.",
  },
  {
    token: "{{PREHEADER}}",
    description: "Hidden preview text shown by many mail clients.",
  },
  {
    token: "{{EYEBROW}}",
    description: "Small label above the main title.",
  },
  {
    token: "{{TITLE}}",
    description: "Primary email heading.",
  },
  {
    token: "{{INTRO}}",
    description: "Supporting intro text below the heading.",
  },
  {
    token: "{{DETAILS_HTML}}",
    description: "Rendered HTML rows for contact details and metadata.",
  },
  {
    token: "{{BODY_HTML}}",
    description: "Rendered main body HTML for the message content.",
  },
  {
    token: "{{ACTION_HTML}}",
    description: "Rendered action button HTML when a CTA is available.",
  },
  {
    token: "{{FOOTER_NOTE}}",
    description: "Footer text shown under the content area.",
  },
] as const;

const HEPA_EMAIL_LOGO_URL = "https://hepa.sa/HEPA%20Email.png";
const rawEmailTemplateTokens = new Set(["DETAILS_HTML", "BODY_HTML", "ACTION_HTML"]);
const emailTemplateTokenPattern = /{{\s*([A-Z0-9_]+)\s*}}/g;
const emailTemplateSharedStyles = `
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

export const buildDefaultEmailTemplateHtml = () => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>{{TITLE}}</title>
    <style>${emailTemplateSharedStyles}</style>
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
                <p
                  style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#79d3ff;"
                  class="email-eyebrow"
                >
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
                <div
                  style="border-top:1px solid #d8e2ec;padding-top:18px;font-size:12px;line-height:1.8;color:#6c7b90;"
                  class="email-divider email-footer"
                >
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

export const defaultEmailTemplates: Record<EmailTemplateKey, string> = {
  passwordReset: buildDefaultEmailTemplateHtml(),
  adminRequest: buildDefaultEmailTemplateHtml(),
  contactForm: buildDefaultEmailTemplateHtml(),
  manual: buildDefaultEmailTemplateHtml(),
  blank: buildDefaultEmailTemplateHtml(),
};

export const escapeEmailHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const renderEmailParagraphs = (value = "") =>
  escapeEmailHtml(value)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, "<br />"))
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#122033;" class="email-copy email-text">${paragraph}</p>`,
    )
    .join("");

export const renderEmailField = (label: string, value: string) => {
  if (!value) {
    return "";
  }

  return `
    <tr>
      <td style="padding:0 0 12px;border-bottom:1px solid #e3ebf2;" class="email-field-row">
        <div style="padding:0 0 12px;">
          <div style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#5d7898;" class="email-label">${escapeEmailHtml(label)}</div>
          <div style="margin:0;font-size:15px;line-height:1.7;color:#122033;word-break:break-word;" class="email-text">${escapeEmailHtml(value)}</div>
        </div>
      </td>
    </tr>
  `;
};

export const renderEmailAction = (label: string, href: string) => {
  if (!label || !href) {
    return "";
  }

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:22px 0 0;">
      <tr>
        <td style="border-radius:999px;background:linear-gradient(135deg,#7ed957,#55c7a1);text-align:center;" class="email-button-wrap">
          <a
            href="${escapeEmailHtml(href)}"
            style="display:inline-block;padding:14px 24px;font-size:14px;font-weight:700;line-height:1;color:#091220;text-decoration:none;"
            class="email-button"
          >
            ${escapeEmailHtml(label)}
          </a>
        </td>
      </tr>
    </table>
  `;
};

export const renderEmailTemplateHtml = (templateHtml: string, values: Record<string, string>) =>
  templateHtml.replace(emailTemplateTokenPattern, (_, token: string) => {
    const value = values[token] ?? "";
    return rawEmailTemplateTokens.has(token) ? value : escapeEmailHtml(value);
  });

const createBodyBlock = (contentHtml: string) =>
  contentHtml ? `<div style="padding:18px 0 0;" class="email-body-block">${contentHtml}</div>` : "";

const previewShellValues = {
  SITE_URL: "https://hepa.sa",
  LOGO_URL: HEPA_EMAIL_LOGO_URL,
};

export const getEmailTemplatePreviewHtml = (templateKey: EmailTemplateKey, templateHtml: string) => {
  switch (templateKey) {
    case "passwordReset":
      return renderEmailTemplateHtml(templateHtml, {
        ...previewShellValues,
        PREHEADER: "Reset your password and return to your HEPA workspace.",
        EYEBROW: "Account security",
        TITLE: "Reset your password",
        INTRO: "Use the secure link below to restore access to your HEPA workspace.",
        DETAILS_HTML: [
          renderEmailField("Application", "HEPA"),
          renderEmailField("Account email", "admin@hepa.sa"),
        ].join(""),
        BODY_HTML: createBodyBlock(
          [
            `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#122033;" class="email-copy email-text">Hello,</p>`,
            `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#122033;" class="email-copy email-text">We received a request to reset the password for your <strong>HEPA</strong> account linked to <strong>admin@hepa.sa</strong>.</p>`,
            `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#122033;" class="email-copy email-text">Use the button below to choose a new password and sign back in securely.</p>`,
            `<p style="margin:22px 0 10px;font-size:14px;line-height:1.8;color:#5f7289;" class="email-muted">If the button does not open, copy and paste this link into your browser:</p>`,
            `<p style="margin:0 0 18px;word-break:break-word;"><a href="https://hepa.sa/reset-password?mode=resetPassword&amp;oobCode=preview-code" style="color:#2b8abf;font-size:14px;line-height:1.7;text-decoration:underline;" class="email-link">https://hepa.sa/reset-password?mode=resetPassword&amp;oobCode=preview-code</a></p>`,
            `<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#122033;" class="email-copy email-text">If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged.</p>`,
          ].join(""),
        ),
        ACTION_HTML: renderEmailAction("Reset password", "https://hepa.sa/reset-password?mode=resetPassword&oobCode=preview-code"),
        FOOTER_NOTE:
          "This security email was sent by HEPA for your account. If you did not request this action, no further action is required.",
      });
    case "adminRequest":
      return renderEmailTemplateHtml(templateHtml, {
        ...previewShellValues,
        PREHEADER: "spam72459@gmail.com requested HEPA admin access.",
        EYEBROW: "Admin access request",
        TITLE: "New admin request",
        INTRO: "spam72459@gmail.com requested access to the HEPA admin editor.",
        DETAILS_HTML: [
          renderEmailField("Requester email", "spam72459@gmail.com"),
          renderEmailField("Display name", "Spam"),
        ].join(""),
        BODY_HTML: "",
        ACTION_HTML: renderEmailAction("Open admin review", "https://hepa.sa/admin"),
        FOOTER_NOTE: "Review the request in the HEPA admin workspace and approve or decline access.",
      });
    case "contactForm":
      return renderEmailTemplateHtml(templateHtml, {
        ...previewShellValues,
        PREHEADER: "Abdulrahman Alhuttami submitted a new contact request.",
        EYEBROW: "New inbound lead",
        TITLE: "Abdulrahman Alhuttami",
        INTRO: "New HEPA contact form submission for Pricing and access strategy.",
        DETAILS_HTML: [
          renderEmailField("Contact", "Abdulrahman Alhuttami"),
          renderEmailField("Company", "HEPA Solutions"),
          renderEmailField("Email", "ahuttami@digitalhepa.com"),
          renderEmailField("CC", "ahuttami+1@digitalhepa.com"),
          renderEmailField("Phone", "+966500000000"),
          renderEmailField("Project need", "Pricing and access strategy"),
          renderEmailField("Submitted at", "2026-04-18T18:41:00.000Z"),
        ].join(""),
        BODY_HTML: createBodyBlock(
          `
            <div style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#5d7898;" class="email-label">Message</div>
            ${renderEmailParagraphs(
              "We need support with pricing and access research for a GCC launch.\n\nPlease share what information you need from our team next.",
            )}
          `,
        ),
        ACTION_HTML: renderEmailAction("Open source page", "https://hepa.sa/#contact"),
        FOOTER_NOTE: "Sent from HEPA. Reply to this email if you need to continue the conversation.",
      });
    case "blank":
      return renderEmailTemplateHtml(templateHtml, {
        ...previewShellValues,
        PREHEADER: "A blank HEPA email shell ready for your content.",
        EYEBROW: "Blank template",
        TITLE: "Start from a clean HEPA email shell",
        INTRO: "Use this template when you want the HEPA structure without a predefined workflow.",
        DETAILS_HTML: "",
        BODY_HTML: createBodyBlock(
          renderEmailParagraphs(
            "Replace this text with your own message.\n\nKeep the placeholders you need in the editor and remove the sections you do not want to send.",
          ),
        ),
        ACTION_HTML: "",
        FOOTER_NOTE: "Blank HEPA template preview for future custom email flows.",
      });
    case "manual":
    default:
      return renderEmailTemplateHtml(templateHtml, {
        ...previewShellValues,
        PREHEADER: "Quarterly access review",
        EYEBROW: "HEPA message",
        TITLE: "Quarterly access review",
        INTRO: "A direct message from the HEPA team.",
        DETAILS_HTML: [
          renderEmailField("From", "HEPA Team"),
          renderEmailField("Sender address", "noreply@hepa.sa"),
        ].join(""),
        BODY_HTML: createBodyBlock(
          renderEmailParagraphs(
            "Thank you for the update.\n\nWe reviewed the latest materials and will return with the next recommendation by the end of the week.",
          ),
        ),
        ACTION_HTML: "",
        FOOTER_NOTE: "Sent from HEPA. You can reply directly to this email to continue the conversation.",
      });
  }
};
