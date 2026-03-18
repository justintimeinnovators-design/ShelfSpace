import {
  StateValidationError,
  validateChatState,
  validateDashboardState,
  validateLibraryState,
  validateNavigationState,
  validateState,
} from '@/utils/stateValidation';

describe('stateValidation', () => {
  it('validates supported library state', () => {
    expect(() =>
      validateLibraryState({
        viewMode: 'grid',
        filters: { sortOrder: 'asc' } as any,
        selectedBooks: [],
      })
    ).not.toThrow();
  });

  it('throws for invalid library view mode', () => {
    expect(() => validateLibraryState({ viewMode: 'table' as any })).toThrow(
      StateValidationError
    );
  });

  it('throws for invalid library sort order', () => {
    expect(() =>
      validateLibraryState({ filters: { sortOrder: 'up' } as any })
    ).toThrow('Invalid sort order');
  });

  it('throws when selectedBooks is not an array', () => {
    expect(() => validateLibraryState({ selectedBooks: 'x' as any })).toThrow(
      'Selected books must be an array'
    );
  });

  it('throws for invalid dashboard refresh interval', () => {
    expect(() => validateDashboardState({ refreshInterval: -1 as any })).toThrow(
      'Refresh interval must be a positive number'
    );
  });

  it('throws for invalid dashboard boolean preference', () => {
    expect(() =>
      validateDashboardState({ preferences: { showStats: 'yes' } as any })
    ).toThrow('showStats must be a boolean');
  });

  it('throws for invalid chat mode', () => {
    expect(() => validateChatState({ chatMode: 'dm' as any })).toThrow(
      'Invalid chat mode'
    );
  });

  it('throws for invalid chat messages payload', () => {
    expect(() => validateChatState({ messages: 'bad' as any })).toThrow(
      'Messages must be an array'
    );
  });

  it('throws for invalid inputMessage type', () => {
    expect(() => validateChatState({ inputMessage: 99 as any })).toThrow(
      'Input message must be a string'
    );
  });

  it('throws for invalid navigation collapsed type', () => {
    expect(() => validateNavigationState({ isCollapsed: 'yes' as any })).toThrow(
      'isCollapsed must be a boolean'
    );
  });

  it('throws for invalid activeTab type', () => {
    expect(() => validateNavigationState({ activeTab: 123 as any })).toThrow(
      'Active tab must be a string'
    );
  });

  it('throws for invalid navigation preference boolean', () => {
    expect(() =>
      validateNavigationState({ preferences: { compactMode: 'no' } as any })
    ).toThrow('compactMode must be a boolean');
  });

  it('rethrows StateValidationError from validateState', () => {
    expect(() =>
      validateState({ viewMode: 'invalid' as any }, validateLibraryState as any)
    ).toThrow(StateValidationError);
  });

  it('wraps unknown errors as StateValidationError', () => {
    expect(() =>
      validateState({}, () => {
        throw new Error('boom');
      })
    ).toThrow('Unknown validation error');
  });
});
