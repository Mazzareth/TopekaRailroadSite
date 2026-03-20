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

type LightboxImage = {
  src: Parameters<typeof Image>[0]["src"];
  alt: string;
};

function getNthWeekday(
  year: number,
  monthZeroIndexed: number,
  weekday: number,
  nth: number
) {
  const first = new Date(year, monthZeroIndexed, 1);
  const firstWeekday = first.getDay();
  const offset = (weekday - firstWeekday + 7) % 7;
  const day = 1 + offset + 7 * (nth - 1);
  return new Date(year, monthZeroIndexed, day);
}

function nextMeetingDate(now = new Date()) {
  const tryMonth = (y: number, m: number) => {
    const nth = m === 0 || m === 1 ? 2 : 3;
    const d = getNthWeekday(y, m, 1, nth);
    d.setHours(19, 0, 0, 0);
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

const highlights = [
  {
    value: "40+",
    label: "Years of local railroad history and hands-on craftsmanship.",
  },
  {
    value: "12 mo.",
    label: "Year-round meetings, build nights, and public engagement.",
  },
  {
    value: "All skill levels",
    label: "From first-time hobbyists to layout veterans, everyone fits in.",
  },
];

const features = [
  {
    title: "Immersive layouts",
    description:
      "Detailed scenes, realistic weathering, and constantly evolving operations make every visit feel alive.",
  },
  {
    title: "Events with momentum",
    description:
      "Public train shows, swap meets, and demonstrations create fresh reasons to come back and bring friends.",
  },
  {
    title: "A welcoming club culture",
    description:
      "Learn wiring, scenery, operations, and storytelling from members who love sharing the craft.",
  },
];

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
    <div className="flex flex-col gap-10 pb-4 md:gap-16">
      <section className="panel relative isolate overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0">
          <Image
            src={hero}
            alt="Model railroad layout in Old Town scene"
            fill
            priority
            className="object-cover opacity-35"
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.3),transparent_30%),linear-gradient(135deg,rgba(2,6,23,0.45),rgba(2,6,23,0.88))]" />
        </div>

        <div className="relative z-10 grid gap-10 px-6 py-10 md:grid-cols-[1.3fr_0.9fr] md:px-10 md:py-14 xl:px-14 xl:py-16">
          <div className="max-w-3xl">
            <span className="eyebrow">Kansas railroading, reimagined</span>
            <h1 className="section-title mt-6 text-white">
              A more cinematic home for Topeka&apos;s model railroad community.
            </h1>
            <p className="section-subtitle mt-6">
              We gave the site a richer sense of atmosphere with layered visuals, stronger content hierarchy,
              and a more inviting path into events, membership, and club life.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#experience" className="button-primary">
                Explore the experience
              </Link>
              <Link href="/join" className="button-secondary">
                Start your membership journey
              </Link>
            </div>
            <div className="info-grid mt-10">
              {highlights.map((item) => (
                <div key={item.value} className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200/78">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 self-end">
            <div className="rounded-[1.75rem] border border-sky-300/20 bg-slate-950/70 p-6 shadow-2xl shadow-sky-950/25 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Next meeting</p>
              <p className="mt-4 text-2xl font-semibold text-white">{meeting.date}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300/80">
                7:00 PM in Marvin Room 101B at the Topeka / Shawnee County Public Library.
              </p>
              <Link href="/meetings-events" className="button-secondary mt-5">
                View meetings & events
              </Link>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-6 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">Featured event</p>
              <h2 className="mt-3 text-xl font-semibold text-white">4th Annual Train Show & Swap Meet</h2>
              <p className="mt-3 text-sm leading-6 text-slate-200/80">
                Great Overland Station • October 4, 2025 from 9 AM to 5 PM and October 5, 2025 from 9 AM to 3 PM.
              </p>
              <Link href="/annual-train-show" className="button-primary mt-5">
                See full event details
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel rounded-[1.75rem] p-8 md:p-10">
          <span className="eyebrow">Why it feels different</span>
          <h2 className="mt-5 text-3xl font-semibold text-white md:text-4xl">
            A homepage with movement, depth, and room to breathe.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300/80">
            Instead of looking like a simple brochure, the site now leads with a stronger visual story and
            polished content blocks that make events, club benefits, and member activity feel front-and-center.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="panel rounded-[1.5rem] p-6">
              <div className="h-11 w-11 rounded-2xl bg-sky-400/15 ring-1 ring-sky-300/25" />
              <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300/78">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel rounded-[1.75rem] p-8 md:p-10">
          <span className="eyebrow">Club spotlight</span>
          <h2 className="mt-5 text-3xl font-semibold text-white md:text-4xl">Built for hobbyists, families, and future members.</h2>
          <div className="mt-6 grid gap-4 text-sm leading-6 text-slate-300/80 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
              Learn operations, scenery, wiring, rolling stock maintenance, and layout planning in a collaborative environment.
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
              Discover public-facing events that turn the club into a destination for local families and railfans.
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
              The refreshed structure creates clearer pathways to meeting details, joining information, and show announcements.
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
              Photo-forward storytelling gives the organization a more premium, memorable identity on Vercel.
            </div>
          </div>
        </div>

        <div className="panel rounded-[1.75rem] p-8 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Fast access</span>
              <h2 className="mt-4 text-2xl font-semibold text-white">Plan your first visit</h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300/60">Meetings</p>
              <p className="mt-2 text-base text-white">2nd Monday in January and February, 3rd Monday from March through December.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300/60">Location</p>
              <p className="mt-2 text-base text-white">Topeka / Shawnee County Public Library, Marvin Room 101B.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300/60">Best next step</p>
              <p className="mt-2 text-base text-white">Come to a meeting, meet the crew, and ask about dues and active projects.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Gallery preview</span>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">A more immersive glimpse of the railroad world</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300/80 md:text-base">
              Highlights from club layouts, member moments, and the scenes that give the railroad its character.
            </p>
          </div>
          <Link href="/gallery" className="button-secondary w-fit">
            Open full gallery
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {photos.map((p, i) => (
            <button
              key={i}
              className="group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/60"
              onClick={() => setLightbox(p)}
              aria-label={`View larger: ${p.alt}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                placeholder="blur"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/0 to-transparent opacity-70 transition group-hover:opacity-40" />
            </button>
          ))}
        </div>
      </section>

      <section className="panel rounded-[1.75rem] px-8 py-10 md:px-10 md:py-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="eyebrow">Ready to hop aboard?</span>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Join a club where the layouts keep evolving.</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300/80">
              Whether you love operations, scenery, electronics, or simply seeing trains run, there&apos;s a place for you here.
            </p>
          </div>
          <Link href="/join" className="button-primary w-fit">
            Learn about membership
          </Link>
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-12 right-0 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/20"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">
              <Image src={lightbox.src} alt={lightbox.alt} fill className="object-contain" sizes="100vw" priority />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
