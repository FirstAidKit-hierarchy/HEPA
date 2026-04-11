# Firebase Admin Setup

This project now supports a secure administration flow for the site-wide content editor by using Firebase Authentication and Cloud Firestore.

## 1. Add environment variables

Create `.env.local` in the project root for local development and copy the keys from `.env.example`.

If you deploy the site, add the same `VITE_*` variables to your hosting provider before building or redeploying. Vite injects these values at build time, so a deployed app will show `Firebase is not configured yet.` if production is missing them.

```env
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

The owner-only password override section also needs the server-side values `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`, and `FIREBASE_API_KEY` so the `/api/admin-passwords` route can update Firebase Auth users securely. Add those values in your hosting provider too, not only in local development.

## 2. Enable authentication providers

In the Firebase console:

1. Open `Authentication`.
2. Enable `Email/Password`.
3. On the first login, an admin can use the admin page to create their own password with their email address.
4. After sign-in, admins can change their password from the admin page. If they forget it, they can use the reset email flow there as well.

If you deploy on more than one hostname or custom domain, add each one under `Authentication -> Settings -> Authorized domains`. The app can run on any domain, but Firebase Auth still blocks sign-in from domains that are not explicitly authorized in your Firebase project.

## 3. Create Firestore

1. Open `Firestore Database`.
2. Create the database in production mode.

## 4. Optional: install the Trigger Email extension

The access request flow works without email. A signed-in non-admin can submit a request, and only the owner can review it from the admin panel.

If you also want the owner to receive an email when someone submits a request, install the official Firebase Trigger Email extension and point it at the `adminRequests` collection.

- Official docs: https://firebase.google.com/docs/extensions/official/firestore-send-email
- During setup:
  - choose your SMTP provider
  - set the email collection path to `adminRequests`
  - keep the default sender or configure your preferred sender address

When `VITE_ADMIN_OWNER_EMAIL` is set, the app writes `to` and `message` fields into each new `adminRequests/{uid}` document, which the extension uses to send the owner email.

## 5. Add owner and admin documents

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

## 6. Apply Firestore rules

Use rules like these so only allowlisted admins can write the shared site content document, only signed-in users can submit their own access requests, and only the owner can approve, decline, or revoke admin access.

Replace `owner@yourdomain.com` with the owner address, for example `ahuttami@digitalhepa.com`.

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
    }

    function isOwner() {
      return request.auth != null && (
        request.auth.token.email == "owner@yourdomain.com" ||
        get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.role == "owner"
      );
    }

    match /siteContent/site-pages {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /adminRequests/{userId} {
      allow create: if request.auth != null
        && request.auth.uid == userId
        && !exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid))
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.email == request.auth.token.email
        && request.resource.data.status == "pending";

      allow read: if isAdmin() || (request.auth != null && request.auth.uid == userId);
      allow update: if isOwner();
      allow delete: if false;
    }

    match /adminUsers/{userId} {
      allow read: if isAdmin();
      allow create, update, delete: if isOwner();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 7. Content document

The editor saves to:

- Collection: `siteContent`
- Document: `site-pages`

You do not need to create this document manually. The admin editor will create it on the first save.

## 8. Access request flow

After setup:

1. A signed-in user without admin access sees a `Request owner approval` button.
2. Clicking it creates `adminRequests/{uid}`.
3. Only the owner reviews the request from the admin page and clicks `Approve` or `Decline`.
4. Approving creates or updates `adminUsers/{uid}`, which unlocks the editor for that user.
5. Only the owner can remove access later by deleting that user's admin record from the admin panel.

If you install the Trigger Email extension and set `VITE_ADMIN_OWNER_EMAIL`, step 2 will also send the owner an email notification automatically.

## 9. Owner password overrides

The admin panel now includes a `Password overrides` section.

1. All approved admins can see the section.
2. Only accounts with the `owner` role can use it.
3. The owner can set a new password for any approved admin or owner account without knowing that user's current password.

This feature depends on the `/api/admin-passwords` server route, so it works only where that API route and the server-side Firebase admin env vars are deployed.
