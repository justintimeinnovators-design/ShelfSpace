function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseSlug(slug: string): { id: string; namePart: string } {
  const parts = slug.split("--");
  if (parts.length >= 2) {
    const id = parts.slice(1).join("--");
    return { id, namePart: parts[0] || "" };
  }
  return { id: slug, namePart: "" };
}

export function toForumSlug(forum: { id: string; name: string }): string {
  return `${slugify(forum.name || "forum")}--${forum.id}`;
}

export function parseForumSlug(slug: string): string {
  return parseSlug(slug).id;
}

export function toThreadSlug(thread: { id: string; title: string }): string {
  return `${slugify(thread.title || "thread")}--${thread.id}`;
}

export function parseThreadSlug(slug: string): string {
  return parseSlug(slug).id;
}

export function toListSlug(list: { id: string; name: string }): string {
  return `${slugify(list.name || "list")}--${list.id}`;
}

export function parseListSlug(slug: string): string {
  return parseSlug(slug).id;
}
