import type { Metadata } from "next";
export const metadata: Metadata = { title: "Meetings & Events" };

export default function MeetingsEventsPage() {
  return (
    <div className="py-10 space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold">Meetings & Events</h1>
        <p className="mt-3 text-foreground/80">Key information for active and prospective members.</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold">Club Meeting Schedule</h2>
        <div className="mt-3 space-y-2 text-foreground/80">
          <p><span className="font-medium">Location:</span> Topeka / Shawnee County Public Library, Marvin Room 101B</p>
          <p><span className="font-medium">Time:</span> 7:00 PM</p>
          <ul className="mt-3 list-disc pl-5">
            <li>2nd Monday of the month (January - February)</li>
            <li>3rd Monday of the month (March - December)</li>
          </ul>
        </div>
        <div className="mt-6 aspect-video w-full rounded-xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
          <iframe
            title="Topeka / Shawnee County Public Library - Map"
            src="https://www.google.com/maps?q=Topeka%20Shawnee%20County%20Public%20Library&output=embed"
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        <ul className="mt-3 space-y-3">
          <li className="rounded-lg border border-black/10 dark:border-white/10 p-4">
            <div className="font-semibold">4th Annual Train Show & Swap Meet</div>
            <div className="text-sm text-foreground/80">October 4–5, 2025 • Great Overland Station</div>
          </li>
          <li className="rounded-lg border border-black/10 dark:border-white/10 p-4">
            <div className="font-semibold">Workshops & Displays</div>
            <div className="text-sm text-foreground/80">Watch this space for upcoming public displays and clinics.</div>
          </li>
        </ul>
      </section>
    </div>
  );
}