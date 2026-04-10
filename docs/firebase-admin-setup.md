# Firebase Admin Setup

This project now supports a secure administration flow for the site-wide content editor by using Firebase Authentication and Cloud Firestore.

## 1. Add environment variables

Create `.env.local` in the project root and copy the keys from `.env.example`.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_ADMIN_OWNER_EMAIL=owner@yourdomain.com
```

## 2. Enable authentication providers

In the Firebase console:

1. Open `Authentication`.
2. Enable `Google`.
3. Enable `Email/Password`.
4. Create any email/password admin accounts you need.

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

## 5. Add admin allowlist documents

Create one document for each admin in the `adminUsers` collection.

- Document ID: the Firebase Auth user UID
- Suggested fields:

```json
{
  "email": "admin@example.com",
  "role": "admin"
}
```

If a signed-in user does not have a matching `adminUsers/{uid}` document, they can authenticate but they still cannot edit content.

## 6. Apply Firestore rules

Use rules like these so only allowlisted admins can write the shared site content document, only signed-in users can submit their own access requests, and only the owner can approve, decline, or revoke admin access.

Replace `owner@yourdomain.com` with the owner address, for example `ahuttami@digitalhepa.com`.

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner() {
      return request.auth != null &&
        request.auth.token.email == "owner@yourdomain.com";
    }

    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
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

      allow read: if isOwner() || (request.auth != null && request.auth.uid == userId);
      allow update: if isOwner();
      allow delete: if false;
    }

    match /adminUsers/{userId} {
      allow read: if isOwner() || (request.auth != null && request.auth.uid == userId);
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
