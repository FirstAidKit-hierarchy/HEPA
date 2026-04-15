# Cloudflare Worker Email Setup

The Cloudflare Worker source of truth for HEPA email delivery now lives in:

- `workers/hepa-api.js`

It supports:

- `POST /send-admin-request-email`
- `POST /send-contact-form-email`
- `GET /debug-config`

## Required Worker secrets

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `OWNER_EMAIL`

## Site environment variables

For GitHub Pages builds, set these repository variables in GitHub Actions:

```env
VITE_ADMIN_REQUEST_EMAIL_API_URL=https://api.hepa.sa
VITE_CONTACT_FORM_EMAIL_API_URL=https://api.hepa.sa
```

If `VITE_CONTACT_FORM_EMAIL_API_URL` is empty, the contact form falls back to `VITE_ADMIN_REQUEST_EMAIL_API_URL`.

## Contact form recipient

The public site reads the recipient from editable site content:

- `home.contact.submissionRecipientEmail`

This field is internal-only and is not rendered on the public page.

## Deployment note

This repo does not automatically deploy the Worker. After updating `workers/hepa-api.js`, copy the code into the Cloudflare Worker editor or deploy it using your own Worker pipeline.
