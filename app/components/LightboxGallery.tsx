"use client";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useState, useEffect } from "react";

export type GalleryItem = { src: StaticImageData; alt: string };

type Props = {
  items: GalleryItem[];
  columns?: number;
  sizes?: string;
};

export default function LightboxGallery({
  items,
  columns = 3,
  sizes = "(max-width: 768px) 50vw, 33vw",
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight" && openIndex !== null) {
        setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
      }
      if (e.key === "ArrowLeft" && openIndex !== null) {
        setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, items.length]);

  return (
    <div className="w-full">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setOpenIndex(idx)}
            className="relative aspect-[4/3] overflow-hidden rounded-lg ring-1 ring-black/10 dark:ring-white/10 group"
            aria-label={`View larger: ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={sizes}
              placeholder="blur"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 md:top-0 md:-right-10 text-white/80 hover:text-white"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={items[openIndex].src}
                alt={items[openIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <div className="mt-3 flex justify-between text-white/70 text-sm">
              <button
                onClick={() =>
                  setOpenIndex((i) =>
                    i === null ? null : (i - 1 + items.length) % items.length
                  )
                }
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                Prev
              </button>
              <span>
                {openIndex + 1} / {items.length}
              </span>
              <button
                onClick={() =>
                  setOpenIndex((i) => (i === null ? null : (i + 1) % items.length))
                }
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}