"use client";

import { useState, useEffect } from "react";
import { fmtEventDateRange, normalizeEventDates } from "@/lib/events";

type Event = {
  id?: string;
  title: string;
  tag: string;
  date: string;
  startDate?: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  status: "published" | "draft";
};

const BLANK: Omit<Event, "id"> = {
  title: "", tag: "Open House", date: "", startDate: "", endDate: "", startTime: "", endTime: "",
  location: "", description: "", status: "published",
};

async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null);
  return typeof body?.error === "string" ? body.error : fallback;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const r = await fetch("/api/events");
    const loaded = (await r.json()) as Event[];
    setEvents(loaded.map((event) => normalizeEventDates(event)));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startNew() { setEditing({ ...BLANK }); setMsg(""); }
  function startEdit(ev: Event) { setEditing(normalizeEventDates(ev)); setMsg(""); }

  async function save(status: "published" | "draft") {
    if (!editing) return;
    const payload = normalizeEventDates({ ...editing, status });
    if (payload.startDate && payload.endDate && payload.endDate < payload.startDate) {
      setMsg("End date cannot be before start date.");
      return;
    }
    setSaving(true);
    const r = editing.id
      ? await fetch(`/api/events/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (r.ok) {
      setMsg("✓ Saved");
      setEditing(null);
      load();
    } else {
      setMsg(await readError(r, "Save failed — please try again."));
    }
    setSaving(false);
  }

  async function del(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    load();
  }

  async function duplicate(ev: Event) {
    const { id, ...rest } = normalizeEventDates(ev);
    await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rest) });
    load();
  }

  function setField(key: keyof Omit<Event, "id">, value: string) {
    setEditing((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  return (
    <section className="view">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>Events &amp; Meetups</h1>
          <p className="lede">Add, edit, or retire entries from the timetable.</p>
        </div>
        <button className="btn" onClick={startNew}>+ New Event</button>
      </div>

      <div className="table-scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 150 }}>Date</th>
              <th>Title</th>
              <th>Location</th>
              <th style={{ width: 140 }}>Tag</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 170 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 24 }}>Loading…</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 24 }}>No events yet — add the first one.</td></tr>
            ) : events.map((ev) => (
              <tr key={ev.id}>
                <td className="mono">{fmtEventDateRange(ev, true)}</td>
                <td>{ev.title}</td>
                <td>{ev.location}</td>
                <td>{ev.tag}</td>
                <td>
                  <span className={`stamp ${ev.status === "draft" ? "brass" : "green"}`} style={{ fontSize: 9, padding: "2px 6px", transform: "rotate(-1deg)" }}>
                    {ev.status === "draft" ? "Draft" : "Published"}
                  </span>
                </td>
                <td className="actions">
                  <a href="#" onClick={(e) => { e.preventDefault(); startEdit(ev); }}>Edit</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); duplicate(ev); }}>Duplicate</a>
                  <a href="#" className="del" onClick={(e) => { e.preventDefault(); del(ev.id!); }}>Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="settings-group" style={{ marginTop: 40 }}>
          <span className="tagnum">── Editing: {editing.id ? (editing.title || "Event") : "New Event"} ──</span>
          <h3>Event Form</h3>
          <div className="row-2">
            <div className="field">
              <label>Title</label>
              <input type="text" value={editing.title} onChange={(e) => setField("title", e.target.value)} placeholder="Event title" />
            </div>
            <div className="field">
              <label>Tag</label>
              <select value={editing.tag} onChange={(e) => setField("tag", e.target.value)}>
                <option>Open House</option>
                <option>Members Only</option>
                <option>Public Show</option>
                <option>Swap Meet</option>
                <option>Work Session</option>
              </select>
            </div>
          </div>
          <div className="row-3">
            <div className="field"><label>Start Date</label><input type="date" value={editing.startDate || editing.date} onChange={(e) => { setField("startDate", e.target.value); setField("date", e.target.value); }} /></div>
            <div className="field"><label>End Date</label><input type="date" value={editing.endDate || editing.startDate || editing.date} onChange={(e) => setField("endDate", e.target.value)} /></div>
            <div className="field"><label>Start Time</label><input type="time" value={editing.startTime} onChange={(e) => setField("startTime", e.target.value)} /></div>
          </div>
          <div className="row-2">
            <div className="field"><label>End Time</label><input type="time" value={editing.endTime} onChange={(e) => setField("endTime", e.target.value)} /></div>
          </div>
          <div className="field">
            <label>Location</label>
            <input type="text" value={editing.location} onChange={(e) => setField("location", e.target.value)} placeholder="Address or venue name" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={editing.description} onChange={(e) => setField("description", e.target.value)} placeholder="1 to 3 sentences describing the event" />
            <div className="help">Keep it short — it sits in the public timetable.</div>
          </div>
          {msg && (
            <p style={{ fontFamily: "monospace", fontSize: 13, color: msg.startsWith("✓") ? "var(--forest)" : "var(--burgundy)" }}>{msg}</p>
          )}
          <div className="toolbar">
            <button className="btn" onClick={() => save("published")} disabled={saving}>
              {saving ? "Saving…" : "Save & Publish"}
            </button>
            <button className="btn ghost" onClick={() => save("draft")} disabled={saving}>Save as Draft</button>
            <button className="btn ghost" onClick={() => { setEditing(null); setMsg(""); }}>Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}
