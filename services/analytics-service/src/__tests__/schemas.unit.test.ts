import { describe, expect, it } from '@jest/globals';
import { eventSchema, eventsSchema } from '../schemas.js';

describe('analytics schemas', () => {
  it('validates a single analytics event', () => {
    expect(
      eventSchema.safeParse({
        type: 'BOOK_ADDED',
        payload: { bookId: 'b1', pages: 300, genres: ['Fantasy'] },
      }).success
    ).toBe(true);
  });

  it('validates event batches', () => {
    expect(
      eventsSchema.safeParse({
        events: [{ type: 'READING_SESSION', payload: { minutes: 25 } }],
      }).success
    ).toBe(true);
  });

  it('rejects invalid event type and empty batch', () => {
    expect(eventSchema.safeParse({ type: 'INVALID_TYPE' }).success).toBe(false);
    expect(eventsSchema.safeParse({ events: [] }).success).toBe(false);
  });
});
