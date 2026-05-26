import Link from "next/link";

type FooterData = {
  mission?: string;
  copyrightYear?: string;
  addressLines?: string[];
  meetingSummary?: string;
};

type ContactData = {
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  addressType?: "mailing" | "street" | "physical";
  mailingAddressLines?: string[];
};

type MeetingsData = {
  regular?: string;
  openHouses?: string;
  workSessions?: string;
};

type SiteFooterProps = {
  footer?: FooterData;
  contact?: ContactData;
  meetings?: MeetingsData;
  fallbackTagline?: string;
};

function text(value: string | undefined | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function addressFallback(contact?: ContactData): string[] {
  const mailingLines = Array.isArray(contact?.mailingAddressLines)
    ? contact.mailingAddressLines.map(text).filter(Boolean)
    : [];
  if (mailingLines.length > 0) return mailingLines;

  const street = text(contact?.address);
  const cityLine = [text(contact?.city), text(contact?.state), text(contact?.zip)].filter(Boolean).join(", ");
  return [street, cityLine].filter(Boolean);
}

export function SiteFooter({ footer, contact, meetings, fallbackTagline }: SiteFooterProps) {
  const mission = text(footer?.mission) || text(fallbackTagline) || "A friendly gathering of hobbyists, tinkerers, and track-layers.";
  const year = text(footer?.copyrightYear) || String(new Date().getFullYear());
  const addressLines = (footer?.addressLines ?? []).map(text).filter(Boolean);
  const visitLines = addressLines.length > 0 ? addressLines : addressFallback(contact);
  const meetingSummary = text(footer?.meetingSummary) || text(meetings?.regular) || text(meetings?.openHouses) || text(meetings?.workSessions) || "Meeting schedule coming soon";

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="eyebrow">The Club</div>
            <h4>Topeka Model Railroaders</h4>
            <p style={{ color: "rgba(245,247,251,0.75)", marginTop: 8 }}>
              {mission}
            </p>
            <div style={{ marginTop: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--brass-soft)" }}>
              © {year} &middot; All gauges welcome
            </div>
          </div>

          <div>
            <div className="eyebrow">{contact?.addressType === "street" || contact?.addressType === "physical" ? "Visit" : "Contact"}</div>
            <p style={{ color: "rgba(245,247,251,0.85)", fontSize: 15, lineHeight: 1.7 }}>
              {visitLines.length > 0 ? visitLines.map((line, index) => (
                <span key={`${line}-${index}`}>{line}<br /></span>
              )) : <span>Topeka, KS<br /></span>}
              <span>{meetingSummary}</span>
            </p>
          </div>

          <div>
            <div className="eyebrow">Navigate</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", fontSize: 15, lineHeight: 1.9 }}>
              <li><Link href="/about">About the Club</Link></li>
              <li><Link href="/#events">Events</Link></li>
              <li><Link href="/blog">Dispatches</Link></li>
              <li><Link href="/photo-gallery">Photo Gallery</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/signup">Become a Member</Link></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow">For Members</div>
            <div className="admin-box">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span className="stamp" style={{ transform: "rotate(-3deg)", fontSize: 10 }}>Station Master</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(245,247,251,0.8)", lineHeight: 1.5, margin: "0 0 12px" }}>
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
            <Link href="/login">Admin</Link> · <Link href="/contact">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
