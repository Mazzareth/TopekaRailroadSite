import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await adminDb.collection("photos").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}
