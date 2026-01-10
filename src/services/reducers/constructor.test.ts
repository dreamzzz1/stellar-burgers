import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructor';

describe('constructor slice', () => {
  const mockIngredient = {
    _id: '60d3b41abdacab0026a733c6',
    name: 'Краторная булка N-200i',
    type: 'bun' as const,
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  };

  const mockMainIngredient = {
    _id: '60d3b41abdacab0026a733c7',
    name: 'Флюоресцентная булка R2-D3',
    type: 'main' as const,
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
    __v: 0
  };

  it('should return initial state', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('should handle addBun', () => {
    const action = addBun(mockIngredient);
    const state = constructorReducer(undefined, action);

    expect(state.bun).toEqual({
      ...mockIngredient,
      id: mockIngredient._id
    });
    expect(state.ingredients).toEqual([]);
  });

  it('should handle addIngredient', () => {
    const action = addIngredient(mockMainIngredient);
    const state = constructorReducer(undefined, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      ...mockMainIngredient,
      id: expect.any(String)
    });
  });

  it('should handle removeIngredient', () => {
    const addAction = addIngredient(mockMainIngredient);
    let state = constructorReducer(undefined, addAction);

    const ingredientId = state.ingredients[0].id;

    const removeAction = removeIngredient(ingredientId);
    state = constructorReducer(state, removeAction);

    expect(state.ingredients).toHaveLength(0);
  });

  it('should handle moveIngredient', () => {
    const ingredient1 = { ...mockMainIngredient, _id: '1' };
    const ingredient2 = { ...mockMainIngredient, _id: '2' };

    let state = constructorReducer(undefined, addIngredient(ingredient1));
    state = constructorReducer(state, addIngredient(ingredient2));

    const moveAction = moveIngredient({ from: 0, to: 1 });
    state = constructorReducer(state, moveAction);

    expect(state.ingredients[0]._id).toBe('2');
    expect(state.ingredients[1]._id).toBe('1');
  });

  it('should handle clearConstructor', () => {
    let state = constructorReducer(undefined, addBun(mockIngredient));
    state = constructorReducer(state, addIngredient(mockMainIngredient));

    const clearAction = clearConstructor();
    state = constructorReducer(state, clearAction);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
