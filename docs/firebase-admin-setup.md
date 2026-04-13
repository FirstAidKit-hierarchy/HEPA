# Firebase Admin Setup

This project now supports a secure administration flow for the site-wide content editor by using Firebase Authentication and Cloud Firestore.

## 1. Add environment variables

Create `.env.local` in the project root for local development and copy the keys from `.env.example`.

If you deploy the site, add the same Firebase values to your hosting provider before building or redeploying. Local Vite development still reads the `VITE_*` variables directly, and deployed builds can now also read them at runtime from the `/api/firebase-config` route on Vercel. If production is missing the values entirely, the app will still show `Firebase is not configured yet.`.

```env
VITE_ADMIN_PATH=/admin
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

If you are deploying on Vercel and already stored these values as `NEXT_PUBLIC_FIREBASE_*`, the runtime config route also accepts those names as a fallback. Local development should still keep using the `VITE_*` names from `.env.local`.

The owner-only password override section also needs the server-side values `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`, and `FIREBASE_API_KEY` so the `/api/admin-passwords` route can update Firebase Auth users securely. Add those values in your hosting provider too, not only in local development.

For repeatable setup, you can keep a local server-only service-account file at `firebase-service-account.local.json` and run:

```bash
npm run sync:firebase-admin
```

The script reads `.env.local` plus `firebase-service-account.local.json` and upserts the required Firebase values into the linked Vercel project. The example shape is in `firebase-service-account.local.example.json`. Do not commit the real `.local.json` file.

## 2. Enable authentication providers

In the Firebase console:

1. Open `Authentication`.
2. Enable `Email/Password`.
3. Create each administrator account in Firebase Authentication before giving that user editor access.
4. After sign-in, admins can change their password from the admin page. If they forget it, they can use the reset email flow there as well.

If you deploy on more than one hostname or custom domain, add each one under `Authentication -> Settings -> Authorized domains`. The app can run on any domain, but Firebase Auth still blocks sign-in from domains that are not explicitly authorized in your Firebase project.

## 3. Create Firestore

1. Open `Firestore Database`.
2. Create the database in production mode.

## 4. Optional: enable Google sign-in

If you want admins to use the `Continue with Google` button on the admin page:

1. Open `Authentication -> Sign-in method`.
2. Enable `Google`.
3. Add every deployment hostname under `Authentication -> Settings -> Authorized domains`.

## 5. Install the Trigger Email extension

For real request and approval emails on GitHub Pages, use the Firebase `Trigger Email` extension (`firestore-send-email`).

1. Open `Extensions`.
2. Install `Trigger Email`.
3. Point it at the Firestore collection `mail`.
4. Configure your SMTP provider or supported email transport during installation.

The admin page now writes email jobs into the `mail` collection when:

- a signed-in user clicks `Request access`
- an owner approves a request
- an owner declines a request

This is the recommended email path for GitHub Pages because `/api/*` routes do not run there.

## 6. Add owner and admin documents

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

## 7. Apply Firestore rules

Use rules like these so:

- only allowlisted admins can write the shared site content document
- only owners can manage approved admin access
- signed-in users can create their own pending request
- owners can review requests
- the `mail` collection can only be used for the two request-notification flows above

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

## 8. Content document

The editor saves to:

- Collection: `siteContent`
- Document: `site-pages`

You do not need to create this document manually. The admin editor will create it on the first save.

## 9. Admin access flow

After setup:

1. The user signs in on the admin route.
2. If the user is not approved yet, they can click `Request access`.
3. The app creates or refreshes `adminRequests/{uid}` with `status: "pending"`.
4. The app also creates a new email job in `mail` for the owner.
5. The owner opens the admin page, reviews the pending queue, and approves or declines the request.
6. Approval creates or updates `adminUsers/{uid}` with the correct `email` and `role`.
7. Approval or decline also creates a new email job in `mail` for the requester.
8. The requester can then sign in on the admin route and the editor unlocks automatically.

You can still manually create `adminUsers/{uid}` if you want to bypass the request flow for a trusted account.

## 10. Owner password overrides

The admin panel now includes a `Password overrides` section.

1. All approved admins can see the section.
2. Only accounts with the `owner` role can use it.
3. The owner can set a new password for any approved admin or owner account without knowing that user's current password.

This feature depends on the `/api/admin-passwords` server route, so it works only where that API route and the server-side Firebase admin env vars are deployed.
