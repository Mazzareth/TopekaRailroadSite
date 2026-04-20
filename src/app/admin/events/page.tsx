export default function AdminEventsPage() {
  return (
    <section className="view">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>Events &amp; Meetups</h1>
          <p className="lede">Add, edit, or retire entries from the timetable.</p>
        </div>
        <button className="btn">+ New Event</button>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: 110 }}>Date</th>
            <th>Title</th>
            <th>Location</th>
            <th style={{ width: 140 }}>Tag</th>
            <th style={{ width: 110 }}>Status</th>
            <th style={{ width: 170 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {["Published", "Draft", "Published"].map((s, i) => (
            <tr key={i}>
              <td className="mono"><span className="ph">MMM DD</span></td>
              <td><span className="ph">Event title</span></td>
              <td><span className="ph">Where</span></td>
              <td><span className="ph">{["Open House", "Members", "Swap Meet"][i]}</span></td>
              <td>
                <span className={`stamp ${s === "Draft" ? "brass" : "green"}`} style={{ fontSize: 9, padding: "2px 6px", transform: "rotate(-1deg)" }}>
                  {s}
                </span>
              </td>
              <td className="actions">
                <a href="#">Edit</a><a href="#">Duplicate</a><a href="#" className="del">Delete</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="settings-group" style={{ marginTop: 40 }}>
        <span className="tagnum">── Editing: New Event ──</span>
        <h3>Event Form</h3>
        <div className="row-2">
          <div className="field"><label>Title</label><input type="text" placeholder="Event title" /></div>
          <div className="field">
            <label>Tag</label>
            <select><option>Open House</option><option>Members Only</option><option>Public Show</option><option>Swap Meet</option><option>Work Session</option></select>
          </div>
        </div>
        <div className="row-3">
          <div className="field"><label>Date</label><input type="date" /></div>
          <div className="field"><label>Start Time</label><input type="time" /></div>
          <div className="field"><label>End Time</label><input type="time" /></div>
        </div>
        <div className="field"><label>Location</label><input type="text" placeholder="Address or venue name" /></div>
        <div className="field">
          <label>Description</label>
          <textarea placeholder="1 to 3 sentences describing the event" />
          <div className="help">Keep it short — it sits in the public timetable.</div>
        </div>
        <div className="toolbar">
          <button className="btn">Save Event</button>
          <button className="btn ghost">Save as Draft</button>
        </div>
      </div>
    </section>
  );
}
