import { describe, expect, it } from '@jest/globals';
import { createMessageSchema } from '../schemas.js';

describe('chat schemas', () => {
  it('accepts valid message', () => {
    expect(
      createMessageSchema.safeParse({ groupId: 'group-1', content: 'Hello' }).success
    ).toBe(true);
  });

  it('rejects empty content', () => {
    expect(
      createMessageSchema.safeParse({ groupId: 'group-1', content: '' }).success
    ).toBe(false);
  });
});
