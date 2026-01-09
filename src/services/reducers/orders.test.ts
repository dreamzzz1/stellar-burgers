import ordersReducer, {
  createOrder,
  setOrderModalData,
  clearOrderModal
} from './orders';
import { clearConstructor } from './constructor';

jest.mock('../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn()
}));

describe('orders slice', () => {
  const mockOrder = {
    _id: '123',
    ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7'],
    status: 'done',
    name: 'Space бургер',
    createdAt: '2021-06-23T14:43:22.587Z',
    updatedAt: '2021-06-23T14:43:22.587Z',
    number: 12345
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(ordersReducer(undefined, { type: '' })).toEqual({
      order: null,
      orderModalData: null,
      isLoading: false,
      hasError: false
    });
  });

  it('should handle setOrderModalData', () => {
    const action = setOrderModalData(mockOrder);
    const state = ordersReducer(undefined, action);

    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.isLoading).toBe(false);
    expect(state.hasError).toBe(false);
  });

  it('should handle clearOrderModal', () => {
    let state = ordersReducer(undefined, setOrderModalData(mockOrder));
    expect(state.orderModalData).toEqual(mockOrder);

    state = ordersReducer(state, clearOrderModal());

    expect(state.orderModalData).toBeNull();
  });

  describe('createOrder async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: createOrder.pending.type };
      const state = ordersReducer(undefined, action);

      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(false);
    });

    it('should handle fulfilled state', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = ordersReducer(undefined, action);

      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('should handle rejected state', () => {
      const action = { type: createOrder.rejected.type };
      const state = ordersReducer(undefined, action);

      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(true);
    });
  });

  it('should dispatch clearConstructor on successful order creation', async () => {
    const { orderBurgerApi } = require('../../utils/burger-api');
    orderBurgerApi.mockResolvedValue({ order: mockOrder });

    const dispatch = jest.fn();
    const getState = jest.fn();

    await createOrder(['id1', 'id2'])(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(clearConstructor());
  });
});
