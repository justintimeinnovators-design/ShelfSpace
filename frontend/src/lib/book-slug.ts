import type { Book } from "@/types/book";

/**
 * Slugify Title.
 * @param title - title value.
 * @returns string.
 */
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * To Book Slug.
 * @param book - book value.
 * @returns string.
 */
export function toBookSlug(book: Pick<Book, "id" | "title">): string {
  const base = slugifyTitle(book.title || "book");
  return `${base}--${book.id}`;
}

/**
 * Parse Book Slug.
 * @param slug - slug value.
 * @returns { id: string; titlePart: string }.
 */
export function parseBookSlug(slug: string): { id: string; titlePart: string } {
  const parts = slug.split("--");
  if (parts.length >= 2) {
    const id = parts.slice(1).join("--");
    return { id, titlePart: parts[0] || "" };
  }
  return { id: slug, titlePart: "" };
}
