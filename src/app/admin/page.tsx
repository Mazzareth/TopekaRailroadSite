import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import { eventEndDate, eventStartDate, fmtEventDateRange } from "@/lib/events";

export const dynamic = "force-dynamic";

type EventDoc = {
  title?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

type PostDoc = {
  title?: string;
  publishDate?: string;
  status?: string;
};

type PhotoDoc = {
  caption?: string;
  originalName?: string;
  path?: string;
  createdAt?: unknown;
};

type CopyDoc = {
  membership?: {
    activeMembers?: string;
  };
};

function todayCentralKey(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function fmtDate(date: string | undefined): string {
  if (!date) return "No date set";
  const dt = new Date(`${date}T12:00:00`);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timestampMillis(value: unknown): number {
  if (!value || typeof value !== "object") return 0;
  if ("toMillis" in value && typeof value.toMillis === "function") {
    return value.toMillis();
  }
  if ("seconds" in value && typeof value.seconds === "number") {
    return value.seconds * 1000;
  }
  return 0;
}

function photoName(photo: PhotoDoc | null): string {
  if (!photo) return "No photos uploaded yet";
  if (photo.caption?.trim()) return photo.caption.trim();
  if (photo.originalName?.trim()) return photo.originalName.trim();
  if (photo.path?.trim()) return photo.path.split("/").pop() ?? "Gallery photo";
  return "Gallery photo";
}

async function getDashboardStats() {
  const [eventsSnap, postsSnap, photosSnap, copySnap] = await Promise.all([
    adminDb.collection("events").orderBy("date", "asc").get(),
    adminDb.collection("posts").orderBy("publishDate", "desc").get(),
    adminDb.collection("photos").orderBy("order", "asc").get(),
    adminDb.collection("copy").doc("main").get(),
  ]);

  const today = todayCentralKey();
  const events = eventsSnap.docs.map((doc) => doc.data() as EventDoc);
  const posts = postsSnap.docs.map((doc) => doc.data() as PostDoc);
  const photos = photosSnap.docs.map((doc) => doc.data() as PhotoDoc);
  const copy = copySnap.exists ? (copySnap.data() as CopyDoc) : {};

  const upcomingEvents = events.filter((event) => event.status === "published" && eventStartDate(event) && eventEndDate(event) >= today);
  const nextEvent = upcomingEvents[0] ?? null;
  const publishedPosts = posts.filter((post) => post.status === "published");
  const latestPost = publishedPosts[0] ?? null;
  const recentPhoto = photos.reduce<PhotoDoc | null>((latest, photo) => {
    if (!latest) return photo;
    return timestampMillis(photo.createdAt) > timestampMillis(latest.createdAt) ? photo : latest;
  }, null);
  const activeMembers = copy.membership?.activeMembers?.trim() || "Not set";
  const refreshedAt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

  return {
    activeMembers,
    cards: [
      {
        label: "Upcoming Events",
        value: String(upcomingEvents.length),
        h: nextEvent ? fmtEventDateRange(nextEvent, true) : "No upcoming events",
        detail: nextEvent?.title?.trim() || "Add the next event from the schedule tab.",
      },
      {
        label: "Published Posts",
        value: String(publishedPosts.length),
        h: latestPost ? fmtDate(latestPost.publishDate) : "No published posts",
        detail: latestPost?.title?.trim() || "Publish the first dispatch from the blog tab.",
      },
      {
        label: "Photos in Gallery",
        value: String(photos.length),
        h: photos.length ? "Latest upload" : "No gallery photos",
        detail: photoName(recentPhoto),
      },
      {
        label: "Active Members",
        value: activeMembers,
        h: "Membership copy",
        detail: activeMembers === "Not set" ? "Set the active member count in site copy." : "Shown from the public membership panel.",
      },
    ],
    refreshedAt,
  };
}

export default async function AdminDashboard() {
  const { cards, refreshedAt } = await getDashboardStats();

  return (
    <section className="view">
      <h1>Good morning, Station Master.</h1>
      <p className="lede">A quick look at what&apos;s on the schedule and what needs your attention.</p>

      <div className="quick-cards">
        {cards.map((c) => (
          <div key={c.label} className="quick">
            <div className="n">{c.value}</div>
            <div className="l">{c.label}</div>
            <div className="h">{c.h}</div>
            <div style={{ fontSize: 15, marginTop: 4 }}>{c.detail}</div>
          </div>
        ))}
      </div>

      <div className="status-bar">
        <span className="dot-g" />
        <strong>Site content is live from Firestore.</strong>
        <span className="mono">Stats refreshed {refreshedAt} CT</span>
        <Link href="/" style={{ marginLeft: "auto" }}>View public site →</Link>
      </div>

      <div style={{ marginTop: 36 }}>
        <div className="eyebrow">Quick Actions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
          <Link href="/admin/events" className="btn">+ New Event</Link>
          <Link href="/admin/blog" className="btn">+ New Blog Post</Link>
          <Link href="/admin/photos" className="btn brass">Upload Photos</Link>
          <Link href="/admin/copy" className="btn ghost">Edit Welcome Copy</Link>
        </div>
      </div>
    </section>
  );
}
