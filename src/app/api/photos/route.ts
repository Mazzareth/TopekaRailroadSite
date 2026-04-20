import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const snap = await adminDb.collection("photos").orderBy("order", "asc").get();
  const photos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(photos);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { url, caption } = await req.json();
  const tail = await adminDb.collection("photos").orderBy("order", "desc").limit(1).get();
  const maxOrder = tail.empty ? 0 : ((tail.docs[0].data().order as number) ?? 0);
  const docRef = await adminDb.collection("photos").add({
    url,
    caption: caption ?? "",
    order: maxOrder + 1,
    createdAt: FieldValue.serverTimestamp(),
  });
  return NextResponse.json({ id: docRef.id });
}
