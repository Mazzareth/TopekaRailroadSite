/**
 * Usage:  npm run set-admin -- user@example.com admin
 *         npm run set-admin -- user@example.com editor
 *         npm run set-admin -- user@example.com member
 *
 * Reads FIREBASE_ADMIN_* env vars from .env.local (via --env-file in npm script).
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "node:fs";

function loadEnv() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2];
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  } catch {
    // No .env.local — rely on ambient env.
  }
}

async function main() {
  loadEnv();
  const [email, role = "admin"] = process.argv.slice(2);
  if (!email) {
    console.error("Usage: npm run set-admin -- <email> [admin|editor|member]");
    process.exit(1);
  }
  if (!["admin", "editor", "member"].includes(role)) {
    console.error(`Invalid role: ${role}`);
    process.exit(1);
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    });
  }

  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { role });
  console.log(`Set role=${role} on ${email} (uid=${user.uid}).`);
  console.log("User must sign out and back in for new claims to take effect.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
