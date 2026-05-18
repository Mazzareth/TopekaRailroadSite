import { NextResponse } from "next/server";
import { adminBucket, adminDb } from "@/lib/firebase/admin";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const docRef = adminDb.collection("photos").doc(params.id);
  const doc = await docRef.get();
  const path = doc.data()?.path;

  await docRef.delete();

  if (typeof path === "string" && path) {
    await adminBucket.file(path).delete({ ignoreNotFound: true }).catch((err) => {
      console.error("photo storage delete failed", err);
    });
  }

  return NextResponse.json({ ok: true });
}
