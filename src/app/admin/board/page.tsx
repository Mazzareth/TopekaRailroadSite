"use client";

import { useEffect, useRef, useState } from "react";

type BoardMember = {
  id?: string;
  name: string;
  title: string;
  order: number;
  photoUrl: string;
  photoPath?: string;
  active: boolean;
};

type UploadedImage = { url: string; path: string };

const BLANK: Omit<BoardMember, "id"> = {
  name: "",
  title: "",
  order: 0,
  photoUrl: "",
  photoPath: "",
  active: true,
};

async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null);
  return typeof body?.error === "string" ? body.error : fallback;
}

export default function AdminBoardPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BoardMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/board-members");
    setMembers(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setEditing({ ...BLANK });
    setMsg("");
  }

  function startEdit(member: BoardMember) {
    setEditing({ ...member, active: member.active !== false });
    setMsg("");
  }

  function setField(key: keyof Omit<BoardMember, "id" | "order">, value: string | boolean) {
    setEditing((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setMsg("");
    const payload = {
      name: editing.name,
      title: editing.title,
      photoUrl: editing.photoUrl,
      photoPath: editing.photoPath,
      active: editing.active,
    };
    const res = editing.id
      ? await fetch(`/api/board-members/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/board-members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

    if (res.ok) {
      setMsg("✓ Saved");
      setEditing(null);
      load();
    } else {
      setMsg(await readError(res, "Save failed — please try again."));
    }
    setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("Delete this board member? This cannot be undone.")) return;
    await fetch(`/api/board-members/${id}`, { method: "DELETE" });
    load();
  }

  async function handleImageFile(file: File) {
    if (!editing) return;
    setUploading(true);
    setMsg("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "board");
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      if (!res.ok) {
        throw new Error(await readError(res, "Image upload failed."));
      }
      const uploaded = (await res.json()) as UploadedImage;
      setEditing((prev) => prev ? { ...prev, photoUrl: uploaded.url, photoPath: uploaded.path } : prev);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
      setUploading(false);
    }
  }

  async function saveOrder(reordered: BoardMember[], previous: BoardMember[]) {
    setOrdering(true);
    setMembers(reordered);
    try {
      const res = await fetch("/api/board-members/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((member) => member.id) }),
      });
      if (!res.ok) {
        setMembers(previous);
        setMsg(await readError(res, "Could not save board member order."));
      }
    } catch {
      setMembers(previous);
      setMsg("Could not save board member order.");
    } finally {
      setOrdering(false);
    }
  }

  async function moveMember(id: string, direction: -1 | 1) {
    const fromIdx = members.findIndex((member) => member.id === id);
    const toIdx = fromIdx + direction;
    if (fromIdx < 0 || toIdx < 0 || toIdx >= members.length) return;
    const reordered = [...members];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    await saveOrder(reordered, members);
  }

  return (
    <section className="view">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>Board Members</h1>
          <p className="lede">Add names, titles, photos, and display order for the public board list.</p>
        </div>
        <button className="btn" onClick={startNew}>+ Add Board Member</button>
      </div>

      <div className="table-scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 100 }}>Photo</th>
              <th>Name</th>
              <th>Title</th>
              <th style={{ width: 100 }}>Status</th>
              <th style={{ width: 210 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 24 }}>Loading…</td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 24 }}>No board members yet — add the first one.</td></tr>
            ) : members.map((member, index) => (
              <tr key={member.id}>
                <td>
                  {member.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photoUrl} alt={member.name} className="board-table-photo" />
                  ) : (
                    <span className="ph">Photo</span>
                  )}
                </td>
                <td>{member.name}</td>
                <td>{member.title}</td>
                <td>
                  <span className={`stamp ${member.active === false ? "brass" : "green"}`} style={{ fontSize: 9, padding: "2px 6px", transform: "rotate(-1deg)" }}>
                    {member.active === false ? "Hidden" : "Active"}
                  </span>
                </td>
                <td className="actions">
                  <button type="button" onClick={() => moveMember(member.id!, -1)} disabled={ordering || index === 0}>Up</button>
                  <button type="button" onClick={() => moveMember(member.id!, 1)} disabled={ordering || index === members.length - 1}>Down</button>
                  <a href="#" onClick={(e) => { e.preventDefault(); startEdit(member); }}>Edit</a>
                  <a href="#" className="del" onClick={(e) => { e.preventDefault(); del(member.id!); }}>Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="settings-group" style={{ marginTop: 40 }}>
          <span className="tagnum">── Editing: {editing.id ? (editing.name || "Board Member") : "New Board Member"} ──</span>
          <h3>Board Member</h3>
          <div className="row-2">
            <div className="field">
              <label>Name</label>
              <input type="text" value={editing.name} onChange={(e) => setField("name", e.target.value)} placeholder="Stanley Spice" />
            </div>
            <div className="field">
              <label>Title</label>
              <input type="text" value={editing.title} onChange={(e) => setField("title", e.target.value)} placeholder="TREASURER" />
            </div>
          </div>
          <div className="row-2">
            <div className="field">
              <label>Status</label>
              <select value={editing.active ? "active" : "hidden"} onChange={(e) => setField("active", e.target.value === "active")}>
                <option value="active">Active on public site</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div className="field">
              <label>Photo</label>
              {editing.photoUrl ? (
                <div className="board-photo-editor">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editing.photoUrl} alt={editing.name || "Board member"} />
                  <button type="button" className="btn ghost" onClick={() => setEditing((prev) => prev ? { ...prev, photoUrl: "", photoPath: "" } : prev)}>Remove Photo</button>
                </div>
              ) : (
                <div className="uploader" style={{ padding: 24, cursor: "pointer" }} onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleImageFile(file); }}>
                  <div className="big">{uploading ? "Uploading…" : "Drop a headshot here"}</div>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--ink-soft)", textTransform: "uppercase" }}>
                    or click to browse · JPG, PNG · up to 10 MB
                  </div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageFile(file); }} />
            </div>
          </div>

          {msg && <p style={{ fontFamily: "monospace", fontSize: 13, color: msg.startsWith("✓") ? "var(--forest)" : "var(--burgundy)" }}>{msg}</p>}
          <div className="toolbar">
            <button className="btn" onClick={save} disabled={saving || uploading}>{saving ? "Saving…" : "Save Board Member"}</button>
            <button className="btn ghost" onClick={() => { setEditing(null); setMsg(""); }} disabled={saving || uploading}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}
