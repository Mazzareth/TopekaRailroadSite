import { NextResponse } from "next/server";
import { canAccessAdmin, getSessionUser } from "@/lib/auth";
import { uploadImageFile, UploadValidationError } from "@/lib/uploads";

export const runtime = "nodejs";

const FOLDERS = new Set(["blog", "gallery"]);

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function uploadErrorResponse(err: unknown) {
  const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";
  const message = err instanceof Error ? err.message : "";

  if (code === "404" || /bucket.*does not exist/i.test(message)) {
    return NextResponse.json(
      {
        error:
          "Firebase Storage is not set up for this project. Create a Storage bucket or set FIREBASE_STORAGE_BUCKET to an existing bucket.",
      },
      { status: 503 }
    );
  }

  if (code === "403" || /permission|forbidden/i.test(message)) {
    return NextResponse.json(
      {
        error:
          "The Firebase Admin service account does not have permission to write to Storage.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
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
    return uploadErrorResponse(err);
  }
}
