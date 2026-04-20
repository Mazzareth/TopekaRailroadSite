import Link from "next/link";

export default function AdminDashboard() {
  return (
    <section className="view">
      <h1>Good morning, Station Master.</h1>
      <p className="lede">A quick look at what&apos;s on the schedule and what needs your attention.</p>

      <div className="quick-cards">
        {[
          { label: "Upcoming Events", h: "Next up", detail: "Event name · Date" },
          { label: "Published Posts", h: "Last post", detail: "Post title" },
          { label: "Photos in Gallery", h: "Recent upload", detail: "Filename" },
          { label: "Active Members", h: "As of", detail: "Date" },
        ].map((c) => (
          <div key={c.label} className="quick">
            <div className="n"><span className="ph">#</span></div>
            <div className="l">{c.label}</div>
            <div className="h">{c.h}</div>
            <div style={{ fontSize: 15, marginTop: 4 }}><span className="ph">{c.detail}</span></div>
          </div>
        ))}
      </div>

      <div className="status-bar">
        <span className="dot-g" />
        <strong>Site is live and healthy.</strong>
        <span className="mono">Published <span className="ph">date/time</span></span>
        <Link href="/" style={{ marginLeft: "auto" }}>View public site →</Link>
      </div>

      <div style={{ marginTop: 36 }}>
        <div className="eyebrow">Quick Actions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
          <Link href="/admin/events" className="btn">+ New Event</Link>
          <Link href="/admin/blog" className="btn">+ New Blog Post</Link>
          <Link href="/admin/photos" className="btn brass">Upload Photos</Link>
          <Link href="/admin/copy" className="btn ghost">Edit Welcome Copy</Link>
        </div>
      </div>
    </section>
  );
}
