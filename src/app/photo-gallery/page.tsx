import { GalleryLightbox } from "@/components/GalleryLightbox";
import { Masthead } from "@/components/Masthead";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getPublicPhotos,
  getSiteShellData,
  mastheadProps,
  visualCssVars,
} from "@/lib/siteData";

export const dynamic = "force-dynamic";

export default async function PhotoGalleryPage() {
  const [{ copy, settings }, photos] = await Promise.all([
    getSiteShellData(),
    getPublicPhotos(),
  ]);
  const masthead = copy.masthead ?? {};

  return (
    <div className="site-shell" style={visualCssVars(settings.visual)}>
      <Masthead {...mastheadProps(copy, settings)} />

      <main className="wrap page-main">
        <section className="page-hero">
          <div className="eyebrow">Photo Gallery</div>
          <h2 className="section-title">Scenes from the Workbench</h2>
          <p className="lede-text">
            Photos from member layouts, shows, open houses, and projects around the club.
          </p>
        </section>

        {photos.length > 0 ? (
          <GalleryLightbox photos={photos} />
        ) : (
          <article className="card empty-card">
            <h3>No photos yet</h3>
            <p>Uploaded gallery photos will appear here.</p>
          </article>
        )}
      </main>

      <SiteFooter footer={settings.footer} contact={settings.contact} meetings={settings.meetings} fallbackTagline={masthead.tagline} />
    </div>
  );
}
