"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { DARK_VISUAL_DEFAULTS, normalizeVisualColors } from "@/lib/visualTheme";

type AddressType = "mailing" | "physical";

type ContactSettings = {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  addressType: AddressType;
  mailingAddressLines: string[];
  mapEmbedUrl: string;
  directionsUrl: string;
};

type VisualSettings = {
  paper: string;
  ink: string;
  burgundy: string;
  brass: string;
  forest: string;
  trainAnimation: boolean;
  paperTexture: boolean;
  logoUrl: string;
  logoPath: string;
  logoAlt: string;
};

type UploadedImage = { url: string; path: string; originalName?: string; contentType?: string; size?: number };

type SettingsData = {
  contact: ContactSettings;
  meetings: { regular: string; openHouses: string; workSessions: string; dues: string };
  footer: { mission: string; copyrightYear: string; addressLines: string[]; meetingSummary: string };
  visual: VisualSettings;
};

const CURRENT_YEAR = String(new Date().getFullYear());

const DEFAULTS: SettingsData = {
  contact: {
    email: "",
    phone: "",
    address: "",
    city: "Topeka",
    state: "KS",
    zip: "",
    addressType: "mailing",
    mailingAddressLines: [],
    mapEmbedUrl: "",
    directionsUrl: "",
  },
  meetings: { regular: "", openHouses: "", workSessions: "", dues: "" },
  footer: { mission: "", copyrightYear: CURRENT_YEAR, addressLines: [], meetingSummary: "" },
  visual: {
    paper: DARK_VISUAL_DEFAULTS.paper,
    ink: DARK_VISUAL_DEFAULTS.ink,
    burgundy: DARK_VISUAL_DEFAULTS.burgundy,
    brass: DARK_VISUAL_DEFAULTS.brass,
    forest: DARK_VISUAL_DEFAULTS.forest,
    trainAnimation: true,
    paperTexture: true,
    logoUrl: "",
    logoPath: "",
    logoAlt: "",
  },
};

function normalizeAddressType(value: unknown): AddressType {
  return value === "physical" ? "physical" : "mailing";
}

function cleanLines(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .filter((line): line is string => typeof line === "string")
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
}

function merge(loaded: Partial<SettingsData>): SettingsData {
  const rawContact: Partial<ContactSettings> = loaded.contact ?? {};
  const rawVisual = { ...DEFAULTS.visual, ...loaded.visual };
  const contact = {
    ...DEFAULTS.contact,
    ...rawContact,
    addressType: normalizeAddressType(rawContact.addressType),
    mailingAddressLines: cleanLines(rawContact.mailingAddressLines),
  };
  const loadedAddressLines = Array.isArray(loaded.footer?.addressLines) ? cleanLines(loaded.footer.addressLines) : undefined;
  const legacyAddressLines = contact.address
    ? [
        ...contact.address.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
        [contact.city, contact.state, contact.zip].filter(Boolean).join(", "),
      ].filter(Boolean)
    : [];

  return {
    contact,
    meetings: { ...DEFAULTS.meetings, ...loaded.meetings },
    footer: { ...DEFAULTS.footer, ...loaded.footer, addressLines: loadedAddressLines ?? legacyAddressLines },
    visual: { ...rawVisual, ...normalizeVisualColors(rawVisual) },
  };
}

async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null);
  return typeof body?.error === "string" ? body.error : fallback;
}

export function SettingsClient({ isAdmin, currentUserName, currentUserEmail }: {
  isAdmin: boolean;
  currentUserName: string | null;
  currentUserEmail: string | null;
}) {
  const [data, setData] = useState<SettingsData>(DEFAULTS);
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoNotice, setLogoNotice] = useState("");
  const [logoNoticeTone, setLogoNoticeTone] = useState<"success" | "warning" | "error">("success");
  const [grantEmail, setGrantEmail] = useState("");
  const [grantBusy, setGrantBusy] = useState(false);
  const [grantNotice, setGrantNotice] = useState("");
  const [grantNoticeTone, setGrantNoticeTone] = useState<"success" | "warning" | "error">("success");
  const logoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { setData(merge(d)); setStatus("idle"); })
      .catch(() => setStatus("idle"));
  }, []);

  function setContact(field: "email" | "phone" | "address" | "city" | "state" | "zip" | "mapEmbedUrl" | "directionsUrl", value: string) {
    setData((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  }
  function setAddressType(value: string) {
    setData((prev) => ({ ...prev, contact: { ...prev.contact, addressType: normalizeAddressType(value) } }));
  }
  function setMailingAddressText(value: string) {
    setData((prev) => ({ ...prev, contact: { ...prev.contact, mailingAddressLines: value.split(/\r?\n/) } }));
  }
  function setMeetings(field: keyof SettingsData["meetings"], value: string) {
    setData((prev) => ({ ...prev, meetings: { ...prev.meetings, [field]: value } }));
  }
  function setFooter(field: "mission" | "copyrightYear" | "meetingSummary", value: string) {
    setData((prev) => ({ ...prev, footer: { ...prev.footer, [field]: value } }));
  }
  function setFooterAddressLine(index: number, value: string) {
    setData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        addressLines: prev.footer.addressLines.map((line, i) => (i === index ? value : line)),
      },
    }));
  }
  function addFooterAddressLine() {
    setData((prev) => ({ ...prev, footer: { ...prev.footer, addressLines: [...prev.footer.addressLines, ""] } }));
  }
  function removeFooterAddressLine(index: number) {
    setData((prev) => ({
      ...prev,
      footer: { ...prev.footer, addressLines: prev.footer.addressLines.filter((_, i) => i !== index) },
    }));
  }
  function setVisual(field: keyof SettingsData["visual"], value: string | boolean) {
    setData((prev) => ({ ...prev, visual: { ...prev.visual, [field]: value } }));
  }
  async function handleLogoFile(file: File) {
    setLogoUploading(true);
    setLogoNotice("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "brand");
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      if (!res.ok) {
        throw new Error(await readError(res, "Logo upload failed."));
      }
      const uploaded = (await res.json()) as UploadedImage;
      setData((prev) => ({
        ...prev,
        visual: {
          ...prev.visual,
          logoUrl: uploaded.url,
          logoPath: uploaded.path,
          logoAlt: prev.visual.logoAlt || "Topeka Model Railroaders logo",
        },
      }));
      setLogoNoticeTone(uploaded.path.startsWith("brand/") ? "success" : "warning");
      setLogoNotice(uploaded.path.startsWith("brand/") ? "Logo uploaded. Save settings to publish." : "Logo uploaded, but the upload route returned a non-brand storage path.");
    } catch (err) {
      setLogoNoticeTone("error");
      setLogoNotice(err instanceof Error ? err.message : "Logo upload failed.");
    } finally {
      if (logoFileRef.current) logoFileRef.current.value = "";
      setLogoUploading(false);
    }
  }
  function removeLogo() {
    setData((prev) => ({ ...prev, visual: { ...prev.visual, logoUrl: "", logoPath: "" } }));
    setLogoNoticeTone("success");
    setLogoNotice("Logo removed. Save settings to publish.");
    if (logoFileRef.current) logoFileRef.current.value = "";
  }
  async function handleGrantAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = grantEmail.trim();
    if (!email) {
      setGrantNoticeTone("error");
      setGrantNotice("Enter an email address.");
      return;
    }

    setGrantBusy(true);
    setGrantNotice("");
    try {
      const res = await fetch("/api/admin/access-grants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "admin" }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(typeof body?.error === "string" ? body.error : "Unable to update access.");
      }

      setGrantEmail("");
      if (body.status === "pending") {
        setGrantNoticeTone("warning");
        setGrantNotice(`Pending admin grant saved for ${body.email}. It will apply once the account is created.`);
      } else {
        setGrantNoticeTone("success");
        setGrantNotice(`Admin access applied to ${body.email}. They must sign out and back in.`);
      }
    } catch (err) {
      setGrantNoticeTone("error");
      setGrantNotice(err instanceof Error ? err.message : "Unable to update access.");
    } finally {
      setGrantBusy(false);
    }
  }

  async function handleSave() {
    setStatus("saving");
    try {
      const payload: SettingsData = {
        ...data,
        contact: {
          ...data.contact,
          addressType: normalizeAddressType(data.contact.addressType),
          mailingAddressLines: cleanLines(data.contact.mailingAddressLines),
          mapEmbedUrl: data.contact.mapEmbedUrl.trim(),
          directionsUrl: data.contact.directionsUrl.trim(),
        },
        footer: {
          ...data.footer,
          addressLines: cleanLines(data.footer.addressLines),
        },
        visual: {
          ...data.visual,
          logoUrl: data.visual.logoUrl.trim(),
          logoPath: data.visual.logoPath.trim(),
          logoAlt: data.visual.logoAlt.trim(),
        },
      };
      const r = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error();
      setData(payload);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const c = data.contact;
  const m = data.meetings;
  const f = data.footer;
  const v = data.visual;
  const busy = status === "loading" || status === "saving" || logoUploading || grantBusy;
  const logoNoticeColor =
    logoNoticeTone === "error" ? "var(--burgundy)" : logoNoticeTone === "warning" ? "var(--brass)" : "var(--forest)";
  const grantNoticeColor =
    grantNoticeTone === "error" ? "var(--burgundy)" : grantNoticeTone === "warning" ? "var(--brass)" : "var(--forest)";

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
        <div className="row-2">
          <div className="field">
            <label>Address Type</label>
            <select value={c.addressType} onChange={(e) => setAddressType(e.target.value)}>
              <option value="mailing">Mailing</option>
              <option value="physical">Physical</option>
            </select>
          </div>
          <div className="field">
            <label>Directions URL</label>
            <input type="url" value={c.directionsUrl} onChange={(e) => setContact("directionsUrl", e.target.value)} placeholder="https://maps.google.com/..." />
          </div>
        </div>
        <div className="field">
          <label>Mailing Address Lines</label>
          <textarea value={c.mailingAddressLines.join("\n")} onChange={(e) => setMailingAddressText(e.target.value)} placeholder={"Topeka Model Railroaders\nP.O. Box 123\nTopeka, KS 66601"} />
        </div>
        <div className="field">
          <label>Map Embed URL</label>
          <input type="url" value={c.mapEmbedUrl} onChange={(e) => setContact("mapEmbedUrl", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
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
        <h3>Footer</h3>
        <div className="field">
          <label>Tagline / Mission</label>
          <textarea value={f.mission} onChange={(e) => setFooter("mission", e.target.value)} placeholder="Short club mission shown in the footer." />
        </div>
        <div className="row-2">
          <div className="field">
            <label>Copyright Year</label>
            <input type="text" value={f.copyrightYear} onChange={(e) => setFooter("copyrightYear", e.target.value)} placeholder={CURRENT_YEAR} />
          </div>
          <div className="field">
            <label>Footer Meeting Summary</label>
            <input type="text" value={f.meetingSummary} onChange={(e) => setFooter("meetingSummary", e.target.value)} placeholder="Meeting day/time" />
          </div>
        </div>
        <div className="field">
          <label>Footer Address Lines</label>
          <div className="address-lines">
            {f.addressLines.length === 0 ? (
              <p className="mono" style={{ color: "var(--ink-soft)", fontSize: 12, margin: 0 }}>
                No footer address lines yet.
              </p>
            ) : f.addressLines.map((line, index) => (
              <div key={index} className="address-line-row">
                <input type="text" value={line} onChange={(e) => setFooterAddressLine(index, e.target.value)} placeholder={`Address line ${index + 1}`} />
                <button type="button" className="btn ghost" onClick={() => removeFooterAddressLine(index)} disabled={busy} style={{ paddingInline: 14 }}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn ghost" onClick={addFooterAddressLine} disabled={busy} style={{ justifySelf: "start" }}>
              Add Address Line
            </button>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <span className="tagnum">── 04 ──</span>
        <h3>Visual Preferences</h3>
        <div className="row-2" style={{ alignItems: "start", marginBottom: 24 }}>
          <div className="field">
            <label>Logo Image</label>
            {v.logoUrl ? (
              <div style={{ border: "1.5px dashed var(--dashed)", background: "var(--cream)", padding: 18, display: "grid", gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.logoUrl} alt={v.logoAlt || "Site logo"} style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain", justifySelf: "start" }} />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" className="btn ghost" onClick={() => logoFileRef.current?.click()} disabled={busy}>
                    {logoUploading ? "Uploading…" : "Replace Logo"}
                  </button>
                  <button type="button" className="btn ghost" onClick={removeLogo} disabled={busy}>Remove Logo</button>
                </div>
              </div>
            ) : (
              <div
                className="uploader"
                style={{ padding: 24, cursor: "pointer" }}
                onClick={() => logoFileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleLogoFile(file); }}
              >
                <div className="big">{logoUploading ? "Uploading…" : "Drop logo here"}</div>
                <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--ink-soft)", textTransform: "uppercase" }}>
                  or click to browse · JPG, PNG · up to 10 MB
                </div>
              </div>
            )}
            <input ref={logoFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleLogoFile(file); }} />
            {logoNotice && <p className="mono" style={{ color: logoNoticeColor, fontSize: 12, margin: "10px 0 0" }}>{logoNotice}</p>}
          </div>
          <div>
            <div className="field">
              <label>Logo Alt Text</label>
              <input type="text" value={v.logoAlt} onChange={(e) => setVisual("logoAlt", e.target.value)} placeholder="Topeka Model Railroaders logo" />
            </div>
            <div className="field">
              <label>Logo URL</label>
              <input type="url" value={v.logoUrl} onChange={(e) => setVisual("logoUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="field">
              <label>Logo Storage Path</label>
              <input type="text" value={v.logoPath} onChange={(e) => setVisual("logoPath", e.target.value)} placeholder="brand/logo.png" />
            </div>
          </div>
        </div>
        <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 18 }}>Color palette for the public site. These apply site-wide.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {(
            [
              { key: "paper" as const, label: "Background" },
              { key: "ink" as const, label: "Text" },
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
          <span className="tagnum">── 05 ──</span>
          <h3>Editors &amp; Access</h3>
          <form onSubmit={handleGrantAdmin} style={{ marginTop: 14 }}>
            <div className="row-2" style={{ alignItems: "end" }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Admin Email</label>
                <input
                  type="email"
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                  placeholder="person@example.com"
                  disabled={busy}
                />
              </div>
              <button type="submit" className="btn brass" disabled={busy}>
                {grantBusy ? "Granting…" : "Grant Admin Access"}
              </button>
            </div>
            {grantNotice && (
              <p className="mono" style={{ color: grantNoticeColor, fontSize: 12, margin: "10px 0 0" }}>
                {grantNotice}
              </p>
            )}
          </form>
          <table className="tbl" style={{ marginTop: 18 }}>
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
