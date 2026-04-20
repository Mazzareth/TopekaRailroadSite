import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="eyebrow">The Club</div>
            <h4>Topeka Model Railroaders</h4>
            <p style={{ color: "rgba(242,230,204,0.75)", marginTop: 8 }}>
              <span className="ph" style={{ color: "var(--brass-soft)", borderColor: "var(--brass-soft)" }}>
                Short tagline or mission
              </span>
            </p>
            <div style={{ marginTop: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--brass-soft)" }}>
              © <span className="ph" style={{ color: "var(--brass-soft)", borderColor: "var(--brass-soft)" }}>Year</span> &middot; All gauges welcome
            </div>
          </div>

          <div>
            <div className="eyebrow">Visit</div>
            <p style={{ color: "rgba(242,230,204,0.85)", fontSize: 15, lineHeight: 1.7 }}>
              <span className="ph" style={{ color: "var(--brass-soft)", borderColor: "var(--brass-soft)" }}>Street address</span><br />
              <span className="ph" style={{ color: "var(--brass-soft)", borderColor: "var(--brass-soft)" }}>City, State</span><br />
              <span className="ph" style={{ color: "var(--brass-soft)", borderColor: "var(--brass-soft)" }}>Meeting day/time</span>
            </p>
          </div>

          <div>
            <div className="eyebrow">Navigate</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", fontSize: 15, lineHeight: 1.9 }}>
              <li><Link href="/#about">About the Club</Link></li>
              <li><Link href="/#events">Events</Link></li>
              <li><Link href="/#blog">Dispatches</Link></li>
              <li><Link href="/#gallery">Layout Gallery</Link></li>
              <li><Link href="/#visit">Visit Us</Link></li>
              <li><Link href="/signup">Become a Member</Link></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow">For Members</div>
            <div className="admin-box">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span className="stamp" style={{ transform: "rotate(-3deg)", fontSize: 10 }}>Station Master</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(242,230,204,0.8)", lineHeight: 1.5, margin: "0 0 12px" }}>
                Editors &amp; officers sign in here to update events, blog posts, and site details.
              </p>
              <Link href="/login" className="btn brass" style={{ display: "block", textAlign: "center" }}>
                Admin Sign-In →
              </Link>
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>Built on the Santa Fe Main &middot; Laid in kraft &amp; ink</span>
          <span>
            <Link href="/login">Admin</Link> · <Link href="/#">Privacy</Link> · <Link href="/#">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
