import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";
import { deleteUploadedFile } from "@/lib/uploads";

export const runtime = "nodejs";

type PhotoCreateBody = {
  url?: unknown;
  caption?: unknown;
  path?: unknown;
  originalName?: unknown;
  contentType?: unknown;
  size?: unknown;
};

function cleanOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function GET() {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snap = await adminDb.collection("photos").orderBy("order", "asc").get();
  const photos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(photos);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as PhotoCreateBody | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Photo payload must be valid JSON" }, { status: 400 });
  }

  const { url, caption, path, originalName, contentType, size } = body;
  if (typeof url !== "string" || !url.trim()) {
    await deleteUploadedFile(typeof path === "string" ? path : null).catch((err) => {
      console.error("photo upload cleanup failed after invalid metadata", err);
    });
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
  const cleanOriginalName = cleanOptionalString(originalName);
  if (cleanOriginalName) {
    photo.originalName = cleanOriginalName;
  }
  const cleanContentType = cleanOptionalString(contentType);
  if (cleanContentType) {
    photo.contentType = cleanContentType;
  }
  if (size !== undefined && size !== null && size !== "") {
    const numericSize = typeof size === "number" ? size : Number(size);
    if (!Number.isFinite(numericSize) || numericSize < 0) {
      await deleteUploadedFile(typeof path === "string" ? path : null).catch((err) => {
        console.error("photo upload cleanup failed after invalid metadata", err);
      });
      return NextResponse.json({ error: "Photo size must be a non-negative number" }, { status: 400 });
    }
    photo.size = numericSize;
  }

  try {
    const docRef = await adminDb.collection("photos").add(photo);
    return NextResponse.json({ id: docRef.id });
  } catch (err) {
    await deleteUploadedFile(typeof path === "string" ? path : null).catch((cleanupErr) => {
      console.error("photo upload cleanup failed after metadata save error", cleanupErr);
    });
    console.error("photo metadata save failed", err);
    return NextResponse.json({ error: "Photo was uploaded but could not be saved." }, { status: 500 });
  }
}
