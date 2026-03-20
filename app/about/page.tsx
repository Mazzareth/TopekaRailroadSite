import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

const supporters = [
  "Topeka Parks & Recreation",
  "Great Overland Station",
  "Dee & Mee Hobbies (785-228-9801)",
  "American Legion Capitol Post 1",
  "NOTO Arts & Entertainment District",
];

export default function AboutPage() {
  return (
    <div className="space-y-8 py-8 md:space-y-10 md:py-10">
      <header className="panel overflow-hidden rounded-[1.75rem] p-8 md:p-10">
        <span className="eyebrow">About the club</span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">A local railroad tradition with a stronger digital presence.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300/80 md:text-lg">
          Topeka Model Railroaders is a community built around craftsmanship, storytelling, and sharing the hobby with the public.
          The refreshed page layout now gives that history a presentation that feels more substantial and inviting.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="panel rounded-[1.5rem] p-8">
          <h2 className="text-2xl font-semibold text-white">Our mission</h2>
          <p className="mt-4 text-base leading-7 text-slate-300/80">
            We promote the hobby of model railroading in Topeka, Kansas by bringing enthusiasts together to build,
            operate, learn, and inspire. The club creates space for both detailed hands-on work and the public joy of watching trains in motion.
          </p>
        </article>
        <article className="panel rounded-[1.5rem] p-8">
          <h2 className="text-2xl font-semibold text-white">Established in 1983</h2>
          <p className="mt-4 text-base leading-7 text-slate-300/80">
            More than four decades of club life have shaped a culture of mentorship, shared knowledge, and public displays.
            This redesigned presentation gives those roots a cleaner, more premium foundation while leaving room to expand the story over time.
          </p>
        </article>
      </section>

      <section className="panel rounded-[1.75rem] p-8 md:p-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Community support</span>
            <h2 className="mt-4 text-3xl font-semibold text-white">Proudly supported by local partners.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-300/78">
            These organizations help keep the club visible, active, and connected to the broader Topeka community.
          </p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {supporters.map((supporter) => (
            <li key={supporter} className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5 text-base font-medium text-white">
              {supporter}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
