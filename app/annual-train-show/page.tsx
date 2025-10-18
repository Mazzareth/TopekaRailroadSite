import type { Metadata } from "next";
import LightboxGallery from "../components/LightboxGallery";
import img1 from "../images/72479296007-20240202-railroaders-model-trains-en-1.webp";
import img2 from "../images/72479297007-20240203-n-trak-model-trains-en-1.webp";
import img3 from "../images/IMG_20251017_190107.webp";
import img4 from "../images/IMG_20251017_190109.webp";
import img5 from "../images/Old_Town.webp";
import img6 from "../images/East_staging_yard2.webp";

export const metadata: Metadata = { title: "Annual Train Show" };

export default function AnnualTrainShowPage() {
  const gallery = [
    { src: img1, alt: "Vendors and visitors at the train show" },
    { src: img2, alt: "N-Trak modules in operation" },
    { src: img3, alt: "Show floor activity" },
    { src: img4, alt: "Operating layouts on display" },
    { src: img5, alt: "Detailed scene from a display diorama" },
    { src: img6, alt: "Yard operations with multiple trains" },
  ];

  return (
    <div className="py-10 space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold">4th Annual Train Show & Swap Meet</h1>
        <p className="mt-3 text-foreground/80">
          October 4, 2025 (9 AM – 5 PM) & October 5, 2025 (9 AM – 3 PM)
        </p>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-6">
        <h2 className="text-xl font-semibold">Event Details</h2>
        <dl className="mt-4 grid sm:grid-cols-2 gap-y-3">
          <div>
            <dt className="font-medium">Location</dt>
            <dd className="text-foreground/80">Great Overland Station, 701 N Kansas Ave, Topeka, KS</dd>
          </div>
          <div>
            <dt className="font-medium">Admission</dt>
            <dd className="text-foreground/80">Adults: $5.00 | Children 6 and under: FREE with a paid adult</dd>
          </div>
        </dl>
        <p className="mt-4 text-foreground/80">
          Experience over 10,000 sq ft of operational layouts, stunning display dioramas, fascinating railroad history exhibits,
          and a wide variety of vendor tables.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Scenes From Last Year{"'"}s Show</h2>
        <div className="mt-6">
          <LightboxGallery items={gallery} />
        </div>
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 p-6">
        <h2 className="text-xl font-semibold">Information for Vendors</h2>
        <p className="mt-2 text-foreground/80">
          Interested in booking a table? Email us at{" "}
          <a href="mailto:topekamodelrailroaders@gmail.com" className="text-blue-600 hover:underline">
            topekamodelrailroaders@gmail.com
          </a>{" "}
          and we{"'"}ll follow up with table rates, setup details, and the vendor packet.
        </p>
      </section>
    </div>
  );
}