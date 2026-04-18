# Firebase Admin Setup

This project now supports a secure administration flow for the site-wide content editor by using Firebase Authentication and Cloud Firestore.

## 1. Add environment variables

Create `.env.local` in the project root for local development and copy the keys from `.env.example`.

For the live site on GitHub Pages at `https://hepa.sa`, set the Firebase values in the GitHub Pages workflow environment before building or redeploying. Local Vite development still reads the `VITE_*` variables directly from `.env.local`. The `/api/firebase-config` route is only an optional fallback for separate backend-capable hosts and is not part of the GitHub Pages production path.

```env
VITE_ADMIN_PATH=/admin
VITE_ADMIN_REQUEST_EMAIL_API_URL=https://api.hepa.sa
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_ADMIN_OWNER_EMAIL=owner@yourdomain.com
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_API_KEY=your_api_key
```

For this project, the core Firebase values are `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, and `VITE_FIREBASE_APP_ID`. If `VITE_FIREBASE_AUTH_DOMAIN` is omitted, the app falls back to `your_project_id.firebaseapp.com`. `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_MEASUREMENT_ID` are optional here.

`VITE_ADMIN_PATH` controls the fixed admin route at build time. Set it to a non-public path you want to use for the editor, then rebuild or redeploy the site.

If you also maintain a separate backend-capable deployment, the optional runtime config route accepts `NEXT_PUBLIC_FIREBASE_*` names as a fallback there. The GitHub Pages production build should still use the `VITE_*` names from the GitHub Actions workflow.

The owner-only password override section also needs the server-side values `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`, and `FIREBASE_API_KEY`. On `hepa.sa`, the admin page sends that action to the Cloudflare Worker using `VITE_ADMIN_REQUEST_EMAIL_API_URL` or `VITE_CONTACT_FORM_EMAIL_API_URL`. If you run a separate backend-capable host without the Worker URL, the legacy `/api/admin-passwords` route can still be used there.

For repeatable setup, you can keep a local server-only service-account file at `firebase-service-account.local.json` and run:

```bash
npm run sync:firebase-admin
```

The script reads `.env.local` plus `firebase-service-account.local.json` and upserts the required Firebase values into the linked Vercel project. This is optional and only relevant if you are maintaining a separate backend-capable deployment in addition to GitHub Pages. The example shape is in `firebase-service-account.local.example.json`. Do not commit the real `.local.json` file.

## 2. Enable authentication providers

In the Firebase console:

1. Open `Authentication`.
2. Enable `Email/Password`.
3. Create each administrator account in Firebase Authentication before giving that user editor access.
4. After sign-in, admins can change their password from the admin page. If they forget it, they can use the reset email flow there as well.

The reset email action on the admin sign-in screen is now a custom HEPA-branded flow. It no longer uses Firebase's built-in email template. The HTML is editable in the admin workspace under `Email templates`, and the Cloudflare Worker reads that Firestore-backed template when it sends the email. For production, make sure the Cloudflare Worker email backend is configured with:

- `FIREBASE_API_KEY`
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `OWNER_EMAIL`

The reset email link lands on the public route `/reset-password`, where the user enters a new password and completes the Firebase reset code flow in the browser.

If you deploy on more than one hostname or custom domain, add each one under `Authentication -> Settings -> Authorized domains`. The app can run on any domain, but Firebase Auth still blocks sign-in from domains that are not explicitly authorized in your Firebase project.

## 3. Create Firestore

1. Open `Firestore Database`.
2. Create the database in production mode.

## 4. Optional: enable Google sign-in

If you want admins to use the `Continue with Google` button on the admin page:

1. Open `Authentication -> Sign-in method`.
2. Enable `Google`.
3. Add every deployment hostname under `Authentication -> Settings -> Authorized domains`.

## 5. Optional: direct owner request emails with Cloudflare Worker + Resend

If you want signed-in users to notify the owner without the Firebase `Trigger Email` extension, point the site at the Worker endpoint:

```env
VITE_ADMIN_REQUEST_EMAIL_API_URL=https://api.hepa.sa
```

When this value is set, the `Request access` and `Resend request email` actions send the owner notification directly to `POST /send-admin-request-email` on that Worker instead of writing a Firestore `mail` document.

The current Worker contract expects:

- `POST /send-admin-request-email`
- JSON body with `requesterEmail`, `displayName`, and `reviewUrl`
- CORS allowed from `https://hepa.sa`

The `adminRequests/{uid}` Firestore record is still created and updated exactly the same way. Only the owner-notification transport changes.

## 6. Optional: install the Trigger Email extension

Use the Firebase `Trigger Email` extension (`firestore-send-email`) if you want Firestore-driven approval and decline emails, or if you are not using the direct Worker endpoint above.

1. Open `Extensions`.
2. Install `Trigger Email`.
3. Point it at the Firestore collection `mail`.
4. Configure your SMTP provider or supported email transport during installation.

The admin page writes email jobs into the `mail` collection when:

- an owner approves a request
- an owner declines a request

If `VITE_ADMIN_REQUEST_EMAIL_API_URL` is not configured, `Request access` also writes the owner notification into `mail`.

## 7. Add owner and admin documents

Create one document for each admin in the `adminUsers` collection.

- Document ID: the Firebase Auth user UID
- Suggested fields:

```json
{
  "email": "admin@example.com",
  "role": "admin"
}
```

Use `role: "owner"` for the primary owner account and `role: "admin"` for regular admins. The owner can later promote or demote other accounts from the admin panel.

If a signed-in user does not have a matching `adminUsers/{uid}` document, they can authenticate but they still cannot edit content.

## 8. Apply Firestore rules

Use rules like these so:

- only allowlisted admins can write the shared site content document
- only owners can manage approved admin access
- signed-in users can create their own pending request
- owners can review requests
- the `mail` collection can only be used for review-result emails, and for owner notifications when you are not using the direct Worker endpoint

Replace `owner@yourdomain.com` with the owner address, for example `ahuttami@digitalhepa.com`.

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() &&
        exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
    }

    function isOwner() {
      return isSignedIn() && (
        request.auth.token.email == "owner@yourdomain.com" ||
        get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == "owner"
      );
    }

    function isRequestOwner(requestId) {
      return isSignedIn() && request.auth.uid == requestId;
    }

    match /siteContent/site-pages {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /adminUsers/{userId} {
      allow read: if isAdmin();
      allow create, update, delete: if isOwner();
    }

    match /adminRequests/{requestId} {
      allow read: if isOwner() || isRequestOwner(requestId);
      allow create, update: if isOwner() || (
        isRequestOwner(requestId) &&
        request.resource.data.uid == request.auth.uid &&
        request.resource.data.email == request.auth.token.email &&
        request.resource.data.status == "pending" &&
        request.resource.data.ownerEmail == "owner@yourdomain.com"
      );
      allow delete: if isOwner();
    }

    match /mail/{mailId} {
      allow create: if isSignedIn() && (
        (
          request.resource.data.adminNotificationType == "admin-access-request-submitted" &&
          request.resource.data.relatedRequestUid == request.auth.uid &&
          request.resource.data.to == "owner@yourdomain.com"
        ) ||
        (
          isOwner() &&
          request.resource.data.adminNotificationType == "admin-access-request-reviewed" &&
          exists(/databases/$(database)/documents/adminRequests/$(request.resource.data.relatedRequestUid)) &&
          request.resource.data.to ==
            get(/databases/$(database)/documents/adminRequests/$(request.resource.data.relatedRequestUid)).data.email
        )
      );
      allow read, update, delete: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

If you always use `VITE_ADMIN_REQUEST_EMAIL_API_URL`, the first branch under `match /mail/{mailId}` is optional because request-submitted notifications no longer go through Firestore.

## 9. Content document

The editor saves to:

- Collection: `siteContent`
- Document: `site-pages`

You do not need to create this document manually. The admin editor will create it on the first save.

## 10. Admin access flow

After setup:

1. The user signs in on the admin route.
2. If the user is not approved yet, they can click `Request access`.
3. The app creates or refreshes `adminRequests/{uid}` with `status: "pending"`.
4. If `VITE_ADMIN_REQUEST_EMAIL_API_URL` is set, the app sends the owner notification directly to that endpoint. Otherwise it creates a new email job in `mail` for the owner.
5. If the request is already pending, the app keeps the same `adminRequests/{uid}` record and can send or queue the owner notification again.
6. The owner opens the admin page, reviews the pending queue, and approves or declines the request.
7. Approval creates or updates `adminUsers/{uid}` with the correct `email` and `role`.
8. Approval or decline also creates a new email job in `mail` for the requester.
9. If a reviewed request needs to be sent again, the requester can submit again and the same record returns to `pending`.
10. The requester can then sign in on the admin route and the editor unlocks automatically.

You can still manually create `adminUsers/{uid}` if you want to bypass the request flow for a trusted account.

## 11. Owner password overrides

The admin panel now includes a `Password overrides` section.

1. All approved admins can see the section.
2. Only accounts with the `owner` role can use it.
3. The owner can set a new password for any approved admin or owner account without knowing that user's current password.

On `hepa.sa`, this feature is expected to work through the Cloudflare Worker backend at `POST /set-admin-password`. If you do not configure the Worker URL, the app falls back to the legacy `/api/admin-passwords` server route for separate backend-capable deployments.
