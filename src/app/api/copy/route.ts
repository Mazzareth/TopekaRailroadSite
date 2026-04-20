import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

const ref = () => adminDb.collection("copy").doc("main");

export async function GET() {
  const snap = await ref().get();
  return NextResponse.json(snap.exists ? snap.data() : {});
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await ref().set(body, { merge: true });
  return NextResponse.json({ ok: true });
}
