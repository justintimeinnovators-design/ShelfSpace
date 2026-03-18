import { describe, expect, it } from '@jest/globals';
import {
  createForumSchema,
  createPostSchema,
  createThreadSchema,
  reactionSchema,
  updateForumSchema,
  updatePostSchema,
  updateThreadSchema,
} from '../schemas.js';

describe('forum schemas', () => {
  it('validates forum and thread creation payloads', () => {
    expect(
      createForumSchema.safeParse({ name: 'Readers Club', isPublic: true }).success
    ).toBe(true);
    expect(
      createThreadSchema.safeParse({ title: 'Welcome', content: 'Hello everyone' })
        .success
    ).toBe(true);
  });

  it('validates update payloads and reactions', () => {
    expect(updateForumSchema.safeParse({ description: 'Updated' }).success).toBe(
      true
    );
    expect(
      updateThreadSchema.safeParse({ isPinned: true, isLocked: false }).success
    ).toBe(true);
    expect(createPostSchema.safeParse({ content: 'Nice post' }).success).toBe(
      true
    );
    expect(updatePostSchema.safeParse({ content: 'Edit' }).success).toBe(true);
    expect(reactionSchema.safeParse({ type: 'LIKE' }).success).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(createForumSchema.safeParse({ name: 'ab' }).success).toBe(false);
    expect(reactionSchema.safeParse({ type: 'HEART' }).success).toBe(false);
  });
});
