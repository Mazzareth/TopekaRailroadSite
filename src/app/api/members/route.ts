import { NextResponse, type NextRequest } from "next/server";
import { applyEmailGrantToUser } from "@/lib/adminGrants";
import { adminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { email, password, displayName } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  if (String(password).length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const user = await adminAuth.createUser({
      email,
      password,
      displayName: displayName || undefined,
    });
    const grantedRole = await applyEmailGrantToUser(email, user.uid);
    if (!grantedRole) {
      await adminAuth.setCustomUserClaims(user.uid, { role: "member" });
    }
    return NextResponse.json({ uid: user.uid });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
