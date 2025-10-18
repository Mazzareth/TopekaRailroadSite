"use client";
import { useState } from "react";

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
    <div className="py-10 space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold">Join Us</h1>
        <p className="mt-3 text-foreground/80">Become part of a community of model railroaders in Topeka.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Why Join?</h2>
            <ul className="mt-2 list-disc pl-5 text-foreground/80 space-y-1">
              <li>Share knowledge and learn from others</li>
              <li>Access to club layouts and work sessions</li>
              <li>Participate in events and public displays</li>
              <li>Make friends and enjoy the hobby together</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">How to Become a Member</h2>
            <p className="mt-2 text-foreground/80">
              The best way to start is by coming to one of our meetings! Introduce yourself and see what we{"'"}re all about.
              We{"'"}ll share details about dues and the application process in person.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <ul className="mt-2 text-foreground/80">
              <li>
                Email: <a href="mailto:topekamodelrailroaders@gmail.com" className="text-blue-600 hover:underline">topekamodelrailroaders@gmail.com</a>
              </li>
              <li>
                Facebook: <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Visit our Facebook Page</a>
              </li>
            </ul>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/50 dark:bg-white/5">
          <h2 className="text-xl font-semibold">Contact Form</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-md border border-black/10 dark:border-white/10 bg-transparent px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center rounded-full bg-blue-600 text-white px-6 py-3 hover:bg-blue-700"
            >
              Send Inquiry
            </button>
          </div>
          <p className="mt-3 text-xs text-foreground/60">Submitting opens your email client with a pre-filled message.</p>
        </form>
      </section>
    </div>
  );
}