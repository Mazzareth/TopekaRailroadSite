"use client";

import { useCallback, useEffect, useState } from "react";

type Photo = {
  id: string;
  url: string;
  caption?: string;
};

type GalleryLightboxProps = {
  photos: Photo[];
};

export function GalleryLightbox({ photos }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const activePhoto = selectedIndex === null ? null : photos[selectedIndex] ?? null;

  const close = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const move = useCallback((delta: number) => {
    setSelectedIndex((current) => {
      if (current === null || photos.length === 0) return current;
      return (current + delta + photos.length) % photos.length;
    });
  }, [photos.length]);

  useEffect(() => {
    if (!activePhoto) return;

    const originalOverflow = document.body.style.overflow;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activePhoto, close, move, photos.length]);

  return (
    <>
      <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 28 }}>
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className="gallery-thumb"
            onClick={() => setSelectedIndex(index)}
            aria-label={`Open ${photo.caption || "gallery photo"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.caption || "Gallery photo"} />
          </button>
        ))}
      </div>

      {activePhoto && (
        <div className="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Gallery photo" onClick={close}>
          <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="lightbox-close" onClick={close} aria-label="Close gallery photo">
              ×
            </button>
            {photos.length > 1 && (
              <button type="button" className="lightbox-nav prev" onClick={() => move(-1)} aria-label="Previous photo">
                ‹
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lightbox-img" src={activePhoto.url} alt={activePhoto.caption || "Gallery photo"} />
            {photos.length > 1 && (
              <button type="button" className="lightbox-nav next" onClick={() => move(1)} aria-label="Next photo">
                ›
              </button>
            )}
            {activePhoto.caption && <div className="lightbox-caption">{activePhoto.caption}</div>}
          </div>
        </div>
      )}
    </>
  );
}
