export default function AdminPhotosPage() {
  return (
    <section className="view">
      <h1>Photo Gallery</h1>
      <p className="lede">Upload layout shots, show photos, and workbench snaps. Drag to reorder.</p>

      <div className="uploader" style={{ marginTop: 22 }}>
        <div className="big">Drop photos here to upload</div>
        <div style={{ marginTop: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
          or <a href="#">browse your computer</a> · JPG, PNG · up to 10 MB each
        </div>
      </div>

      <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="eyebrow">Current Gallery · <span className="ph">#</span> photos</div>
        <div className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
          Drag to reorder · Click × to remove
        </div>
      </div>

      <div className="grid-photos">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="cell">
            <div className="ph-img">PHOTO {String(i + 1).padStart(2, "0")}</div>
            <button className="del">×</button>
          </div>
        ))}
      </div>
    </section>
  );
}
