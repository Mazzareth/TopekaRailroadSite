Overview
- App directory for Next.js App Router. Route segments are represented by subfolders; each page exports a component and optional metadata.
- Shared UI components live under [app/components](app/components). Images under [app/images](app/images).

Pages
- Home: [app/page.tsx](app/page.tsx) — hero, event CTA, lightbox grid, membership CTA.
- About Us: [app/about/page.tsx](app/about/page.tsx) — mission, history placeholder, sponsors.
- Meetings & Events: [app/meetings-events/page.tsx](app/meetings-events/page.tsx) — schedule details, embedded map.
- Annual Train Show: [app/annual-train-show/page.tsx](app/annual-train-show/page.tsx) — event details, vendor info, gallery.
- Gallery: [app/gallery/page.tsx](app/gallery/page.tsx) — categorized galleries using LightboxGallery.
- Join: [app/join/page.tsx](app/join/page.tsx) — mailto form and membership info.

Components
- LightboxGallery: [app/components/LightboxGallery.tsx](app/components/LightboxGallery.tsx)
  - Props: items { src, alt }[], columns=3, sizes="(max-width: 768px) 50vw, 33vw"
  - Behavior: image grid; click opens accessible lightbox dialog.

Notes
- Accessibility: semantic headings; descriptive alt text; escape apostrophes in JSX to satisfy react/no-unescaped-entities.
- Styling: Tailwind CSS v4 utility classes; globals in [app/globals.css](app/globals.css).
- Metadata: per-page titles declared via export const metadata.

Dev
- Local dev: npm run dev
- Lint: npm run lint
- Build: npm run build