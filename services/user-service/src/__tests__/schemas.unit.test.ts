import {
  createUserSchema,
  updatePreferencesSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from '../schemas.js';

describe('schemas (unit)', () => {
  it('validates create user payload', () => {
    expect(
      createUserSchema.safeParse({ email: 'x@example.com', name: 'X' }).success
    ).toBe(true);
  });

  it('rejects invalid create user payload', () => {
    expect(createUserSchema.safeParse({ email: 'bad', name: '' }).success).toBe(
      false
    );
  });

  it('validates update user payload fields', () => {
    expect(
      updateUserSchema.safeParse({
        name: 'Name',
        avatarUrl: 'https://example.com/a.png',
        website: 'https://example.com',
        isPublic: true,
      }).success
    ).toBe(true);
  });

  it('rejects invalid URL fields in update user payload', () => {
    expect(updateUserSchema.safeParse({ avatarUrl: 'not-url' }).success).toBe(
      false
    );
    expect(updateUserSchema.safeParse({ website: 'not-url' }).success).toBe(
      false
    );
  });

  it('validates update preferences payload', () => {
    expect(
      updatePreferencesSchema.safeParse({
        theme: 'DARK',
        defaultSortOrder: 'ALPHABETICAL',
        defaultViewMode: 'CARD',
        compactMode: false,
      }).success
    ).toBe(true);
  });

  it('rejects invalid preference enums', () => {
    expect(updatePreferencesSchema.safeParse({ theme: 'BLUE' }).success).toBe(
      false
    );
    expect(
      updatePreferencesSchema.safeParse({ defaultViewMode: 'GRID' }).success
    ).toBe(false);
  });

  it('validates user status transitions', () => {
    expect(updateUserStatusSchema.safeParse({ status: 'ACTIVE' }).success).toBe(
      true
    );
    expect(updateUserStatusSchema.safeParse({ status: 'UNKNOWN' }).success).toBe(
      false
    );
  });
});
