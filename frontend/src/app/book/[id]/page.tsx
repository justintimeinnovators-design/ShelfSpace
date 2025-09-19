"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookSidebar from '../../../components/book/BookSidebar';
import BookDetails from '../../../components/book/BookDetails';
import { bookDetailsById, discussionsByBookId, reviewsByBookId, similarBooksById } from '../../data/mock-data';
import { BookDetail, DiscussionThread, SimilarBookItem, UserReview } from '../../../../types/models';

interface PageProps {
  params: { id: string };
}

export default function BookDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const bookId = Number(params.id);

  const book: BookDetail | undefined = bookDetailsById[bookId];
  const similarBooks: SimilarBookItem[] = similarBooksById[bookId] || [];
  const initialDiscussions: DiscussionThread[] = discussionsByBookId[bookId] || [];
  const initialReviews: UserReview[] = reviewsByBookId[bookId] || [];

  const [libraryStatus, setLibraryStatus] = useState<'none' | 'want' | 'reading' | 'finished'>('none');
  const [inLibrary, setInLibrary] = useState<boolean>(false);
  const [reviews, setReviews] = useState<UserReview[]>(initialReviews);
  const [discussions] = useState<DiscussionThread[]>(initialDiscussions);

  const ratingSummary = useMemo(() => ({
    average: book?.rating ?? 0,
    count: book?.ratingsCount ?? 0,
  }), [book]);

  if (!book) {
    return (
      <div className="bg-whiteBg min-h-screen">
        <button onClick={() => router.back()} className='text-white bg-primary m-2 p-2 rounded-md'>
          Go Back
        </button>
        <div className="p-6">
          <div className="card p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Book not found</h2>
            <p className="text-gray-600">We couldn't find details for this book.</p>
            <p className="text-sm text-gray-500 mt-2">Book ID: {bookId}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-whiteBg min-h-screen">
        <button onClick={() => router.back()} className='text-white bg-primary m-2 p-2 rounded-md'>
            Go Back
        </button>
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-6">
            <aside className="sticky top-0 h-screen overflow-hidden">
                <BookSidebar
                book={book}
                inLibrary={inLibrary}
                onAddToLibrary={() => setInLibrary(true)}
                status={libraryStatus}
                onChangeStatus={(s) => setLibraryStatus(s)}
                />
            </aside>

            <main className="overflow-y-auto h-screen p-6 no-scrollbar">
                <BookDetails
                book={book}
                ratingSummary={ratingSummary}
                reviews={reviews}
                onAddReview={(r) => setReviews((prev) => [{ ...r, id: prev.length + 1, createdAt: new Date().toISOString() }])}
                similarBooks={similarBooks}
                discussions={discussions}
                />
            </main>
        </div>
    </div>
  );
}