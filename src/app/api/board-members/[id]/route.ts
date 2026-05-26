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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

  await adminDb.collection("boardMembers").doc(params.id).update({
    name,
    title: cleanString(body.title),
    photoUrl: cleanString(body.photoUrl),
    photoPath: cleanString(body.photoPath),
    active: typeof body.active === "boolean" ? body.active : true,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await adminDb.collection("boardMembers").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}
