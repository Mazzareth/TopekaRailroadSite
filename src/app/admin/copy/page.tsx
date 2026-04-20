export default function AdminCopyPage() {
  return (
    <section className="view">
      <h1>Site Copy</h1>
      <p className="lede">Edit the words that live on the public site. Save to publish.</p>

      <div className="settings-group">
        <span className="tagnum">── Section 01 ──</span>
        <h3>Masthead</h3>
        <div className="row-2">
          <div className="field"><label>Club Name (display)</label><input type="text" defaultValue="Topeka Model Railroaders" /></div>
          <div className="field"><label>Tagline</label><input type="text" placeholder="a friendly gathering of hobbyists..." /></div>
        </div>
        <div className="row-2">
          <div className="field"><label>Volume No.</label><input type="text" placeholder="e.g. XII" /></div>
          <div className="field"><label>Established Year</label><input type="text" placeholder="e.g. 1978" /></div>
        </div>
      </div>

      <div className="settings-group">
        <span className="tagnum">── Section 02 ──</span>
        <h3>Welcome / About</h3>
        <div className="field"><label>Headline</label><input type="text" placeholder="Welcome to the Topeka Model Railroaders." /></div>
        <div className="field"><label>Paragraph 1</label><textarea placeholder="Warm intro — 2 to 4 sentences." /></div>
        <div className="field"><label>Paragraph 2</label><textarea placeholder="A note about scales, operations, or current projects." /></div>
      </div>

      <div className="settings-group">
        <span className="tagnum">── Section 03 ──</span>
        <h3>Membership Card</h3>
        <div className="row-3">
          <div className="field"><label>Active Members</label><input type="text" placeholder="Number" /></div>
          <div className="field"><label>Annual Dues</label><input type="text" placeholder="$ / year" /></div>
          <div className="field"><label>Age Range</label><input type="text" placeholder="e.g. 9 to 91" /></div>
        </div>
      </div>

      <div className="save-bar">
        <span className="note">Changes apply to the public site on Save.</span>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn ghost" style={{ color: "var(--cream)", borderColor: "var(--cream)" }}>Cancel</button>
          <button className="btn brass">Save All Changes</button>
        </div>
      </div>
    </section>
  );
}
