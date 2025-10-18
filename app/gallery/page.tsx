import type { Metadata } from "next";
import LightboxGallery from "../components/LightboxGallery";
import layouts1 from "../images/East_staging_yard2.webp";
import layouts2 from "../images/Rock_Quarry2.webp";
import layouts3 from "../images/Old_Town.webp";
import events1 from "../images/72479296007-20240202-railroaders-model-trains-en-1.webp";
import events2 from "../images/72479297007-20240203-n-trak-model-trains-en-1.webp";
import events3 from "../images/IMG_20251017_190103.webp";
import projects1 from "../images/IMG_20251017_190105.webp";
import projects2 from "../images/IMG_20251017_190156.webp";
import projects3 from "../images/IMG_20251017_190107.webp";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  const layouts = [
    { src: layouts1, alt: "East staging yard" },
    { src: layouts2, alt: "Rock quarry scene" },
    { src: layouts3, alt: "Old Town scene" },
  ];
  const events = [
    { src: events1, alt: "Railroaders model trains event" },
    { src: events2, alt: "N-Trak at the show" },
    { src: events3, alt: "Club event highlight" },
  ];
  const projects = [
    { src: projects1, alt: "Member project detail" },
    { src: projects2, alt: "Member scenic work" },
    { src: projects3, alt: "Member rolling stock" },
  ];

  return (
    <div className="py-10 space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="mt-3 text-foreground/80">A visual look at our layouts, events, and member projects.</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold">Layouts</h2>
        <div className="mt-6">
          <LightboxGallery items={layouts} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Events</h2>
        <div className="mt-6">
          <LightboxGallery items={events} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Member Projects</h2>
        <div className="mt-6">
          <LightboxGallery items={projects} />
        </div>
      </section>
    </div>
  );
}