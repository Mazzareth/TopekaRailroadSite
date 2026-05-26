import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import {
  canShowMap,
  contactAddressLabel,
  contactAddressLines,
  getSiteShellData,
  mastheadProps,
  text,
  visualCssVars,
} from "@/lib/siteData";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { copy, settings } = await getSiteShellData();
  const masthead = copy.masthead ?? {};
  const contact = settings.contact ?? {};
  const meetings = settings.meetings ?? {};
  const addressLines = contactAddressLines(contact);
  const showMap = canShowMap(contact);

  return (
    <div className="site-shell" style={visualCssVars(settings.visual)}>
      <Masthead {...mastheadProps(copy, settings)} />

      <main className="wrap page-main">
        <section className="page-hero">
          <div className="eyebrow">Contact Us</div>
          <h2 className="section-title">Mail, Meetings &amp; Questions</h2>
          <p className="lede-text">
            Use these details to reach the club, ask about membership, or confirm meeting plans.
          </p>
        </section>

        <section className="contact-layout">
          <article className="card contact-card">
            <div className="cardnum">── {contactAddressLabel(contact)} ──</div>
            <h3>{contact.addressType === "street" || contact.addressType === "physical" ? "Where to Find Us" : "Mailing Address"}</h3>
            {addressLines.length > 0 ? (
              <p className="address-block">
                {addressLines.map((line) => <span key={line}>{line}<br /></span>)}
              </p>
            ) : (
              <p className="address-block">Topeka, KS</p>
            )}
            <div className="dash-rule" />
            <div className="info-list">
              {text(contact.email) && <div className="info-row"><span className="smcp">Email</span><a href={`mailto:${text(contact.email)}`}>{text(contact.email)}</a></div>}
              {text(contact.phone) && <div className="info-row"><span className="smcp">Phone</span><span className="mono">{text(contact.phone)}</span></div>}
              {text(contact.directionsUrl) && (
                <div className="info-row"><span className="smcp">Directions</span><a href={text(contact.directionsUrl)}>Open directions</a></div>
              )}
            </div>
          </article>

          <article className="card contact-card">
            <div className="cardnum">── Meeting Times ──</div>
            <h3>When We Meet</h3>
            <div className="info-list">
              <div className="info-row"><span className="smcp">Regular Meetings</span><span className="mono">{meetings.regular || "Schedule coming soon"}</span></div>
              <div className="info-row"><span className="smcp">Open Houses</span><span className="mono">{meetings.openHouses || "Ask for current dates"}</span></div>
              <div className="info-row"><span className="smcp">Work Sessions</span><span className="mono">{meetings.workSessions || "Ask for current dates"}</span></div>
            </div>
            <div className="button-row">
              <Link href="/signup" className="btn">Become a Member</Link>
            </div>
          </article>
        </section>

        {showMap && (
          <section className="page-section">
            <div className="eyebrow">Map</div>
            <h2 className="section-title">Directions</h2>
            <iframe
              className="map-embed"
              src={text(contact.mapEmbedUrl)}
              title="Topeka Model Railroaders map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </section>
        )}
      </main>

      <SiteFooter footer={settings.footer} contact={contact} meetings={meetings} fallbackTagline={masthead.tagline} />
    </div>
  );
}
