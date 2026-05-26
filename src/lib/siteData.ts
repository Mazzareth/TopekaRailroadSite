import "server-only";
import type { CSSProperties } from "react";
import { adminDb } from "@/lib/firebase/admin";
import { normalizeEventDates, type EventDateFields } from "@/lib/events";
import type { PublicPost } from "@/lib/posts";
import { visualThemeCssVars } from "@/lib/visualTheme";

export type CopyData = {
  masthead?: {
    clubName?: string;
    tagline?: string;
    volume?: string;
    established?: string;
  };
  about?: {
    headline?: string;
    para1?: string;
    para2?: string;
  };
  membership?: {
    activeMembers?: string;
    dues?: string;
    ageRange?: string;
  };
};

export type ContactSettings = {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  addressType?: "mailing" | "street" | "physical";
  mailingAddressLines?: string[];
  mapEmbedUrl?: string;
  directionsUrl?: string;
};

export type MeetingsSettings = {
  regular?: string;
  openHouses?: string;
  workSessions?: string;
  dues?: string;
};

export type FooterSettings = {
  mission?: string;
  copyrightYear?: string;
  addressLines?: string[];
  meetingSummary?: string;
};

export type VisualSettings = {
  paper?: string;
  ink?: string;
  burgundy?: string;
  brass?: string;
  forest?: string;
  trainAnimation?: boolean;
  paperTexture?: boolean;
  logoUrl?: string;
  logoPath?: string;
  logoAlt?: string;
};

export type SettingsData = {
  contact?: ContactSettings;
  meetings?: MeetingsSettings;
  footer?: FooterSettings;
  visual?: VisualSettings;
};

export type PublicEvent = EventDateFields & {
  id: string;
  title?: string;
  description?: string;
  location?: string;
  tag?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
};

export type PublicPhoto = {
  id: string;
  url: string;
  caption?: string;
  order?: number;
  originalName?: string;
};

export type BoardMember = {
  id: string;
  name: string;
  title?: string;
  photoUrl?: string;
  active?: boolean;
  order?: number;
};

export type SiteShellData = {
  copy: CopyData;
  settings: SettingsData;
};

export type HomeData = SiteShellData & {
  events: PublicEvent[];
  posts: PublicPost[];
  photos: PublicPhoto[];
  boardMembers: BoardMember[];
};

export function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function cleanLines(values: unknown): string[] {
  return Array.isArray(values)
    ? values.map(text).filter(Boolean)
    : [];
}

export function contactAddressLines(contact?: ContactSettings): string[] {
  const mailingLines = cleanLines(contact?.mailingAddressLines);
  if (mailingLines.length > 0) return mailingLines;

  const streetLines = text(contact?.address)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const cityLine = [text(contact?.city), text(contact?.state), text(contact?.zip)].filter(Boolean).join(", ");
  return [...streetLines, cityLine].filter(Boolean);
}

export function contactAddressLabel(contact?: ContactSettings): string {
  return contact?.addressType === "street" || contact?.addressType === "physical" ? "Location" : "Mailing Address";
}

export function canShowMap(contact?: ContactSettings): boolean {
  return (contact?.addressType === "street" || contact?.addressType === "physical") && Boolean(text(contact.mapEmbedUrl));
}

export function visualCssVars(visual?: VisualSettings): CSSProperties {
  return visualThemeCssVars(visual) as CSSProperties;
}

export function mastheadProps(copy: CopyData, settings: SettingsData) {
  const masthead = copy.masthead ?? {};
  const visual = settings.visual ?? {};
  return {
    clubName: text(masthead.clubName) || "Topeka Model Railroaders",
    volume: masthead.volume,
    established: masthead.established,
    tagline: masthead.tagline,
    logoUrl: visual.logoUrl,
    logoAlt: visual.logoAlt,
    trainDefaultOn: visual.trainAnimation !== false,
  };
}

export async function getSiteShellData(): Promise<SiteShellData> {
  const [copySnap, settingsSnap] = await Promise.all([
    adminDb.collection("copy").doc("main").get(),
    adminDb.collection("settings").doc("site").get(),
  ]);

  return {
    copy: copySnap.exists ? (copySnap.data() as CopyData) : {},
    settings: settingsSnap.exists ? (settingsSnap.data() as SettingsData) : {},
  };
}

export async function getPublicEvents(limit?: number): Promise<PublicEvent[]> {
  const snap = await adminDb.collection("events").orderBy("date", "asc").get();
  const events = snap.docs
    .map((doc) => normalizeEventDates({ id: doc.id, ...doc.data() } as PublicEvent))
    .filter((event) => event.status === "published");
  return typeof limit === "number" ? events.slice(0, limit) : events;
}

export async function getPublishedPosts(limit?: number): Promise<PublicPost[]> {
  const snap = await adminDb.collection("posts").orderBy("publishDate", "desc").get();
  const posts = snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as PublicPost))
    .filter((post) => post.status === "published");
  return typeof limit === "number" ? posts.slice(0, limit) : posts;
}

export async function getPublishedPostById(id: string): Promise<PublicPost | null> {
  const snap = await adminDb.collection("posts").doc(id).get();
  if (!snap.exists) return null;
  const post = { id: snap.id, ...snap.data() } as PublicPost;
  return post.status === "published" ? post : null;
}

export async function getPublicPhotos(limit?: number): Promise<PublicPhoto[]> {
  const snap = await adminDb.collection("photos").orderBy("order", "asc").get();
  const photos = snap.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        url: text(data.url),
        caption: text(data.caption),
        originalName: text(data.originalName),
        order: typeof data.order === "number" ? data.order : undefined,
      };
    })
    .filter((photo) => photo.url);
  return typeof limit === "number" ? photos.slice(0, limit) : photos;
}

export async function getPublicBoardMembers(limit?: number): Promise<BoardMember[]> {
  const snap = await adminDb.collection("boardMembers").orderBy("order", "asc").get();
  const members = snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as BoardMember))
    .filter((member) => member.active !== false && text(member.name));
  return typeof limit === "number" ? members.slice(0, limit) : members;
}

export async function getHomeData(): Promise<HomeData> {
  const [shell, events, posts, photos, boardMembers] = await Promise.all([
    getSiteShellData(),
    getPublicEvents(4),
    getPublishedPosts(3),
    getPublicPhotos(8),
    getPublicBoardMembers(4),
  ]);

  return {
    ...shell,
    events,
    posts,
    photos,
    boardMembers,
  };
}
