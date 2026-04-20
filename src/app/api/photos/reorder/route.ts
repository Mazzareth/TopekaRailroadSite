import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { ids } = (await req.json()) as { ids: string[] };
  const batch = adminDb.batch();
  ids.forEach((id, idx) => {
    batch.update(adminDb.collection("photos").doc(id), { order: idx + 1 });
  });
  await batch.commit();
  return NextResponse.json({ ok: true });
}
