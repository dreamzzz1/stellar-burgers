import ingredientsReducer, { fetchIngredients } from './ingredients';

jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredients slice', () => {
  const mockIngredients = [
    {
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
    },
    {
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
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual({
      data: [],
      isLoading: false,
      hasError: false
    });
  });

  describe('fetchIngredients async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(undefined, action);

      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
      expect(state.data).toEqual([]);
    });

    it('should handle fulfilled state', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(undefined, action);

      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(false);
      expect(state.data).toEqual(mockIngredients);
      expect(state.data).toHaveLength(2);
    });

    it('should handle rejected state', () => {
      const action = { type: fetchIngredients.rejected.type };
      const state = ingredientsReducer(undefined, action);

      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(true);
      expect(state.data).toEqual([]);
    });
  });

  it('should call getIngredientsApi', async () => {
    const { getIngredientsApi } = require('../../utils/burger-api');
    getIngredientsApi.mockResolvedValue(mockIngredients);

    const dispatch = jest.fn();
    const getState = jest.fn();

    await fetchIngredients()(dispatch, getState, undefined);

    expect(getIngredientsApi).toHaveBeenCalledTimes(1);
  });
});
