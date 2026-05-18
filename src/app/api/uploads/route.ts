import { NextResponse } from "next/server";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";
import { uploadImageFile, UploadValidationError } from "@/lib/uploads";

export const runtime = "nodejs";

const FOLDERS = new Set(["blog", "gallery"]);

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const requestedFolder = form.get("folder");
  const folder =
    typeof requestedFolder === "string" && FOLDERS.has(requestedFolder)
      ? (requestedFolder as "blog" | "gallery")
      : "gallery";

  if (!isUploadFile(file)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  try {
    const uploaded = await uploadImageFile(file, folder);
    return NextResponse.json(uploaded);
  } catch (err) {
    if (err instanceof UploadValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    console.error("image upload failed", err);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
