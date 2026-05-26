import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";
import { normalizeEventDates } from "@/lib/events";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snap = await adminDb.collection("events").orderBy("date", "asc").get();
  const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(events);
}

export async function POST(req: Request) {
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
  const docRef = await adminDb.collection("events").add({
    ...normalized,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return NextResponse.json({ id: docRef.id });
}
