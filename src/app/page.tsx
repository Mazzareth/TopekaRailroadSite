import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";

export default function HomePage() {
  return (
    <>
      <Masthead />

      {/* ABOUT */}
      <section id="about" className="wrap" style={{ paddingTop: 56 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 56, alignItems: "start" }}>
          <div>
            <div className="eyebrow">§ 01 &middot; All Aboard</div>
            <h2 style={{ fontSize: 44, marginTop: 10, lineHeight: 1.1 }}>
              Welcome to the <em style={{ fontStyle: "italic", color: "var(--burgundy)" }}>Topeka Model Railroaders</em>.
            </h2>
            <p style={{ marginTop: 18, fontSize: 20, lineHeight: 1.6 }}>
              <span className="ph block">
                Club welcome paragraph — 2 to 4 sentences about who the club is, when you meet, and who you love to see walk in the door.
              </span>
            </p>
            <p style={{ marginTop: 14 }}>
              <span className="ph block">
                Second paragraph — a note about scales you run (HO, N, O, G, etc), your operating philosophy, and any notable layouts currently on the workbench.
              </span>
            </p>
            <div style={{ marginTop: 22, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="#visit" className="btn">Come Visit</Link>
              <Link href="/signup" className="btn ghost">Become a Member</Link>
            </div>
          </div>

          <aside>
            <div className="card">
              <div className="cardnum">── Membership ──</div>
              <div style={{ textAlign: "center", padding: "10px 4px" }}>
                <div className="eyebrow">Current Roster</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 96, lineHeight: 1, color: "var(--burgundy)", margin: "8px 0" }}>
                  <span className="ph">##</span>
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                  Active Members
                </div>
                <div style={{ margin: "22px 0", borderTop: "1px dashed var(--dashed)" }} />
                <div style={{ textAlign: "left", fontSize: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                    <span className="smcp">Dues</span><span className="ph">$ / year</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                    <span className="smcp">Ages</span><span className="ph">Age range</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                    <span className="smcp">Meets</span><span className="ph">Day / time</span>
                  </div>
                </div>
                <div style={{ marginTop: 18 }}>
                  <span className="stamp green">Accepting Members</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="wrap"><div className="track"><div className="ties" /></div></div>

      {/* EVENTS */}
      <section id="events" className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="eyebrow">§ 02 &middot; Timetable</div>
            <h2 style={{ fontSize: 42, marginTop: 6 }}>Upcoming Events &amp; Meetups</h2>
          </div>
          <div className="mono smcp" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
            Updated <span className="ph">Date</span>
          </div>
        </div>

        <div style={{ marginTop: 28, border: "1.5px solid var(--ink)", background: "var(--cream-2)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1.2fr 160px 140px", background: "var(--ink)", color: "var(--cream)", padding: "10px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            <span>Date</span><span>Event</span><span>Description</span><span>Location</span><span>Status</span>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`evt-row ${i % 2 ? "alt" : ""}`}>
              <span className="mono" style={{ fontWeight: 600 }}><span className="ph">MMM DD</span></span>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20 }}><span className="ph">Event Title</span></span>
              <span><span className="ph">1-line description</span></span>
              <span className="mono" style={{ fontSize: 13 }}><span className="ph">Where</span></span>
              <span>
                <span className={`stamp ${i === 2 ? "brass" : "green"}`} style={{ fontSize: 10, padding: "3px 8px", transform: "rotate(-2deg)" }}>
                  {["Open House", "Members Only", "Public Show", "Swap Meet"][i]}
                </span>
              </span>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 18, fontSize: 15, color: "var(--ink-soft)", fontStyle: "italic" }}>
          Events are free unless noted. Guests and families welcome — little engineers especially.
        </p>
      </section>

      <div className="wrap"><div className="track"><div className="ties" /></div></div>

      {/* BLOG */}
      <section id="blog" className="wrap">
        <div className="eyebrow">§ 03 &middot; From the Dispatch Desk</div>
        <h2 style={{ fontSize: 42, marginTop: 6 }}>Blog &amp; News</h2>
        <p style={{ color: "var(--ink-soft)", fontStyle: "italic", marginTop: 6, maxWidth: 640 }}>
          Bulletins, build logs, meeting recaps, and the occasional tall tale from the workbench.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 28, marginTop: 32 }}>
          <article className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="ph-img" style={{ height: 280, border: "none", borderBottom: "1.5px solid var(--ink)" }}>
              FEATURED POST — HEADER IMAGE
            </div>
            <div style={{ padding: "22px 26px 26px" }}>
              <div className="eyebrow" style={{ color: "var(--forest)" }}>Featured Dispatch</div>
              <h3 style={{ fontSize: 32, marginTop: 8, lineHeight: 1.15 }}>
                <span className="ph">Featured blog post title goes here</span>
              </h3>
              <div className="mono" style={{ fontSize: 12, color: "var(--ink-soft)", letterSpacing: "0.12em", marginTop: 10 }}>
                <span className="ph">Author</span> &nbsp;·&nbsp; <span className="ph">Date</span> &nbsp;·&nbsp; <span className="ph">Read time</span>
              </div>
              <p style={{ marginTop: 14, fontSize: 17 }}>
                <span className="ph block">Excerpt — 2 to 3 sentences teasing the full post.</span>
              </p>
              <Link href="/#" className="btn" style={{ marginTop: 14 }}>Read the Full Dispatch</Link>
            </div>
          </article>

          <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[0, 1, 2, 3].map((i) => (
              <article key={i} className="card">
                <div className="cardnum">── Post ──</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-soft)", letterSpacing: "0.15em" }}>
                  <span className="ph">Date</span> · <span className="ph">Category</span>
                </div>
                <h3 style={{ fontSize: 22, marginTop: 8, lineHeight: 1.2 }}>
                  <span className="ph">Blog post title</span>
                </h3>
                <p style={{ marginTop: 10, fontSize: 15 }}>
                  <span className="ph block">Short excerpt — 1 to 2 lines.</span>
                </p>
                <Link href="/#" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap"><div className="track"><div className="ties" /></div></div>

      {/* GALLERY */}
      <section id="gallery" className="wrap">
        <div className="eyebrow">§ 04 &middot; The Layout Gallery</div>
        <h2 style={{ fontSize: 42, marginTop: 6 }}>Scenes from the Workbench</h2>
        <p style={{ color: "var(--ink-soft)", fontStyle: "italic", marginTop: 6, maxWidth: 640 }}>
          Photographs from member layouts, shows, and open houses. Updated as the shutters click.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 28 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="ph-img" style={{ aspectRatio: "1/1" }}>
              PHOTO {String(i + 1).padStart(2, "0")} — LAYOUT / SCENE
            </div>
          ))}
        </div>
      </section>

      <div className="wrap"><div className="track"><div className="ties" /></div></div>

      {/* VISIT */}
      <section id="visit" className="wrap">
        <div className="eyebrow">§ 05 &middot; Where &amp; When</div>
        <h2 style={{ fontSize: 42, marginTop: 6 }}>Find the Clubhouse</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, marginTop: 28 }}>
          <div className="card" style={{ padding: 28 }}>
            <div className="cardnum">── Location ──</div>
            <h3 style={{ fontSize: 26 }}>The Depot</h3>
            <p style={{ marginTop: 12, lineHeight: 1.7 }}>
              <span className="ph block">Clubhouse name / description</span>
              <span className="ph block">Street address, line 1</span>
              <span className="ph block">City, State, ZIP</span>
            </p>
            <div style={{ marginTop: 22, borderTop: "1px dashed var(--dashed)", paddingTop: 18 }}>
              <div className="eyebrow" style={{ color: "var(--forest)" }}>Meeting Hours</div>
              <div style={{ marginTop: 10, fontSize: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dotted var(--dashed)" }}>
                  <span className="smcp">Regular Meetings</span><span className="mono"><span className="ph">Day &amp; time</span></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dotted var(--dashed)" }}>
                  <span className="smcp">Open Houses</span><span className="mono"><span className="ph">When</span></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span className="smcp">Work Sessions</span><span className="mono"><span className="ph">When</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="ph-img" style={{ minHeight: 440, fontSize: 14 }}>
            MAP / EMBED OF THE CLUBHOUSE LOCATION
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
