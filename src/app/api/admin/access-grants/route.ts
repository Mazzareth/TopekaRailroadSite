import { NextResponse, type NextRequest } from "next/server";
import { grantAccessByEmail } from "@/lib/adminGrants";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Admin role required" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  try {
    const result = await grantAccessByEmail({
      email: body.email,
      role: body.role ?? "admin",
      grantedBy: user.email ?? user.uid,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unable to update access.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
