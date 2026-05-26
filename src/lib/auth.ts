import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "./firebase/admin";
import { getEmailGrantRole } from "./adminGrants";

export const SESSION_COOKIE = "__session";

export type Role = "admin" | "editor" | "member";

export type SessionUser = {
  uid: string;
  email: string | null;
  name: string | null;
  role: Role;
};

function roleFromClaims(claims: Record<string, unknown>): Role {
  if (claims.admin === true || claims.role === "admin") return "admin";
  if (claims.role === "editor") return "editor";
  return "member";
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(token, true);
    const claimRole = roleFromClaims(decoded as unknown as Record<string, unknown>);
    const emailGrantRole = await getEmailGrantRole(decoded.email);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: (decoded.name as string | undefined) ?? null,
      role: emailGrantRole ?? claimRole,
    };
  } catch {
    return null;
  }
}

export function canAccessAdmin(user: SessionUser | null): boolean {
  return !!user && (user.role === "admin" || user.role === "editor");
}
