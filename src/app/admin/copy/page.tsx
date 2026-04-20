"use client";

import { useState, useEffect } from "react";

type CopyData = {
  masthead: { clubName: string; tagline: string; volume: string; established: string };
  about: { headline: string; para1: string; para2: string };
  membership: { activeMembers: string; dues: string; ageRange: string };
};

const DEFAULTS: CopyData = {
  masthead: { clubName: "Topeka Model Railroaders", tagline: "", volume: "", established: "" },
  about: { headline: "", para1: "", para2: "" },
  membership: { activeMembers: "", dues: "", ageRange: "" },
};

function merge(loaded: Partial<CopyData>): CopyData {
  return {
    masthead: { ...DEFAULTS.masthead, ...loaded.masthead },
    about: { ...DEFAULTS.about, ...loaded.about },
    membership: { ...DEFAULTS.membership, ...loaded.membership },
  };
}

export default function AdminCopyPage() {
  const [data, setData] = useState<CopyData>(DEFAULTS);
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    fetch("/api/copy")
      .then((r) => r.json())
      .then((d) => { setData(merge(d)); setStatus("idle"); })
      .catch(() => setStatus("idle"));
  }, []);

  function set<S extends keyof CopyData>(section: S, field: keyof CopyData[S], value: string) {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }

  async function handleSave() {
    setStatus("saving");
    try {
      const r = await fetch("/api/copy", {
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

  const m = data.masthead;
  const a = data.about;
  const mem = data.membership;
  const busy = status === "loading" || status === "saving";

  return (
    <section className="view">
      <h1>Site Copy</h1>
      <p className="lede">Edit the words that live on the public site. Save to publish.</p>

      {status === "loading" && (
        <p className="mono" style={{ color: "var(--ink-soft)", fontSize: 13, marginBottom: 24 }}>Loading…</p>
      )}

      <div className="settings-group">
        <span className="tagnum">── Section 01 ──</span>
        <h3>Masthead</h3>
        <div className="row-2">
          <div className="field">
            <label>Club Name (display)</label>
            <input type="text" value={m.clubName} onChange={(e) => set("masthead", "clubName", e.target.value)} />
          </div>
          <div className="field">
            <label>Tagline</label>
            <input type="text" value={m.tagline} onChange={(e) => set("masthead", "tagline", e.target.value)} placeholder="a friendly gathering of hobbyists..." />
          </div>
        </div>
        <div className="row-2">
          <div className="field">
            <label>Volume No.</label>
            <input type="text" value={m.volume} onChange={(e) => set("masthead", "volume", e.target.value)} placeholder="e.g. XII" />
          </div>
          <div className="field">
            <label>Established Year</label>
            <input type="text" value={m.established} onChange={(e) => set("masthead", "established", e.target.value)} placeholder="e.g. 1978" />
          </div>
        </div>
      </div>

      <div className="settings-group">
        <span className="tagnum">── Section 02 ──</span>
        <h3>Welcome / About</h3>
        <div className="field">
          <label>Headline</label>
          <input type="text" value={a.headline} onChange={(e) => set("about", "headline", e.target.value)} placeholder="Welcome to the Topeka Model Railroaders." />
        </div>
        <div className="field">
          <label>Paragraph 1</label>
          <textarea value={a.para1} onChange={(e) => set("about", "para1", e.target.value)} placeholder="Warm intro — 2 to 4 sentences." />
        </div>
        <div className="field">
          <label>Paragraph 2</label>
          <textarea value={a.para2} onChange={(e) => set("about", "para2", e.target.value)} placeholder="A note about scales, operations, or current projects." />
        </div>
      </div>

      <div className="settings-group">
        <span className="tagnum">── Section 03 ──</span>
        <h3>Membership Card</h3>
        <div className="row-3">
          <div className="field">
            <label>Active Members</label>
            <input type="text" value={mem.activeMembers} onChange={(e) => set("membership", "activeMembers", e.target.value)} placeholder="Number" />
          </div>
          <div className="field">
            <label>Annual Dues</label>
            <input type="text" value={mem.dues} onChange={(e) => set("membership", "dues", e.target.value)} placeholder="$ / year" />
          </div>
          <div className="field">
            <label>Age Range</label>
            <input type="text" value={mem.ageRange} onChange={(e) => set("membership", "ageRange", e.target.value)} placeholder="e.g. 9 to 91" />
          </div>
        </div>
      </div>

      <div className="save-bar">
        <span className="note" style={{ color: status === "saved" ? "var(--forest)" : status === "error" ? "var(--burgundy)" : undefined }}>
          {status === "saved" ? "✓ Saved — live on the public site." : status === "error" ? "Save failed — please try again." : "Changes apply to the public site on Save."}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost" style={{ color: "var(--cream)", borderColor: "var(--cream)" }} onClick={() => window.location.reload()} disabled={busy}>
            Discard
          </button>
          <button className="btn brass" onClick={handleSave} disabled={busy}>
            {status === "saving" ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
