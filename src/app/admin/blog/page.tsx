"use client";

import { useState, useEffect, useRef } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";

type Post = {
  id?: string;
  title: string;
  author: string;
  publishDate: string;
  category: string;
  featured: boolean;
  excerpt: string;
  body: string;
  bodyHtml?: string;
  headerImageUrl: string;
  status: "published" | "draft";
};

const BLANK: Omit<Post, "id"> = {
  title: "", author: "", publishDate: "", category: "Build Log",
  featured: false, excerpt: "", body: "", bodyHtml: "", headerImageUrl: "", status: "published",
};

type UploadedImage = { url: string };

async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null);
  return typeof body?.error === "string" ? body.error : fallback;
}

const fmtDate = (d: string) => {
  if (!d) return "—";
  const dt = new Date(d + "T12:00:00");
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/posts");
    setPosts(await r.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startNew() { setEditing({ ...BLANK }); setMsg(""); }
  function startEdit(p: Post) { setEditing({ ...p, body: p.body ?? "", bodyHtml: p.bodyHtml ?? "" }); setMsg(""); }

  async function save(status: "published" | "draft") {
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing, status };
    const r = editing.id
      ? await fetch(`/api/posts/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (r.ok) {
      setMsg("✓ Saved");
      setEditing(null);
      load();
    } else {
      setMsg("Save failed — please try again.");
    }
    setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    load();
  }

  async function handleImageFile(file: File) {
    if (!editing) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "blog");

      const uploadRes = await fetch("/api/uploads", {
        method: "POST",
        body: form,
      });
      if (!uploadRes.ok) {
        throw new Error(await readError(uploadRes, "Image upload failed."));
      }

      const uploaded = (await uploadRes.json()) as UploadedImage;
      setEditing((prev) => prev ? { ...prev, headerImageUrl: uploaded.url } : prev);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
      setUploading(false);
    }
  }

  function setField(key: keyof Omit<Post, "id">, value: string | boolean) {
    setEditing((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  function setBody(bodyHtml: string, body: string) {
    setEditing((prev) => prev ? { ...prev, bodyHtml, body } : prev);
  }

  return (
    <section className="view">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>Blog &amp; Dispatches</h1>
          <p className="lede">Post updates, build logs, and meeting recaps. Drafts stay private until you publish.</p>
        </div>
        <button className="btn" onClick={startNew}>+ New Post</button>
      </div>

      <div className="table-scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 120 }}>Date</th>
              <th>Title</th>
              <th style={{ width: 140 }}>Author</th>
              <th style={{ width: 130 }}>Category</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 170 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 24 }}>Loading…</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 24 }}>No posts yet — write the first one.</td></tr>
            ) : posts.map((p) => (
              <tr key={p.id}>
                <td className="mono">{fmtDate(p.publishDate)}</td>
                <td>{p.title}{p.featured && <span className="stamp green" style={{ marginLeft: 8, fontSize: 8, padding: "1px 5px" }}>Featured</span>}</td>
                <td>{p.author}</td>
                <td>{p.category}</td>
                <td>
                  <span className={`stamp ${p.status === "draft" ? "brass" : "green"}`} style={{ fontSize: 9, padding: "2px 6px", transform: "rotate(-1deg)" }}>
                    {p.status === "draft" ? "Draft" : "Published"}
                  </span>
                </td>
                <td className="actions">
                  <a href="#" onClick={(e) => { e.preventDefault(); startEdit(p); }}>Edit</a>
                  <a href="#" className="del" onClick={(e) => { e.preventDefault(); del(p.id!); }}>Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="settings-group" style={{ marginTop: 40 }}>
          <span className="tagnum">── Editing: {editing.id ? (editing.title || "Post") : "New Post"} ──</span>
          <h3>Post Editor</h3>
          <div className="row-2">
            <div className="field">
              <label>Title</label>
              <input type="text" value={editing.title} onChange={(e) => setField("title", e.target.value)} placeholder="Post title" />
            </div>
            <div className="field">
              <label>Author</label>
              <input type="text" value={editing.author} onChange={(e) => setField("author", e.target.value)} placeholder="Author name" />
            </div>
          </div>
          <div className="row-3">
            <div className="field">
              <label>Publish Date</label>
              <input type="date" value={editing.publishDate} onChange={(e) => setField("publishDate", e.target.value)} />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={editing.category} onChange={(e) => setField("category", e.target.value)}>
                <option>Build Log</option>
                <option>Meeting Recap</option>
                <option>Show Report</option>
                <option>Club News</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label>Feature on Home</label>
              <select value={editing.featured ? "yes" : "no"} onChange={(e) => setField("featured", e.target.value === "yes")}>
                <option value="no">No</option>
                <option value="yes">Yes — set as featured</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Excerpt</label>
            <input type="text" value={editing.excerpt} onChange={(e) => setField("excerpt", e.target.value)} placeholder="1 to 2 line teaser" />
          </div>
          <div className="field">
            <label>Body</label>
            <RichTextEditor
              value={editing.bodyHtml ?? ""}
              legacyText={editing.body}
              disabled={saving}
              onChange={setBody}
              onError={setMsg}
            />
            <div className="help">Use the toolbar for headings, lists, links, images, and styled text.</div>
          </div>
          <div className="field">
            <label>Header Image</label>
            {editing.headerImageUrl ? (
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editing.headerImageUrl} alt="Header" style={{ width: 120, height: 80, objectFit: "cover", border: "1.5px solid var(--ink)" }} />
                <button className="btn ghost" onClick={() => setField("headerImageUrl", "")}>Remove</button>
              </div>
            ) : (
              <div
                className="uploader"
                style={{ padding: 24, cursor: "pointer" }}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f); }}
              >
                <div className="big">{uploading ? "Uploading…" : "Drop an image here"}</div>
                <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--ink-soft)", textTransform: "uppercase" }}>
                  or click to browse · JPG, PNG · up to 10 MB
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
              </div>
            )}
          </div>
          {msg && (
            <p style={{ fontFamily: "monospace", fontSize: 13, color: msg.startsWith("✓") ? "var(--forest)" : "var(--burgundy)" }}>{msg}</p>
          )}
          <div className="toolbar">
            <button className="btn" onClick={() => save("published")} disabled={saving || uploading}>
              {saving ? "Saving…" : "Publish Post"}
            </button>
            <button className="btn ghost" onClick={() => save("draft")} disabled={saving || uploading}>Save as Draft</button>
            <button className="btn ghost" onClick={() => { setEditing(null); setMsg(""); }}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}
