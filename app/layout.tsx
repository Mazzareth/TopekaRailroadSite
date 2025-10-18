import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import logo from "./images/24x24_new_logo.webp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/70 backdrop-blur border-b border-black/10 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex h-14 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Image
                  src={logo}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-sm"
                />
                <span>Topeka Model Railroaders</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>
                <Link href="/about" className="hover:text-blue-600">
                  About Us
                </Link>
                <Link href="/meetings-events" className="hover:text-blue-600">
                  Meetings & Events
                </Link>
                <Link href="/annual-train-show" className="hover:text-blue-600">
                  Annual Train Show
                </Link>
                <Link href="/gallery" className="hover:text-blue-600">
                  Gallery
                </Link>
                <Link
                  href="/join"
                  className="inline-flex items-center rounded-full bg-blue-600 text-white px-4 py-1.5 hover:bg-blue-700"
                >
                  Join Us
                </Link>
              </nav>
              <div className="md:hidden">
                <Link
                  href="/join"
                  className="inline-flex items-center rounded-full bg-blue-600 text-white px-3 py-1.5 hover:bg-blue-700 text-sm"
                >
                  Join
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4">{children}</main>
        <footer className="border-t border-black/10 dark:border-white/10 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4 text-foreground/70">
            <p>© 1983-{year} Topeka Model Railroaders</p>
            <div className="flex items-center gap-6">
              <a
                href="mailto:topekamodelrailroaders@gmail.com"
                className="hover:underline"
              >
                Email
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Facebook
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
