"use client";

import { useState, useEffect } from "react";

type SettingsData = {
  contact: { email: string; phone: string; address: string; city: string; state: string; zip: string };
  meetings: { regular: string; openHouses: string; workSessions: string; dues: string };
  visual: { paper: string; ink: string; burgundy: string; brass: string; forest: string; trainAnimation: boolean; paperTexture: boolean };
};

const DEFAULTS: SettingsData = {
  contact: { email: "", phone: "", address: "", city: "Topeka", state: "KS", zip: "" },
  meetings: { regular: "", openHouses: "", workSessions: "", dues: "" },
  visual: { paper: "#f2e6cc", ink: "#2a1d10", burgundy: "#8a2a2b", brass: "#b38b3f", forest: "#2f4a2f", trainAnimation: true, paperTexture: true },
};

function merge(loaded: Partial<SettingsData>): SettingsData {
  return {
    contact: { ...DEFAULTS.contact, ...loaded.contact },
    meetings: { ...DEFAULTS.meetings, ...loaded.meetings },
    visual: { ...DEFAULTS.visual, ...loaded.visual },
  };
}

export function SettingsClient({ isAdmin, currentUserName, currentUserEmail }: {
  isAdmin: boolean;
  currentUserName: string | null;
  currentUserEmail: string | null;
}) {
  const [data, setData] = useState<SettingsData>(DEFAULTS);
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { setData(merge(d)); setStatus("idle"); })
      .catch(() => setStatus("idle"));
  }, []);

  function setContact(field: keyof SettingsData["contact"], value: string) {
    setData((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  }
  function setMeetings(field: keyof SettingsData["meetings"], value: string) {
    setData((prev) => ({ ...prev, meetings: { ...prev.meetings, [field]: value } }));
  }
  function setVisual(field: keyof SettingsData["visual"], value: string | boolean) {
    setData((prev) => ({ ...prev, visual: { ...prev.visual, [field]: value } }));
  }

  async function handleSave() {
    setStatus("saving");
    try {
      const r = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const c = data.contact;
  const m = data.meetings;
  const v = data.visual;
  const busy = status === "loading" || status === "saving";

  return (
    <section className="view">
      <h1>Site Settings</h1>
      <p className="lede">Club details, meeting information, and visual preferences for the public site.</p>

      {status === "loading" && (
        <p className="mono" style={{ color: "var(--ink-soft)", fontSize: 13, marginBottom: 24 }}>Loading…</p>
      )}

      <div className="settings-group">
        <span className="tagnum">── 01 ──</span>
        <h3>Contact Information</h3>
        <div className="row-2">
          <div className="field"><label>Email</label><input type="email" value={c.email} onChange={(e) => setContact("email", e.target.value)} placeholder="club@example.org" /></div>
          <div className="field"><label>Phone</label><input type="text" value={c.phone} onChange={(e) => setContact("phone", e.target.value)} placeholder="(785) xxx-xxxx" /></div>
        </div>
        <div className="field"><label>Street Address</label><input type="text" value={c.address} onChange={(e) => setContact("address", e.target.value)} placeholder="Address line 1" /></div>
        <div className="row-3">
          <div className="field"><label>City</label><input type="text" value={c.city} onChange={(e) => setContact("city", e.target.value)} /></div>
          <div className="field"><label>State</label><input type="text" value={c.state} onChange={(e) => setContact("state", e.target.value)} /></div>
          <div className="field"><label>ZIP</label><input type="text" value={c.zip} onChange={(e) => setContact("zip", e.target.value)} placeholder="zip" /></div>
        </div>
      </div>

      <div className="settings-group">
        <span className="tagnum">── 02 ──</span>
        <h3>Meeting Times</h3>
        <div className="row-2">
          <div className="field"><label>Regular Meetings</label><input type="text" value={m.regular} onChange={(e) => setMeetings("regular", e.target.value)} placeholder="e.g. Every Tuesday, 7–9 pm" /></div>
          <div className="field"><label>Open Houses</label><input type="text" value={m.openHouses} onChange={(e) => setMeetings("openHouses", e.target.value)} placeholder="e.g. First Saturday of the month" /></div>
        </div>
        <div className="row-2">
          <div className="field"><label>Work Sessions</label><input type="text" value={m.workSessions} onChange={(e) => setMeetings("workSessions", e.target.value)} placeholder="e.g. Thursdays, drop-in" /></div>
          <div className="field"><label>Dues</label><input type="text" value={m.dues} onChange={(e) => setMeetings("dues", e.target.value)} placeholder="$ / year" /></div>
        </div>
      </div>

      <div className="settings-group">
        <span className="tagnum">── 03 ──</span>
        <h3>Visual Preferences</h3>
        <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 18 }}>Color palette for the public site. These apply site-wide.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {(
            [
              { key: "paper" as const, label: "Paper" },
              { key: "ink" as const, label: "Ink" },
              { key: "burgundy" as const, label: "Burgundy" },
              { key: "brass" as const, label: "Brass" },
              { key: "forest" as const, label: "Forest" },
            ] as const
          ).map(({ key, label }) => (
            <label key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
              <input type="color" value={v[key] as string} onChange={(e) => setVisual(key, e.target.value)} style={{ width: 44, height: 44, border: "1.5px solid var(--ink)", padding: 2, borderRadius: 2 }} />
              {label}
            </label>
          ))}
        </div>
        <div className="row-2" style={{ marginTop: 22 }}>
          <div className="field">
            <label>Scrolling train animation</label>
            <select value={v.trainAnimation ? "On" : "Off"} onChange={(e) => setVisual("trainAnimation", e.target.value === "On")}>
              <option>On</option><option>Off</option>
            </select>
          </div>
          <div className="field">
            <label>Paper texture</label>
            <select value={v.paperTexture ? "On" : "Off"} onChange={(e) => setVisual("paperTexture", e.target.value === "On")}>
              <option>On</option><option>Off</option>
            </select>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="settings-group">
          <span className="tagnum">── 04 ──</span>
          <h3>Editors &amp; Access</h3>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 10 }}>
            Elevate an existing Firebase user with <code>npm run set-admin -- user@example.com admin</code>.
          </p>
          <table className="tbl" style={{ marginTop: 0 }}>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentUserName || "—"}</td>
                <td>{currentUserEmail}</td>
                <td>Station Master</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="save-bar">
        <span className="note" style={{ color: status === "saved" ? "var(--forest)" : status === "error" ? "var(--burgundy)" : undefined }}>
          {status === "saved" ? "✓ Settings saved." : status === "error" ? "Save failed — please try again." : "Settings apply to the public site on Save."}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost" style={{ color: "var(--cream)", borderColor: "var(--cream)" }} onClick={() => window.location.reload()} disabled={busy}>
            Discard
          </button>
          <button className="btn brass" onClick={handleSave} disabled={busy}>
            {status === "saving" ? "Saving…" : "Save All Settings"}
          </button>
        </div>
      </div>
    </section>
  );
}
