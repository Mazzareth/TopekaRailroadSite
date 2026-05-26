import Link from "next/link";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import { fmtPostDate, postContentHtml } from "@/lib/posts";
import {
  getPublishedPostById,
  getSiteShellData,
  mastheadProps,
  visualCssVars,
} from "@/lib/siteData";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const [{ copy, settings }, post] = await Promise.all([
    getSiteShellData(),
    getPublishedPostById(params.id),
  ]);
  if (!post) notFound();

  const masthead = copy.masthead ?? {};
  const content = postContentHtml(post);

  return (
    <div className="site-shell" style={visualCssVars(settings.visual)}>
      <Masthead {...mastheadProps(copy, settings)} />

      <main className="wrap page-main blog-post-page">
        <Link href="/blog" className="mono blog-back-link">← Previous Posts</Link>
        <article className="blog-post-shell">
          {post.headerImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="blog-post-hero" src={post.headerImageUrl} alt={post.title || "Blog post header"} />
          )}
          <div className="eyebrow">{post.category || "Club News"}</div>
          <h2 className="section-title">{post.title || "Untitled Post"}</h2>
          <div className="mono post-meta">
            {post.author || "Topeka Model Railroaders"} · {fmtPostDate(post.publishDate)}
          </div>
          {post.excerpt && <p className="blog-post-excerpt">{post.excerpt}</p>}

          {content ? (
            <div className="rich-content public-post-content" dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="no-content">No Content</p>
          )}
        </article>
      </main>

      <SiteFooter footer={settings.footer} contact={settings.contact} meetings={settings.meetings} fallbackTagline={masthead.tagline} />
    </div>
  );
}
