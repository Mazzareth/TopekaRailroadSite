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
  const { url, caption, path } = await req.json().catch(() => ({ url: null }));
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "Photo URL is required" }, { status: 400 });
  }

  const tail = await adminDb.collection("photos").orderBy("order", "desc").limit(1).get();
  const maxOrder = tail.empty ? 0 : ((tail.docs[0].data().order as number) ?? 0);
  const photo: Record<string, unknown> = {
    url: url.trim(),
    caption: typeof caption === "string" ? caption : "",
    order: maxOrder + 1,
    createdAt: FieldValue.serverTimestamp(),
  };

  if (typeof path === "string" && path.trim()) {
    photo.path = path.trim();
  }

  const docRef = await adminDb.collection("photos").add(photo);
  return NextResponse.json({ id: docRef.id });
}
