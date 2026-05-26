import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { Role } from "@/lib/auth";

export type GrantableRole = Exclude<Role, "member">;

export type AccessGrantResult = {
  email: string;
  role: GrantableRole;
  status: "applied" | "pending";
  uid?: string;
};

const GRANTS_COLLECTION = "adminAccessGrants";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeGrantEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  return EMAIL_PATTERN.test(normalized) ? normalized : null;
}

export function normalizeGrantRole(role: unknown): GrantableRole | null {
  return role === "admin" || role === "editor" ? role : null;
}

function grantRef(email: string) {
  return adminDb.collection(GRANTS_COLLECTION).doc(email);
}

export async function getEmailGrantRole(email: unknown): Promise<GrantableRole | null> {
  const normalized = normalizeGrantEmail(email);
  if (!normalized) return null;

  const snap = await grantRef(normalized).get();
  if (!snap.exists) return null;

  return normalizeGrantRole(snap.data()?.role);
}

export async function markEmailGrantApplied(email: unknown, uid: string): Promise<void> {
  const normalized = normalizeGrantEmail(email);
  if (!normalized) return;

  await grantRef(normalized).set(
    {
      status: "applied",
      uid,
      appliedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

export async function applyEmailGrantToUser(email: unknown, uid: string): Promise<GrantableRole | null> {
  const grantedRole = await getEmailGrantRole(email);
  if (!grantedRole) return null;

  const user = await adminAuth.getUser(uid);
  await adminAuth.setCustomUserClaims(uid, {
    ...(user.customClaims ?? {}),
    role: grantedRole,
  });
  await markEmailGrantApplied(email, uid);
  return grantedRole;
}

export async function grantAccessByEmail({
  email,
  role,
  grantedBy,
}: {
  email: unknown;
  role: unknown;
  grantedBy: string;
}): Promise<AccessGrantResult> {
  const normalizedEmail = normalizeGrantEmail(email);
  const normalizedRole = normalizeGrantRole(role);
  if (!normalizedEmail) {
    throw new Error("Enter a valid email address.");
  }
  if (!normalizedRole) {
    throw new Error("Choose admin or editor access.");
  }

  const baseGrant = {
    email: normalizedEmail,
    role: normalizedRole,
    grantedBy,
    updatedAt: FieldValue.serverTimestamp(),
  };

  try {
    const user = await adminAuth.getUserByEmail(normalizedEmail);
    await grantRef(normalizedEmail).set(
      {
        ...baseGrant,
        status: "applied",
        uid: user.uid,
        appliedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await adminAuth.setCustomUserClaims(user.uid, {
      ...(user.customClaims ?? {}),
      role: normalizedRole,
    });
    return {
      email: normalizedEmail,
      role: normalizedRole,
      status: "applied",
      uid: user.uid,
    };
  } catch (err: unknown) {
    const code = typeof err === "object" && err && "code" in err
      ? String((err as { code?: unknown }).code)
      : "";
    if (code !== "auth/user-not-found") {
      throw err;
    }

    await grantRef(normalizedEmail).set(
      {
        ...baseGrant,
        status: "pending",
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return {
      email: normalizedEmail,
      role: normalizedRole,
      status: "pending",
    };
  }
}
