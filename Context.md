Overview
- Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4.
- Deployed to Vercel; images optimized via next/image under [app/images](app/images).

Routes
- Home: [app/page.tsx](app/page.tsx)
- About Us: [app/about/page.tsx](app/about/page.tsx)
- Meetings & Events: [app/meetings-events/page.tsx](app/meetings-events/page.tsx)
- Annual Train Show: [app/annual-train-show/page.tsx](app/annual-train-show/page.tsx)
- Gallery: [app/gallery/page.tsx](app/gallery/page.tsx)
- Join Us / Contact: [app/join/page.tsx](app/join/page.tsx)
- Layout + Global styles: [app/layout.tsx](app/layout.tsx), [app/globals.css](app/globals.css)

Components
- LightboxGallery: [app/components/LightboxGallery.tsx](app/components/LightboxGallery.tsx) — responsive grid with accessible lightbox dialog.

Design Notes
- Metadata defaults in [app/layout.tsx](app/layout.tsx) with sensible titles per route.
- Accessibility: semantic headings, descriptive alt text, focus-safe lightbox dismissal via backdrop or close button.
- Lint: Escaped JSX apostrophes to satisfy react/no-unescaped-entities in [app/about/page.tsx](app/about/page.tsx), [app/annual-train-show/page.tsx](app/annual-train-show/page.tsx), [app/join/page.tsx](app/join/page.tsx).

Dev/Deploy
- Dev: npm run dev
- Lint: npm run lint
- Build: npm run build
- Start prod: npm run start
- Deploy: push to main; Vercel builds from this repository.

Repository
- GitHub: https://github.com/Mazzareth/TopekaRailroadSite

Source Control Notes
- Default branch: main
- Remote: origin → https://github.com/Mazzareth/TopekaRailroadSite.git
- Deploy: push to main; Vercel builds from this repository.