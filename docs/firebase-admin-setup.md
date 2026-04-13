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

Use rules like these so only allowlisted admins can write the shared site content document and only the owner can manage admin access.

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

## 8. Admin access flow

After setup:

1. Create the user's Firebase Authentication account first.
2. Find that user's Firebase Auth UID.
3. Create or update `adminUsers/{uid}` with the correct `email` and `role`.
4. The user can then sign in on the admin route and the editor unlocks automatically.
5. Only the owner can remove access later from the admin panel or by deleting that Firestore admin record.

## 9. Owner password overrides

The admin panel now includes a `Password overrides` section.

1. All approved admins can see the section.
2. Only accounts with the `owner` role can use it.
3. The owner can set a new password for any approved admin or owner account without knowing that user's current password.

This feature depends on the `/api/admin-passwords` server route, so it works only where that API route and the server-side Firebase admin env vars are deployed.
