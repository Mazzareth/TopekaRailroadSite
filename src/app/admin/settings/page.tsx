import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getSessionUser();
  // Extra guard: editors can see settings, but only admins manage editors.
  if (!user) redirect("/login?next=/admin/settings");
  const isAdmin = user.role === "admin";

  return (
    <section className="view">
      <h1>Site Settings</h1>
      <p className="lede">Club details, meeting information, and visual preferences for the public site.</p>

      <div className="settings-group">
        <span className="tagnum">── 01 ──</span>
        <h3>Contact Information</h3>
        <div className="row-2">
          <div className="field"><label>Email</label><input type="email" placeholder="club@example.org" /></div>
          <div className="field"><label>Phone</label><input type="text" placeholder="(785) xxx-xxxx" /></div>
        </div>
        <div className="field"><label>Street Address</label><input type="text" placeholder="Address line 1" /></div>
        <div className="row-3">
          <div className="field"><label>City</label><input type="text" defaultValue="Topeka" /></div>
          <div className="field"><label>State</label><input type="text" defaultValue="KS" /></div>
          <div className="field"><label>ZIP</label><input type="text" placeholder="zip" /></div>
        </div>
      </div>

      <div className="settings-group">
        <span className="tagnum">── 02 ──</span>
        <h3>Meeting Times</h3>
        <div className="row-2">
          <div className="field"><label>Regular Meetings</label><input type="text" placeholder="e.g. Every Tuesday, 7–9 pm" /></div>
          <div className="field"><label>Open Houses</label><input type="text" placeholder="e.g. First Saturday of the month" /></div>
        </div>
        <div className="row-2">
          <div className="field"><label>Work Sessions</label><input type="text" placeholder="e.g. Thursdays, drop-in" /></div>
          <div className="field"><label>Dues</label><input type="text" placeholder="$ / year" /></div>
        </div>
      </div>

      <div className="settings-group">
        <span className="tagnum">── 03 ──</span>
        <h3>Visual Preferences</h3>
        <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 18 }}>
          Color palette for the public site. These apply site-wide.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { v: "#f2e6cc", l: "Paper" },
            { v: "#2a1d10", l: "Ink" },
            { v: "#8a2a2b", l: "Burgundy" },
            { v: "#b38b3f", l: "Brass" },
            { v: "#2f4a2f", l: "Forest" },
          ].map((s) => (
            <label key={s.l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
              <input type="color" defaultValue={s.v} style={{ width: 44, height: 44, border: "1.5px solid var(--ink)", padding: 2, borderRadius: 2 }} />
              {s.l}
            </label>
          ))}
        </div>

        <div className="row-2" style={{ marginTop: 22 }}>
          <div className="field"><label>Scrolling train animation</label><select><option>On</option><option>Off</option></select></div>
          <div className="field"><label>Paper texture</label><select><option>On</option><option>Off</option></select></div>
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
              <tr><th>Name</th><th>Email</th><th>Role</th><th style={{ width: 120 }}>Actions</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.name || "—"}</td>
                <td>{user.email}</td>
                <td>Station Master</td>
                <td className="actions"><a href="#">Edit</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="save-bar">
        <span className="note">Settings apply to the public site on Save.</span>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost" style={{ color: "var(--cream)", borderColor: "var(--cream)" }}>Cancel</button>
          <button className="btn brass">Save All Settings</button>
        </div>
      </div>
    </section>
  );
}
