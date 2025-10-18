"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import hero from "./images/Old_Town.webp";
import photo1 from "./images/East_staging_yard2.webp";
import photo2 from "./images/Rock_Quarry2.webp";
import photo3 from "./images/72479296007-20240202-railroaders-model-trains-en-1.webp";
import photo4 from "./images/72479297007-20240203-n-trak-model-trains-en-1.webp";
import photo5 from "./images/IMG_20251017_190103.webp";
import photo6 from "./images/IMG_20251017_190156.webp";

type LightboxImage = { src: any; alt: string };

function getNthWeekday(
  year: number,
  monthZeroIndexed: number,
  weekday: number,
  nth: number
) {
  const first = new Date(year, monthZeroIndexed, 1);
  const firstWeekday = first.getDay(); // 0=Sun..6=Sat
  const offset = (weekday - firstWeekday + 7) % 7;
  const day = 1 + offset + 7 * (nth - 1);
  return new Date(year, monthZeroIndexed, day);
}

function nextMeetingDate(now = new Date()) {
  const tryMonth = (y: number, m: number) => {
    const nth = m === 0 || m === 1 ? 2 : 3; // Jan/Feb => 2nd Monday, else 3rd Monday
    const d = getNthWeekday(y, m, 1, nth); // Monday = 1
    d.setHours(19, 0, 0, 0); // 7:00 PM
    return d;
  };
  const y0 = now.getFullYear();
  const m0 = now.getMonth();
  for (let i = 0; i < 14; i++) {
    const y = y0 + Math.floor((m0 + i) / 12);
    const m = (m0 + i) % 12;
    const d = tryMonth(y, m);
    if (d.getTime() > now.getTime()) return d;
  }
  return tryMonth(y0, m0);
}

export default function Home() {
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);

  const meeting = useMemo(() => {
    const d = nextMeetingDate();
    const date = d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return { date };
  }, []);

  const photos = [
    { src: photo1, alt: "Club layout - East staging yard" },
    { src: photo2, alt: "Rock quarry scene" },
    { src: photo3, alt: "Railroaders model trains" },
    { src: photo4, alt: "N-Trak model trains" },
    { src: photo5, alt: "Members interacting at the club" },
    { src: photo6, alt: "Detailed scene on the layout" },
  ];

  return (
    <div className="flex flex-col gap-16">
      <section className="relative isolate overflow-hidden rounded-2xl bg-black text-white">
        <div className="relative h-[60svh] md:h-[70svh]">
          <Image
            src={hero}
            alt="Model railroad layout in Old Town scene"
            fill
            priority
            className="object-cover opacity-80"
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-3xl px-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Topeka Model Railroaders
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90">
                Promoting the hobby of model railroading in Topeka, Kansas
                since 1983.
              </p>
              <div className="mt-8 flex gap-4">
                <Link
                  href="#upcoming"
                  className="inline-flex items-center rounded-full bg-blue-600 text-white px-5 py-2.5 hover:bg-blue-700"
                >
                  Upcoming Events
                </Link>
                <Link
                  href="/join"
                  className="inline-flex items-center rounded-full bg-white/10 ring-1 ring-inset ring-white/30 text-white px-5 py-2.5 hover:bg-white/20"
                >
                  Learn About Membership
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="upcoming" className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/50 dark:bg-white/5">
          <h2 className="text-xl font-semibold">Join Us at Our Next Event!</h2>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">
              4th Annual Train Show & Swap Meet
            </h3>
            <p className="mt-2 text-sm text-foreground/80">
              October 4, 2025 (9 AM – 5 PM) & October 5, 2025 (9 AM – 3 PM)
            </p>
            <p className="text-sm text-foreground/80">
              Great Overland Station, 701 N Kansas Ave, Topeka, KS
            </p>
            <Link
              href="/annual-train-show"
              className="mt-4 inline-flex items-center rounded-full bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >
              View Event Details
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/50 dark:bg-white/5">
          <h3 className="text-lg font-semibold">Next Meeting</h3>
          <p className="mt-2 text-sm text-foreground/80">
            Our next meeting is {meeting.date} at 7:00 PM in the Marvin Room
            101B at the Topeka/Shawnee Co. Public Library.
          </p>
          <Link
            href="/meetings-events"
            className="mt-4 inline-flex items-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 hover:opacity-90"
          >
            See Meetings & Events
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">A Glimpse of Our World</h2>
        <p className="mt-2 text-foreground/80">
          Highlights from our layouts, events, and members in action.
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((p, i) => (
            <button
              key={i}
              className="relative aspect-[4/3] overflow-hidden rounded-lg ring-1 ring-black/10 dark:ring-white/10 group"
              onClick={() => setLightbox(p)}
              aria-label={`View larger: ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                placeholder="blur"
              />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 p-8">
        <div className="md:flex items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">Interested in Joining?</h2>
            <p className="mt-2 text-foreground/80">
              We welcome all skill levels, from beginners to seasoned experts.
              Learn more about our community and how you can become a member.
            </p>
          </div>
          <Link
            href="/join"
            className="mt-4 md:mt-0 inline-flex items-center rounded-full bg-blue-600 text-white px-6 py-3 hover:bg-blue-700"
          >
            Learn About Membership
          </Link>
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 md:top-0 md:-right-10 text-white/80 hover:text-white"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
