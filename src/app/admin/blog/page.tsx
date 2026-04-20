export default function AdminBlogPage() {
  return (
    <section className="view">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>Blog &amp; Dispatches</h1>
          <p className="lede">Post updates, build logs, and meeting recaps. Drafts stay private until you publish.</p>
        </div>
        <button className="btn">+ New Post</button>
      </div>

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
          {["Published", "Draft", "Published"].map((s, i) => (
            <tr key={i}>
              <td className="mono"><span className="ph">Date</span></td>
              <td><span className="ph">Post title</span></td>
              <td><span className="ph">Author</span></td>
              <td><span className="ph">Category</span></td>
              <td>
                <span className={`stamp ${s === "Draft" ? "brass" : "green"}`} style={{ fontSize: 9, padding: "2px 6px", transform: "rotate(-1deg)" }}>
                  {s}
                </span>
              </td>
              <td className="actions"><a href="#">Edit</a><a href="#">View</a><a href="#" className="del">Delete</a></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="settings-group" style={{ marginTop: 40 }}>
        <span className="tagnum">── Editing: New Post ──</span>
        <h3>Post Editor</h3>
        <div className="row-2">
          <div className="field"><label>Title</label><input type="text" placeholder="Post title" /></div>
          <div className="field"><label>Author</label><input type="text" placeholder="Author name" /></div>
        </div>
        <div className="row-3">
          <div className="field"><label>Publish Date</label><input type="date" /></div>
          <div className="field">
            <label>Category</label>
            <select><option>Build Log</option><option>Meeting Recap</option><option>Show Report</option><option>Club News</option><option>Other</option></select>
          </div>
          <div className="field">
            <label>Feature on Home</label>
            <select><option>No</option><option>Yes — set as featured</option></select>
          </div>
        </div>
        <div className="field"><label>Excerpt</label><input type="text" placeholder="1 to 2 line teaser" /></div>
        <div className="field">
          <label>Body</label>
          <textarea style={{ minHeight: 220 }} placeholder="Write the full post here. Markdown friendly." />
          <div className="help">Supports plain text, headings, lists, and image placeholders.</div>
        </div>
        <div className="field">
          <label>Header Image</label>
          <div className="uploader" style={{ padding: 24 }}>
            <div className="big">Drop an image here</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: "var(--ink-soft)", textTransform: "uppercase" }}>
              or click to browse · JPG, PNG · up to 10 MB
            </div>
          </div>
        </div>
        <div className="toolbar">
          <button className="btn">Publish Post</button>
          <button className="btn ghost">Save as Draft</button>
          <button className="btn ghost">Preview</button>
        </div>
      </div>
    </section>
  );
}
