"use client";

import { BookDetail, DiscussionThread, SimilarBookItem, UserReview } from "../../../../types/models";
import BookDiscussion from "./BookDiscussion";
import BookInfo from "./BookInfo";
import BookReviews from "./BookReviews";
import SimilarBooks from "./SimilarBooks";

interface BookDetailsProps {
  book: BookDetail;
  ratingSummary: {
    average: number;
    count: number;
  };
  reviews: UserReview[];
  onAddReview: (review: Omit<UserReview, 'id' | 'createdAt'>) => void;
  similarBooks: SimilarBookItem[];
  discussions: DiscussionThread[];
}

export default function BookDetails({
  book,
  ratingSummary,
  reviews,
  onAddReview,
  similarBooks,
  discussions,
}: BookDetailsProps) {
  return (
    <div>
      <BookInfo book={book} ratingSummary={ratingSummary} />
      <BookReviews reviews={reviews} onAddReview={onAddReview} />
      <SimilarBooks similarBooks={similarBooks} />
      <BookDiscussion discussions={discussions} />
    </div>
  );
}