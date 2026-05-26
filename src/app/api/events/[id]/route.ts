import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";
import { normalizeEventDates } from "@/lib/events";

export const runtime = "nodejs";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const normalized = normalizeEventDates(body);
  if (normalized.startDate && normalized.endDate && normalized.endDate < normalized.startDate) {
    return NextResponse.json({ error: "End date cannot be before start date." }, { status: 400 });
  }
  if (normalized.status === "published" && !normalized.startDate) {
    return NextResponse.json({ error: "Start date is required for published events." }, { status: 400 });
  }
  await adminDb
    .collection("events")
    .doc(params.id)
    .update({ ...normalized, updatedAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await adminDb.collection("events").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}
