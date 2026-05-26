import Link from "next/link";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { fmtEventDateRange } from "@/lib/events";
import { fmtPostDate } from "@/lib/posts";
import {
  contactAddressLabel,
  contactAddressLines,
  getHomeData,
  mastheadProps,
  text,
  visualCssVars,
} from "@/lib/siteData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { copy, settings, events, posts, photos, boardMembers } = await getHomeData();

  const about = copy.about ?? {};
  const mem = copy.membership ?? {};
  const mast = copy.masthead ?? {};
  const contact = settings.contact ?? {};
  const meetings = settings.meetings ?? {};
  const addressLines = contactAddressLines(contact);
  const featured = posts.find((post) => post.featured) ?? posts[0] ?? null;
  const recentPosts = posts.filter((post) => post.id !== featured?.id);

  return (
    <div className="site-shell" style={visualCssVars(settings.visual)}>
      <Masthead {...mastheadProps(copy, settings)} />

      <section id="about" className="wrap home-section">
        <div className="home-split">
          <div>
            <div className="eyebrow">§ 01 &middot; All Aboard</div>
            <h2 className="section-title">
              {about.headline ? (
                about.headline
              ) : (
                <>Welcome to the <em>Topeka Model Railroaders</em>.</>
              )}
            </h2>
            <p className="lede-text">
              {about.para1 || "A friendly gathering for model railroaders, visitors, builders, and anyone curious about the hobby."}
            </p>
            {about.para2 && <p>{about.para2}</p>}
            <div className="button-row">
              <Link href="/about" className="btn">About the Club</Link>
              <Link href="/contact" className="btn ghost">Contact Us</Link>
            </div>
          </div>

          <aside className="card membership-card">
            <div className="cardnum">── Membership ──</div>
            <div className="eyebrow">Current Roster</div>
            <div className="member-count">{mem.activeMembers || <span className="ph">##</span>}</div>
            <div className="member-label">Active Members</div>
            <div className="dash-rule" />
            <div className="info-list">
              <div className="info-row"><span className="smcp">Dues</span><span>{mem.dues || <span className="ph">$ / year</span>}</span></div>
              <div className="info-row"><span className="smcp">Ages</span><span>{mem.ageRange || <span className="ph">Age range</span>}</span></div>
              <div className="info-row"><span className="smcp">Meets</span><span className="mono">{meetings.regular || <span className="ph">Day / time</span>}</span></div>
            </div>
            <div style={{ marginTop: 18 }}>
              <span className="stamp green">Accepting Members</span>
            </div>
          </aside>
        </div>
      </section>

      <div className="wrap"><div className="track"><div className="ties" /></div></div>

      <section id="events" className="wrap home-section">
        <div className="section-kicker-row">
          <div>
            <div className="eyebrow">§ 02 &middot; Timetable</div>
            <h2 className="section-title">Upcoming Events &amp; Meetups</h2>
          </div>
        </div>

        <div className="events-table">
          <div className="events-head">
            <span>Date</span><span>Event</span><span>Description</span><span>Location</span><span>Tag</span>
          </div>
          {events.length === 0 ? (
            <div className="evt-row">
              <span className="mono" style={{ fontWeight: 600 }}>—</span>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>No upcoming events</span>
              <span>Check back soon</span>
              <span />
              <span />
            </div>
          ) : events.map((event, index) => (
            <div key={event.id} className={`evt-row ${index % 2 ? "alt" : ""}`}>
              <span className="mono" style={{ fontWeight: 600 }}>{fmtEventDateRange(event)}</span>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>{event.title}</span>
              <span>{event.description}</span>
              <span className="mono" style={{ fontSize: 13 }}>{event.location}</span>
              <span>
                <span className="stamp green table-stamp">{event.tag}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="section-note">Events are free unless noted. Guests and families welcome.</p>
      </section>

      <div className="wrap"><div className="track"><div className="ties" /></div></div>

      <section id="blog" className="wrap home-section">
        <div className="eyebrow">§ 03 &middot; From the Dispatch Desk</div>
        <h2 className="section-title">Blog &amp; News</h2>
        <p className="section-note">Recent dispatches, build logs, meeting recaps, and club news.</p>

        <div className="blog-layout">
          {featured ? (
            <article className="card feature-card">
              {featured.headerImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featured.headerImageUrl} alt={featured.title || "Featured dispatch"} />
              ) : (
                <div className="ph-img feature-placeholder">Featured Post</div>
              )}
              <div className="feature-body">
                <div className="eyebrow" style={{ color: "var(--forest)" }}>Featured Dispatch</div>
                <Link href={`/blog/${featured.id}`} className="plain-link">
                  <h3>{featured.title || "Untitled Post"}</h3>
                </Link>
                <div className="mono post-meta">{featured.author || "TMRR"} · {fmtPostDate(featured.publishDate)}</div>
                <p>{featured.excerpt || "No excerpt provided."}</p>
                <Link href={`/blog/${featured.id}`} className="btn ghost">Read Full Dispatch</Link>
              </div>
            </article>
          ) : (
            <article className="card empty-card">
              <h3>No dispatches yet</h3>
              <p>Published club posts will appear here.</p>
            </article>
          )}

          <div className="recent-posts">
            {recentPosts.length > 0 ? recentPosts.map((post) => (
              <article key={post.id} className="card">
                <div className="cardnum">── Post ──</div>
                <div className="mono post-meta">{fmtPostDate(post.publishDate)} · {post.category || "Club News"}</div>
                <Link href={`/blog/${post.id}`} className="plain-link">
                  <h3 style={{ fontSize: 22, marginTop: 8, lineHeight: 1.2 }}>{post.title || "Untitled Post"}</h3>
                </Link>
                <p>{post.excerpt || "No excerpt provided."}</p>
                <Link href={`/blog/${post.id}`}>Read post →</Link>
              </article>
            )) : (
              <article className="card empty-card">
                <h3>Archive</h3>
                <p>More posts will show here once they are published.</p>
              </article>
            )}
          </div>
        </div>

        {posts.length > 0 && (
          <div className="button-row align-end">
            <Link href="/blog" className="btn">Previous Posts</Link>
          </div>
        )}
      </section>

      <div className="wrap"><div className="track"><div className="ties" /></div></div>

      <section id="gallery" className="wrap home-section">
        <div className="eyebrow">§ 04 &middot; The Layout Gallery</div>
        <h2 className="section-title">Scenes from the Workbench</h2>
        <p className="section-note">A small preview from member layouts, shows, and open houses.</p>
        {photos.length > 0 ? (
          <GalleryLightbox photos={photos} />
        ) : (
          <div className="gallery-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="ph-img" style={{ aspectRatio: "1/1" }}>
                Photo {String(index + 1).padStart(2, "0")}
              </div>
            ))}
          </div>
        )}
        <div className="button-row align-end">
          <Link href="/photo-gallery" className="btn">View All Photos</Link>
        </div>
      </section>

      {boardMembers.length > 0 && (
        <>
          <div className="wrap"><div className="track"><div className="ties" /></div></div>
          <section id="board" className="wrap home-section">
            <div className="eyebrow">§ 05 &middot; Board Members</div>
            <h2 className="section-title">Who Keeps the Trains Running</h2>
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
            <div className="button-row align-end">
              <Link href="/about" className="btn ghost">Meet the Board</Link>
            </div>
          </section>
        </>
      )}

      <div className="wrap"><div className="track"><div className="ties" /></div></div>

      <section id="contact" className="wrap home-section">
        <div className="home-split contact-preview">
          <div>
            <div className="eyebrow">§ 06 &middot; Contact</div>
            <h2 className="section-title">Mail, Meetings &amp; Questions</h2>
            <p className="section-note">
              The club is easiest to reach through the contact details here. Mailing details are shown instead of a clubhouse map unless a public location is configured.
            </p>
            <div className="button-row">
              <Link href="/contact" className="btn">Contact Us</Link>
              <Link href="/signup" className="btn ghost">Become a Member</Link>
            </div>
          </div>

          <aside className="card">
            <div className="cardnum">── {contactAddressLabel(contact)} ──</div>
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
              <div className="info-row"><span className="smcp">Meets</span><span className="mono">{meetings.regular || "Schedule coming soon"}</span></div>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter footer={settings.footer} contact={contact} meetings={meetings} fallbackTagline={mast.tagline} />
    </div>
  );
}
