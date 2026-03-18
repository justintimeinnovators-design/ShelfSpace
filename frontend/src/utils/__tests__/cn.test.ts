import { cn } from '@/utils/cn';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('p-2', 'text-sm')).toBe('p-2 text-sm');
  });

  it('resolves conflicting tailwind classes with last one winning', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
