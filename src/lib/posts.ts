export type PublicPost = {
  id: string;
  title?: string;
  author?: string;
  publishDate?: string;
  category?: string;
  excerpt?: string;
  body?: string;
  bodyHtml?: string;
  headerImageUrl?: string;
  featured?: boolean;
  status?: string;
};

export function fmtPostDate(date: string | undefined): string {
  if (!date) return "No date set";
  const dt = new Date(`${date}T12:00:00`);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function plainTextToHtml(value: string): string {
  const blocks = value
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`).join("");
}

export function postContentHtml(post: Pick<PublicPost, "body" | "bodyHtml">): string {
  const rich = typeof post.bodyHtml === "string" ? post.bodyHtml.trim() : "";
  if (rich) return rich;

  const legacy = typeof post.body === "string" ? post.body.trim() : "";
  return legacy ? plainTextToHtml(legacy) : "";
}

export function postHasContent(post: Pick<PublicPost, "body" | "bodyHtml">): boolean {
  return Boolean(postContentHtml(post));
}
