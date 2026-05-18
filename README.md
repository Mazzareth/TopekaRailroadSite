# tmr — Topeka Model Railroaders

Next.js 14 (App Router, TypeScript) site with Firebase Authentication, membership signup,
session-cookie-backed admin console, and role-based access control via Firebase custom claims.

## Stack
- Next.js 14 app router, React 18, TypeScript
- `firebase` (web SDK) on the client for sign-in / sign-up
- `firebase-admin` on the server for verifying ID tokens, issuing session cookies, and managing claims
- RBAC roles: `admin` (Station Master), `editor`, `member`

## Setup

```bash
cd tmr
cp .env.example .env.local   # fill in Firebase values
npm install
npm run dev
```

### Firebase project setup
1. Create a Firebase project. In **Authentication → Sign-in method**, enable:
   - **Email/Password**
   - **Google** (set a support email; no client-side config needed — the web SDK uses the project's default OAuth client)
2. **Authentication → Settings → Authorized domains**: make sure `localhost` and your deploy domain are listed (they usually are by default).
3. **Project Settings → General → Your apps**: add a web app, copy the `NEXT_PUBLIC_FIREBASE_*` values into `.env.local`.
4. **Storage → Get started**: create the default Storage bucket. If the bucket name differs from `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, set `FIREBASE_STORAGE_BUCKET` to the real bucket name without `gs://`.
5. **Project Settings → Service accounts → Generate new private key**. Put `project_id`, `client_email`, and `private_key` into `FIREBASE_ADMIN_*`. Keep `\n` line-breaks literal in the private key value.

### Promote a user to admin
After a user has signed up via `/signup`:

```bash
npm run set-admin -- user@example.com admin
# or: editor | member
```

Custom claims take effect on next sign-in (tokens refresh). Users can log out and back in.

## Routes
| Path | Purpose | Guard |
| --- | --- | --- |
| `/` | Public marketing home | — |
| `/signup` | Member self-signup | — |
| `/login` | Email/password sign-in | — |
| `/admin` | Dashboard | `admin` or `editor` |
| `/admin/events`, `/blog`, `/copy`, `/photos`, `/settings` | Admin views | `admin` or `editor` |
| `POST /api/members` | Create Firebase user + default `member` claim | — |
| `POST /api/session` | Exchange Firebase ID token for server session cookie | — |
| `DELETE /api/session` | Clear session cookie | — |

## How auth works
1. Client signs in with `signInWithEmailAndPassword` → gets a fresh ID token.
2. Client `POST`s the ID token to `/api/session`. The server verifies it with the Admin SDK and mints a **session cookie** (httpOnly, 5-day default).
3. Server pages read `cookies().get("__session")`, verify with `adminAuth.verifySessionCookie`, and check the role claim to gate `/admin/*`.

## Project layout
```
src/
  app/
    layout.tsx         # root layout + fonts
    page.tsx           # public home (ported from index.html)
    globals.css        # shared styles (ported from styles.css)
    login/page.tsx
    signup/page.tsx
    admin/
      layout.tsx       # RBAC guard + sidebar
      page.tsx         # dashboard
      events|blog|copy|photos|settings/page.tsx
    api/
      members/route.ts # self-signup
      session/route.ts # session cookie mint/clear
  components/
    Masthead.tsx
    SiteFooter.tsx
    AdminSidebar.tsx
  lib/
    auth.ts            # getSessionUser, canAccessAdmin, roles
    firebase/
      client.ts        # web SDK singleton
      admin.ts         # Admin SDK singleton
scripts/
  set-admin.ts         # grant/revoke role claims
public/
  train.svg
```

## Notes
- The admin layout is `force-dynamic` so cookie checks always hit the server.
- `/api/session` requires the ID token be less than 5 minutes old to resist replay.
- Only `admin` users see the **Editors & Access** group in Site Settings.
