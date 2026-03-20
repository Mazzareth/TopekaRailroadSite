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

const welcomePoints = [
  "Monthly meetings with room for beginners, long-time modelers, and curious visitors.",
  "Public events and train shows that make it easy for families to stop in and explore.",
  "A practical, hands-on club culture focused on learning, building, and sharing ideas.",
];

const visitSteps = [
  {
    title: "Come as you are",
    description:
      "If you are new to model railroading, you do not need experience or equipment to visit.",
  },
  {
    title: "Meet the group",
    description:
      "Members are happy to talk through projects, answer questions, and explain how meetings work.",
  },
  {
    title: "Find your place",
    description:
      "Some members love scenery and structures, others enjoy operations, wiring, or rolling stock.",
  },
];

const quickFacts = [
  {
    label: "Meeting schedule",
    value: "2nd Monday in January and February, 3rd Monday March through December",
  },
  {
    label: "Meeting time",
    value: "7:00 PM",
  },
  {
    label: "Location",
    value: "Marvin Room 101B at the Topeka / Shawnee County Public Library",
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
    <div className="flex flex-col gap-8 pb-4 md:gap-12">
      <section className="panel relative overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0">
          <Image
            src={hero}
            alt="Model railroad layout in Old Town scene"
            fill
            priority
            className="object-cover opacity-25"
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,16,29,0.78),rgba(7,16,29,0.92)),radial-gradient(circle_at_top_right,rgba(186,230,253,0.18),transparent_32%)]" />
        </div>

        <div className="relative z-10 grid gap-8 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-10 xl:px-12">
          <div className="max-w-3xl">
            <span className="eyebrow">Welcome to Topeka Model Railroaders</span>
            <h1 className="section-title mt-5 text-white">
              A simple, welcoming place to learn about the club, our meetings, and our train show.
            </h1>
            <p className="section-subtitle mt-5">
              We kept the homepage calm and easy to read, with clear paths for first-time visitors,
              returning members, and anyone curious about model railroading in Topeka.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/meetings-events" className="button-primary">
                Plan a visit
              </Link>
              <Link href="/join" className="button-secondary">
                Learn about membership
              </Link>
            </div>
          </div>

          <aside className="soft-card self-start p-6 md:p-7" aria-label="Next meeting details">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">Next meeting</p>
            <p className="mt-3 text-2xl font-semibold text-white">{meeting.date}</p>
            <p className="mt-3 text-sm leading-6 text-slate-200/85">
              7:00 PM in Marvin Room 101B at the Topeka / Shawnee County Public Library.
            </p>
            <Link href="/meetings-events" className="button-secondary mt-5">
              View meetings &amp; events
            </Link>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel rounded-[1.75rem] p-8 md:p-10">
          <span className="eyebrow">Why people enjoy the club</span>
          <h2 className="mt-5 text-3xl font-semibold text-white md:text-4xl">
            Friendly, practical, and centered on the hobby.
          </h2>
          <ul className="mt-6 space-y-4 text-base leading-7 text-slate-200/82">
            {welcomePoints.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-300" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel rounded-[1.75rem] p-8 md:p-10">
          <span className="eyebrow">Quick facts</span>
          <dl className="mt-6 space-y-5">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="rounded-3xl border border-white/10 bg-white/6 p-5">
                <dt className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300/70">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-base leading-7 text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel rounded-[1.75rem] p-8 md:p-10">
          <span className="eyebrow">Your first visit</span>
          <h2 className="mt-5 text-3xl font-semibold text-white md:text-4xl">
            Clear next steps, without any guesswork.
          </h2>
          <div className="mt-6 space-y-4">
            {visitSteps.map((step, index) => (
              <article key={step.title} className="rounded-3xl border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-200">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200/78">{step.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="panel rounded-[1.75rem] p-8 md:p-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Gallery preview</span>
              <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                A look at the layouts, scenes, and club activity.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300/80 md:text-base">
                A few photos are enough to give visitors a feel for the club without turning the page into a busy showcase.
              </p>
            </div>
            <Link href="/gallery" className="button-secondary w-fit">
              Open full gallery
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {photos.map((photo) => (
              <button
                key={photo.alt}
                className="group relative aspect-[4/3] overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                onClick={() => setLightbox(photo)}
                aria-label={`View larger: ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel rounded-[1.75rem] px-8 py-10 md:px-10 md:py-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="eyebrow">Annual train show</span>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
              Looking for the biggest public event on the calendar?
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300/80">
              The annual train show and swap meet is the easiest way to experience the club, meet other railfans, and spend time around the hobby.
            </p>
          </div>
          <Link href="/annual-train-show" className="button-primary w-fit">
            See train show details
          </Link>
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-12 right-0 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
