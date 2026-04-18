# Cloudflare Worker Email Setup

The Cloudflare Worker source of truth for HEPA email delivery now lives in:

- `workers/hepa-api.js`

The editable HTML for those emails now lives in the admin workspace under the `Email templates` section and is stored in Firestore at `siteContent/site-pages`.

It supports:

- `POST /send-admin-request-email`
- `POST /send-contact-form-email`
- `POST /send-password-reset-email`
- `POST /set-admin-password`
- `GET /debug-config`

## Required Worker secrets

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `OWNER_EMAIL`
- `FIREBASE_API_KEY`
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

## Site environment variables

For GitHub Pages builds, set these repository variables in GitHub Actions:

```env
VITE_ADMIN_REQUEST_EMAIL_API_URL=https://api.hepa.sa
VITE_CONTACT_FORM_EMAIL_API_URL=https://api.hepa.sa
```

If `VITE_CONTACT_FORM_EMAIL_API_URL` is empty, the contact form falls back to `VITE_ADMIN_REQUEST_EMAIL_API_URL`.

The admin password reset button and the owner password override action both use this same Worker base URL.

## Custom password reset flow

The admin sign-in screen no longer depends on Firebase's built-in password reset email template.

Instead:

1. The frontend sends `POST /send-password-reset-email` to the Worker.
2. The Worker uses the Firebase admin service account to generate a password reset OOB link.
3. The Worker rewrites that Firebase code into the HEPA route `/reset-password`.
4. Resend delivers the branded HEPA password reset email.
5. The public site handles the reset on `/reset-password`.

The reset email only sends for the owner account or approved admin accounts stored in `adminUsers`.

## Contact form recipient

The public site reads the recipient from editable site content:

- `home.contact.submissionRecipientEmail`

This field is internal-only and is not rendered on the public page.

## Deployment note

This repo does not automatically deploy the Worker. After updating `workers/hepa-api.js`, copy the code into the Cloudflare Worker editor or deploy it using your own Worker pipeline. For template changes, use the admin panel instead of editing Cloudflare directly.
