import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import logo from "./images/24x24_new_logo.webp";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/meetings-events", label: "Meetings & Events" },
  { href: "/annual-train-show", label: "Train Show" },
  { href: "/gallery", label: "Gallery" },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://topekamodelrailroaders.com"),
  title: {
    default: "Topeka Model Railroaders",
    template: "%s | Topeka Model Railroaders",
  },
  description:
    "Promoting the hobby of model railroading in Topeka, Kansas since 1983.",
  openGraph: {
    title: "Topeka Model Railroaders",
    description:
      "Promoting the hobby of model railroading in Topeka, Kansas since 1983.",
    url: "https://topekamodelrailroaders.com",
    siteName: "Topeka Model Railroaders",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="page-shell">
          <header className="site-header">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3 text-sm font-semibold sm:text-base">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg shadow-sky-950/20 backdrop-blur">
                  <Image
                    src={logo}
                    alt="Topeka Model Railroaders logo"
                    width={28}
                    height={28}
                    className="rounded-md"
                  />
                </span>
                <span>
                  <span className="block text-white">Topeka Model Railroaders</span>
                  <span className="block text-xs font-medium tracking-[0.25em] text-sky-200/70 uppercase">
                    Est. 1983
                  </span>
                </span>
              </Link>

              <nav className="hidden items-center gap-2 lg:flex">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-pill">
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Link href="/join" className="button-primary hidden sm:inline-flex">
                  Become a Member
                </Link>
                <Link href="/join" className="button-primary sm:hidden">
                  Join
                </Link>
              </div>
            </div>
            <div className="border-t border-white/10 lg:hidden">
              <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-sm sm:px-6 lg:px-8">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-pill whitespace-nowrap">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-20 pt-8 sm:px-6 lg:px-8">
            {children}
          </main>

          <footer className="border-t border-white/10 bg-slate-950/80">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-slate-300 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
              <div>
                <p className="text-base font-semibold text-white">Keep the hobby moving forward.</p>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-300/80">
                  From public train shows to member build nights, Topeka Model Railroaders brings craftsmanship,
                  community, and railroad storytelling together under one roof.
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">Visit</p>
                <ul className="mt-3 space-y-2 text-slate-300/80">
                  <li>Topeka / Shawnee County Public Library</li>
                  <li>Marvin Room 101B</li>
                  <li>Topeka, Kansas</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white">Connect</p>
                <div className="mt-3 flex flex-col gap-2 text-slate-300/80">
                  <a href="mailto:topekamodelrailroaders@gmail.com" className="hover:text-white hover:underline">
                    topekamodelrailroaders@gmail.com
                  </a>
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline"
                  >
                    Facebook
                  </a>
                  <p>© 1983-{year} Topeka Model Railroaders</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
