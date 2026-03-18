import { parseBookSlug, toBookSlug } from '@/lib/book-slug';

describe('book-slug helpers', () => {
  it('creates slug with title and id', () => {
    expect(toBookSlug({ id: 'abc123', title: 'The Midnight Library' })).toBe(
      'the-midnight-library--abc123'
    );
  });

  it('falls back when title is empty', () => {
    expect(toBookSlug({ id: 'abc123', title: '' })).toBe('book--abc123');
  });

  it('parses slug into id and titlePart', () => {
    expect(parseBookSlug('atomic-habits--id-42')).toEqual({
      id: 'id-42',
      titlePart: 'atomic-habits',
    });
  });

  it('treats raw id as slug when separator is missing', () => {
    expect(parseBookSlug('only-id')).toEqual({ id: 'only-id', titlePart: '' });
  });
});
