import type { Metadata } from "next";

export const metadata: Metadata = { title: "Meetings & Events" };

const schedule = [
  "2nd Monday of the month (January - February)",
  "3rd Monday of the month (March - December)",
];

const upcoming = [
  {
    title: "4th Annual Train Show & Swap Meet",
    detail: "October 4–5, 2025 • Great Overland Station",
  },
  {
    title: "Workshops & Displays",
    detail: "Watch this space for upcoming public displays, build clinics, and community demos.",
  },
];

export default function MeetingsEventsPage() {
  return (
    <div className="space-y-8 py-8 md:space-y-10 md:py-10">
      <header className="panel rounded-[1.75rem] p-8 md:p-10">
        <span className="eyebrow">Meetings & events</span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">Everything you need to plan a visit.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300/80 md:text-lg">
          The updated layout puts meeting details, event announcements, and travel context into easy-to-scan sections
          so first-time visitors can quickly understand when to come and where to go.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="panel rounded-[1.5rem] p-8">
          <h2 className="text-2xl font-semibold text-white">Club meeting schedule</h2>
          <div className="mt-5 space-y-4 text-slate-300/80">
            <p>
              <span className="font-semibold text-white">Location:</span> Topeka / Shawnee County Public Library, Marvin Room 101B
            </p>
            <p>
              <span className="font-semibold text-white">Time:</span> 7:00 PM
            </p>
            <ul className="space-y-3">
              {schedule.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="panel overflow-hidden rounded-[1.5rem] p-3">
          <div className="h-full min-h-[320px] overflow-hidden rounded-[1.1rem] border border-white/10">
            <iframe
              title="Topeka / Shawnee County Public Library - Map"
              src="https://www.google.com/maps?q=Topeka%20Shawnee%20County%20Public%20Library&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </article>
      </section>

      <section className="panel rounded-[1.75rem] p-8 md:p-10">
        <span className="eyebrow">Upcoming</span>
        <h2 className="mt-4 text-3xl font-semibold text-white">What&apos;s on the horizon.</h2>
        <ul className="mt-8 grid gap-4 lg:grid-cols-2">
          {upcoming.map((event) => (
            <li key={event.title} className="rounded-[1.5rem] border border-white/10 bg-white/6 p-6">
              <div className="text-lg font-semibold text-white">{event.title}</div>
              <div className="mt-2 text-sm leading-6 text-slate-300/80">{event.detail}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
