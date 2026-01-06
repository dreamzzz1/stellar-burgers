import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { clearConstructor } from './constructor';

type OrdersState = {
  order: TOrder | null;
  orderModalData: TOrder | null;
  isLoading: boolean;
  hasError: boolean;
};

const initialState: OrdersState = {
  order: null,
  orderModalData: null,
  isLoading: false,
  hasError: false
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ids: string[], thunkAPI) => {
    const res = await orderBurgerApi(ids);
    // on success, clear constructor
    thunkAPI.dispatch(clearConstructor());
    return res.order as TOrder;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderModalData: (state, action: { payload: TOrder | null }) => {
      state.orderModalData = action.payload;
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order = action.payload;
        state.orderModalData = action.payload;
        state.isLoading = false;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  }
});

export const { setOrderModalData, clearOrderModal } = ordersSlice.actions;

export default ordersSlice.reducer;
