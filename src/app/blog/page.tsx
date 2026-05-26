import Link from "next/link";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { fmtPostDate } from "@/lib/posts";
import {
  getPublishedPosts,
  getSiteShellData,
  mastheadProps,
  visualCssVars,
} from "@/lib/siteData";

export const dynamic = "force-dynamic";

export default async function BlogArchivePage() {
  const [{ copy, settings }, posts] = await Promise.all([
    getSiteShellData(),
    getPublishedPosts(),
  ]);
  const masthead = copy.masthead ?? {};

  return (
    <div className="site-shell" style={visualCssVars(settings.visual)}>
      <Masthead {...mastheadProps(copy, settings)} />

      <main className="wrap page-main blog-archive">
        <section className="page-hero">
          <div className="eyebrow">Dispatch Archive</div>
          <h2 className="section-title">Previous Posts</h2>
          <p className="lede-text">
            Every published club dispatch, from newest update back to the first entry.
          </p>
        </section>

        <div className="blog-archive-list">
          {posts.length === 0 ? (
            <article className="card empty-card">
              <h3>No posts yet</h3>
              <p>Published dispatches will appear here.</p>
            </article>
          ) : posts.map((post) => (
            <article key={post.id} className="card blog-archive-card">
              <div className="mono post-meta">
                {fmtPostDate(post.publishDate)} · {post.category || "Club News"}
              </div>
              <Link href={`/blog/${post.id}`} className="plain-link">
                <h3>{post.title || "Untitled Post"}</h3>
              </Link>
              <p>{post.excerpt || "No excerpt provided."}</p>
              <Link href={`/blog/${post.id}`} className="btn ghost">Open Post</Link>
            </article>
          ))}
        </div>
      </main>

      <SiteFooter footer={settings.footer} contact={settings.contact} meetings={settings.meetings} fallbackTagline={masthead.tagline} />
    </div>
  );
}
