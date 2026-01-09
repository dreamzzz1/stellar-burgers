import rootReducer from './index';

describe('rootReducer', () => {
  it('should return initial state for unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(typeof state).toBe('object');

    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('profileOrders');

    expect(Object.keys(state)).not.toContain('constructor');
  });

  it('should return correct initial state structure', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(state.ingredients).toBeDefined();
    expect(state.orders).toBeDefined();
    expect(state.auth).toBeDefined();
    expect(state.feed).toBeDefined();
    expect(state.profileOrders).toBeDefined();
  });

  it('should not throw on unknown action', () => {
    expect(() => {
      rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    }).not.toThrow();
  });
});
