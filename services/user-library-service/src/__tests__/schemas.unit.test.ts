import { describe, expect, it } from '@jest/globals';
import {
  createReadingListSchema,
  moveBooksSchema,
  updateReadingListSchema,
} from '../schemas.js';

describe('user-library schemas', () => {
  it('validates create reading list payload', () => {
    const parsed = createReadingListSchema.parse({ name: 'Favorites' });
    expect(parsed.isPublic).toBe(false);
    expect(parsed.bookIds).toEqual([]);
  });

  it('validates update reading list payload', () => {
    expect(
      updateReadingListSchema.safeParse({
        description: null,
        color: '#12ABEF',
        sortOrder: 0,
      }).success
    ).toBe(true);
  });

  it('rejects invalid color and invalid move payload', () => {
    expect(updateReadingListSchema.safeParse({ color: 'blue' }).success).toBe(
      false
    );
    expect(
      moveBooksSchema.safeParse({ bookIds: [], targetListId: 'not-uuid' }).success
    ).toBe(false);
  });
});
