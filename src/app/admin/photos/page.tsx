"use client";

import { useState, useEffect, useRef } from "react";

type Photo = {
  id: string;
  url: string;
  caption: string;
  order: number;
  path?: string;
  originalName?: string;
  contentType?: string;
  size?: number;
};
type UploadedImage = { url: string; path: string; originalName?: string; contentType?: string; size?: number };

async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null);
  return typeof body?.error === "string" ? body.error : fallback;
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [savingCaptionId, setSavingCaptionId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dragId = useRef<string | null>(null);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/photos");
    setPhotos(await r.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function uploadPhoto(file: File): Promise<void> {
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("folder", "gallery");

    const uploadRes = await fetch("/api/uploads", {
      method: "POST",
      body: uploadForm,
    });
    if (!uploadRes.ok) {
      throw new Error(await readError(uploadRes, "Image upload failed."));
    }

    const uploaded = (await uploadRes.json()) as UploadedImage;
    const saveRes = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: uploaded.url,
        path: uploaded.path,
        originalName: uploaded.originalName ?? file.name,
        contentType: uploaded.contentType ?? file.type,
        size: typeof uploaded.size === "number" ? uploaded.size : file.size,
      }),
    });
    if (!saveRes.ok) {
      throw new Error(await readError(saveRes, "Photo was uploaded but could not be saved."));
    }
  }

  async function handleFiles(files: FileList) {
    setUploading(true);
    setMsg("");
    const errors: string[] = [];

    for (const file of Array.from(files)) {
      try {
        await uploadPhoto(file);
      } catch (err) {
        errors.push(err instanceof Error ? err.message : "One or more uploads failed.");
      }
    }

    if (fileRef.current) fileRef.current.value = "";
    setUploading(false);
    if (errors.length) {
      setMsg(errors[0]);
    }
    load();
  }

  async function del(id: string) {
    if (!confirm("Remove this photo?")) return;
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    load();
  }

  function setCaption(id: string, caption: string) {
    setPhotos((prev) => prev.map((photo) => photo.id === id ? { ...photo, caption } : photo));
  }

  async function saveCaption(photo: Photo) {
    setMsg("");
    setSavingCaptionId(photo.id);
    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: photo.caption ?? "" }),
      });
      if (!res.ok) {
        setMsg(await readError(res, "Could not save the photo caption."));
      }
    } catch {
      setMsg("Could not save the photo caption.");
    } finally {
      setSavingCaptionId(null);
    }
  }

  function onDragStart(id: string) { dragId.current = id; }

  async function saveOrder(reordered: Photo[], previous: Photo[]) {
    setMsg("");
    setOrdering(true);
    setPhotos(reordered);
    try {
      const res = await fetch("/api/photos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((p) => p.id) }),
      });
      if (!res.ok) {
        setPhotos(previous);
        setMsg(await readError(res, "Could not save the new photo order."));
      }
    } catch {
      setPhotos(previous);
      setMsg("Could not save the new photo order.");
    } finally {
      setOrdering(false);
    }
  }

  async function onDrop(targetId: string) {
    if (ordering) return;
    if (!dragId.current || dragId.current === targetId) return;
    const fromIdx = photos.findIndex((p) => p.id === dragId.current);
    const toIdx = photos.findIndex((p) => p.id === targetId);
    dragId.current = null;
    if (fromIdx < 0 || toIdx < 0) {
      setMsg("Could not reorder photos. Refresh and try again.");
      return;
    }
    const reordered = [...photos];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    await saveOrder(reordered, photos);
  }

  async function movePhoto(id: string, direction: -1 | 1) {
    const fromIdx = photos.findIndex((p) => p.id === id);
    const toIdx = fromIdx + direction;
    if (fromIdx < 0 || toIdx < 0 || toIdx >= photos.length) return;

    const reordered = [...photos];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    await saveOrder(reordered, photos);
  }

  return (
    <section className="view">
      <h1>Photo Gallery</h1>
      <p className="lede">Upload layout shots, show photos, and workbench snaps. Drag to reorder.</p>

      <div
        className="uploader"
        style={{ marginTop: 22, cursor: "pointer" }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
      >
        <div className="big">{uploading ? "Uploading…" : "Drop photos here to upload"}</div>
        <div style={{ marginTop: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
          or click to browse · JPG, PNG · up to 10 MB each
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); }} />
      </div>

      {msg && <p style={{ fontFamily: "monospace", fontSize: 13, color: "var(--burgundy)", marginTop: 12 }}>{msg}</p>}

      <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="eyebrow">Current Gallery · {loading ? "…" : photos.length} photos</div>
        <div className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
          Drag to reorder · Move buttons work on touch screens
        </div>
      </div>

      {loading ? (
        <p className="mono" style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: 16 }}>Loading…</p>
      ) : (
        <div className="grid-photos">
          {photos.map((p, index) => (
            <div
              key={p.id}
              className="cell"
              draggable={!ordering}
              onDragStart={() => onDragStart(p.id)}
              onDragEnd={() => { dragId.current = null; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(p.id)}
            >
              <div className="photo-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.caption || p.originalName || "Gallery photo"} />
                <button className="del" onClick={() => del(p.id)} aria-label="Remove photo">×</button>
              </div>
              <div className="photo-reorder">
                <button type="button" onClick={() => movePhoto(p.id, -1)} disabled={ordering || index === 0}>Move Up</button>
                <button type="button" onClick={() => movePhoto(p.id, 1)} disabled={ordering || index === photos.length - 1}>Move Down</button>
              </div>
              <div className="photo-caption-editor">
                <label htmlFor={`caption-${p.id}`}>Caption</label>
                <textarea
                  id={`caption-${p.id}`}
                  value={p.caption ?? ""}
                  onChange={(e) => setCaption(p.id, e.target.value)}
                  placeholder="Short caption for the public gallery"
                  rows={3}
                />
                <button type="button" onClick={() => saveCaption(p)} disabled={savingCaptionId === p.id}>
                  {savingCaptionId === p.id ? "Saving…" : "Save Caption"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
