import { describe, expect, it } from '@jest/globals';
import {
  bookSchema,
  createBookSchema,
  deleteBookSchema,
  getBookByIdSchema,
  getBooksByRatingSchema,
  getBooksSchema,
  searchBookSchema,
  updateBookSchema,
} from '../schemas.js';

describe('book schemas', () => {
  it('validates minimal book payload', () => {
    expect(bookSchema.safeParse({ book_id: '1', title: 'Title' }).success).toBe(
      true
    );
  });

  it('validates create book wrapper', () => {
    expect(
      createBookSchema.safeParse({ body: { title: 'T', book_id: 'b1' } }).success
    ).toBe(true);
  });

  it('validates update and id wrappers', () => {
    expect(
      updateBookSchema.safeParse({ params: { id: 'x' }, body: { title: 'New' } })
        .success
    ).toBe(true);
    expect(getBookByIdSchema.safeParse({ params: { bookId: 'x' } }).success).toBe(
      true
    );
    expect(deleteBookSchema.safeParse({ params: { id: 'x' } }).success).toBe(
      true
    );
  });

  it('enforces page and limit constraints on search/get', () => {
    expect(
      searchBookSchema.safeParse({ query: { q: 'hobbit', page: '1', limit: '25' } })
        .success
    ).toBe(true);
    expect(
      searchBookSchema.safeParse({ query: { q: 'hobbit', page: '0' } }).success
    ).toBe(false);
    expect(
      getBooksSchema.safeParse({ query: { page: '1', limit: '101' } }).success
    ).toBe(false);
  });

  it('validates numeric rating param', () => {
    expect(
      getBooksByRatingSchema.safeParse({ params: { rating: '4.5' } }).success
    ).toBe(true);
    expect(
      getBooksByRatingSchema.safeParse({ params: { rating: 'abc' } }).success
    ).toBe(false);
  });
});
