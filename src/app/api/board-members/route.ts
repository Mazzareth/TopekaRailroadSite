import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type BoardMemberBody = {
  name?: unknown;
  title?: unknown;
  photoUrl?: unknown;
  photoPath?: unknown;
  active?: unknown;
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snap = await adminDb.collection("boardMembers").orderBy("order", "asc").get();
  const members = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as BoardMemberBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Board member payload must be valid JSON." }, { status: 400 });
  }

  const name = cleanString(body.name);
  if (!name) {
    return NextResponse.json({ error: "Board member name is required." }, { status: 400 });
  }

  const tail = await adminDb.collection("boardMembers").orderBy("order", "desc").limit(1).get();
  const maxOrder = tail.empty ? 0 : ((tail.docs[0].data().order as number) ?? 0);
  const docRef = await adminDb.collection("boardMembers").add({
    name,
    title: cleanString(body.title),
    photoUrl: cleanString(body.photoUrl),
    photoPath: cleanString(body.photoPath),
    active: typeof body.active === "boolean" ? body.active : true,
    order: maxOrder + 1,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ id: docRef.id });
}
