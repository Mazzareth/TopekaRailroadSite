import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

function badRequest(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return badRequest("Request body must be valid JSON.");
  }

  const ids = (body as { ids?: unknown }).ids;
  if (!Array.isArray(ids)) {
    return badRequest("Board member IDs must be provided as an array.");
  }

  const cleanIds: string[] = [];
  for (const id of ids) {
    if (typeof id !== "string" || !id.trim()) {
      return badRequest("Every board member ID must be a non-empty string.");
    }
    cleanIds.push(id.trim());
  }

  const uniqueIds = new Set(cleanIds);
  if (uniqueIds.size !== cleanIds.length) {
    return badRequest("Board member IDs must not contain duplicates.");
  }

  const collection = adminDb.collection("boardMembers");
  const currentSnap = await collection.get();
  const currentIds = new Set(currentSnap.docs.map((doc) => doc.id));
  const unknownIds = cleanIds.filter((id) => !currentIds.has(id));
  if (unknownIds.length) {
    return badRequest(`Unknown board member ID${unknownIds.length === 1 ? "" : "s"}: ${unknownIds.join(", ")}.`);
  }

  const submittedIds = new Set(cleanIds);
  const missingIds = currentSnap.docs.map((doc) => doc.id).filter((id) => !submittedIds.has(id));
  if (missingIds.length) {
    return badRequest("Board member list changed before the order could be saved. Refresh and try again.", 409);
  }

  const batch = adminDb.batch();
  cleanIds.forEach((id, idx) => {
    batch.update(collection.doc(id), { order: idx + 1 });
  });
  await batch.commit();

  return NextResponse.json({ ok: true });
}
