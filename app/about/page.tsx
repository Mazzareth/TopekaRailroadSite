import type { Metadata } from "next";
export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="py-10 space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold">About Us</h1>
        <p className="mt-3 text-foreground/80">
          We are a group of model railroaders promoting the hobby of model railroading in Topeka, Kansas.
          Our club provides a space for enthusiasts to share knowledge, build intricate layouts, and share our passion with the public.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold">Our Mission</h2>
        <p className="mt-2 text-foreground/80">
          We are a group of model railroaders promoting the hobby of model railroading in Topeka Ks.
          Our club provides a space for enthusiasts to share knowledge, build intricate layouts, and share our passion with the public.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Established in 1983</h2>
        <p className="mt-2 text-foreground/80">
          Club history and milestones coming soon. We’re gathering details of our founding, key events, and evolution over the years.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">We're Proudly Supported By</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <li className="rounded-lg border border-black/10 dark:border-white/10 p-4">Topeka Parks & Recreation</li>
          <li className="rounded-lg border border-black/10 dark:border-white/10 p-4">Great Overland Station</li>
          <li className="rounded-lg border border-black/10 dark:border-white/10 p-4">
            Dee & Mee Hobbies <span className="text-foreground/70">(785-228-9801)</span>
          </li>
          <li className="rounded-lg border border-black/10 dark:border-white/10 p-4">American Legion Capitol Post 1</li>
          <li className="rounded-lg border border-black/10 dark:border-white/10 p-4">NOTO Arts & Entertainment District</li>
        </ul>
      </section>
    </div>
  );
}