import type { Metadata } from "next";
import { BookDetailFeature } from "@/components/book/BookDetailFeature";
import { parseBookSlug } from "@/lib/book-slug";

interface BookDetailPageProps {
  params: Promise<{ slug: string }>;
}

const BOOK_SERVICE_URL =
  process.env["NEXT_PUBLIC_BOOK_SERVICE_URL"] ||
  (process.env["NEXT_PUBLIC_API_URL"]
    ? `${process.env["NEXT_PUBLIC_API_URL"]}`
    : "http://localhost:3004");

async function fetchBook(id: string) {
  try {
    const res = await fetch(`${BOOK_SERVICE_URL}/api/books/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: BookDetailPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const { id } = parseBookSlug(slug);
  const book = await fetchBook(id);

  if (!book) {
    return {
      title: "Book Details",
      description: "View book details on ShelfSpace.",
    };
  }

  const title = book.title || "Untitled";
  const authorNames: string =
    Array.isArray(book.authors) && book.authors.length > 0
      ? book.authors.map((a: { name: string }) => a.name).join(", ")
      : "Unknown Author";
  const description =
    book.description
      ? book.description.slice(0, 160)
      : `${title} by ${authorNames}. Discover this book on ShelfSpace — track your reading, add it to your library, and get personalised recommendations.`;
  const coverImage = book.image_url
    ? book.image_url.replace(/^http:\/\//, "https://")
    : undefined;
  const genres: string[] = Array.isArray(book.genres) ? book.genres : [];

  return {
    title: `${title} by ${authorNames}`,
    description,
    keywords: [title, authorNames, ...genres, "book review", "reading tracker", "ShelfSpace"],
    openGraph: {
      title: `${title} by ${authorNames}`,
      description,
      type: "book",
      ...(coverImage && {
        images: [{ url: coverImage, width: 400, height: 600, alt: `Cover of ${title}` }],
      }),
    },
    twitter: {
      card: "summary",
      title: `${title} by ${authorNames}`,
      description,
      ...(coverImage && { images: [coverImage] }),
    },
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug } = await params;
  const { id } = parseBookSlug(slug);

  // Prefetch for JSON-LD
  const book = await fetchBook(id);
  const title = book?.title || "Untitled";
  const authorNames: string =
    Array.isArray(book?.authors) && book.authors.length > 0
      ? book.authors.map((a: { name: string }) => a.name).join(", ")
      : "Unknown Author";
  const coverImage = book?.image_url
    ? book.image_url.replace(/^http:\/\//, "https://")
    : undefined;

  const bookJsonLd = book
    ? {
        "@context": "https://schema.org",
        "@type": "Book",
        name: title,
        author: {
          "@type": "Person",
          name: authorNames,
        },
        ...(coverImage && { image: coverImage }),
        ...(book.description && { description: book.description.slice(0, 500) }),
        ...(book.isbn13 && { isbn: book.isbn13 }),
        ...(book.published_year && { datePublished: String(book.published_year) }),
        ...(typeof book.average_rating === "number" && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: book.average_rating.toFixed(1),
            bestRating: "5",
            worstRating: "1",
            ...(book.ratings_count && { ratingCount: book.ratings_count }),
          },
        }),
        ...(Array.isArray(book.genres) && book.genres.length > 0 && {
          genre: book.genres,
        }),
      }
    : null;

  return (
    <>
      {bookJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
        />
      )}
      <BookDetailFeature bookId={id} />
    </>
  );
}
