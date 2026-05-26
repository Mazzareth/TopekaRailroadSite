import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getPublicBoardMembers,
  getSiteShellData,
  mastheadProps,
  visualCssVars,
} from "@/lib/siteData";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [{ copy, settings }, boardMembers] = await Promise.all([
    getSiteShellData(),
    getPublicBoardMembers(),
  ]);

  const about = copy.about ?? {};
  const membership = copy.membership ?? {};
  const masthead = copy.masthead ?? {};

  return (
    <div className="site-shell" style={visualCssVars(settings.visual)}>
      <Masthead {...mastheadProps(copy, settings)} />

      <main className="wrap page-main">
        <section className="page-hero">
          <div className="eyebrow">About the Club</div>
          <h2 className="section-title">{about.headline || "Topeka Model Railroaders"}</h2>
          <p className="lede-text">
            {about.para1 || "A friendly gathering for model railroaders, builders, visitors, and families in Topeka, Kansas."}
          </p>
          {about.para2 && <p>{about.para2}</p>}
        </section>

        <section className="info-grid">
          <article className="card">
            <div className="cardnum">── Membership ──</div>
            <h3>Joining the Club</h3>
            <div className="dash-rule" />
            <div className="info-list">
              <div className="info-row"><span className="smcp">Members</span><span>{membership.activeMembers || "Roster update coming soon"}</span></div>
              <div className="info-row"><span className="smcp">Dues</span><span>{membership.dues || "Ask the club for current dues"}</span></div>
              <div className="info-row"><span className="smcp">Ages</span><span>{membership.ageRange || "All ages welcome"}</span></div>
            </div>
            <div className="button-row">
              <Link href="/signup" className="btn">Become a Member</Link>
            </div>
          </article>

          <article className="card">
            <div className="cardnum">── Visitors ──</div>
            <h3>New Visitors</h3>
            <p>
              Questions are welcome. Bring your curiosity, your layout stories, or the train project that has been waiting for a little help.
            </p>
            <div className="button-row">
              <Link href="/contact" className="btn ghost">Contact Us</Link>
            </div>
          </article>
        </section>

        <section className="page-section">
          <div className="eyebrow">Board Members</div>
          <h2 className="section-title">Who Keeps the Trains Running</h2>
          {boardMembers.length > 0 ? (
            <div className="board-grid">
              {boardMembers.map((member) => (
                <article key={member.id} className="card board-card">
                  {member.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photoUrl} alt={member.name} className="board-card-photo" />
                  ) : (
                    <div className="ph-img board-card-photo">Board Member Photo</div>
                  )}
                  <div>
                    <div className="eyebrow" style={{ color: "var(--forest)" }}>{member.title || "Board Member"}</div>
                    <h3>{member.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <article className="card empty-card">
              <h3>Board list coming soon</h3>
              <p>Club officers can add public board members from the admin console.</p>
            </article>
          )}
        </section>
      </main>

      <SiteFooter footer={settings.footer} contact={settings.contact} meetings={settings.meetings} fallbackTagline={masthead.tagline} />
    </div>
  );
}
