import { describe, expect, it } from '@jest/globals';
import { createReviewSchema, updateReviewSchema } from '../schemas.js';
describe('review schemas', () => {
    it('validates create review payload', () => {
        expect(createReviewSchema.safeParse({
            rating: 5,
            reviewText: 'Excellent and worth reading',
            bookId: 'book-1',
        }).success).toBe(true);
    });
    it('rejects invalid create review payload', () => {
        expect(createReviewSchema.safeParse({ rating: 7, reviewText: 'short', bookId: 'book-1' })
            .success).toBe(false);
    });
    it('validates update review payload', () => {
        expect(updateReviewSchema.safeParse({ rating: 4, tldr: 'Good' }).success).toBe(true);
    });
});
