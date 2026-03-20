"use client";

import { useState } from "react";

const benefits = [
  "Share knowledge and learn from experienced modelers.",
  "Access club layouts, work sessions, and operating conversations.",
  "Participate in public events, shows, and display opportunities.",
  "Make friends and enjoy the hobby with a welcoming local community.",
];

export default function JoinPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Inquiry from ${name || "Prospective Member"}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:topekamodelrailroaders@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-8 py-8 md:space-y-10 md:py-10">
      <header className="panel rounded-[1.75rem] p-8 md:p-10">
        <span className="eyebrow">Join the club</span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">Step into a community that loves building railroad worlds.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300/80 md:text-lg">
          We redesigned this page to feel more personal and encouraging, with a clearer explanation of why membership matters
          and an easier contact path for prospective members.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <article className="panel rounded-[1.5rem] p-8">
            <h2 className="text-2xl font-semibold text-white">Why join?</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300/80">
              {benefits.map((benefit) => (
                <li key={benefit} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                  {benefit}
                </li>
              ))}
            </ul>
          </article>

          <article className="panel rounded-[1.5rem] p-8">
            <h2 className="text-2xl font-semibold text-white">How to become a member</h2>
            <p className="mt-4 text-base leading-7 text-slate-300/80">
              The best first step is to attend a meeting, introduce yourself, and see the club in action.
              Members can share information about dues, projects, and how you can plug in right away.
            </p>
          </article>

          <article className="panel rounded-[1.5rem] p-8">
            <h2 className="text-2xl font-semibold text-white">Contact information</h2>
            <ul className="mt-4 space-y-3 text-slate-300/80">
              <li>
                Email: <a href="mailto:topekamodelrailroaders@gmail.com" className="text-sky-300 hover:text-white hover:underline">topekamodelrailroaders@gmail.com</a>
              </li>
              <li>
                Facebook: <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-white hover:underline">Visit our Facebook page</a>
              </li>
            </ul>
          </article>
        </div>

        <form onSubmit={onSubmit} className="panel rounded-[1.75rem] p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-white">Send a membership inquiry</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300/80">
            Tell the club a little about yourself and your interests. Submitting opens your email client with a pre-filled message.
          </p>
          <div className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-200">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-sky-300/60"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-sky-300/60"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-sky-300/60"
                required
              />
            </div>
            <button type="submit" className="button-primary w-full sm:w-auto">
              Send inquiry
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
