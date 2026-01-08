import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';

type ProfileOrdersState = {
  orders: TOrder[];
  wsConnected: boolean;
};

const initialState: ProfileOrdersState = {
  orders: [],
  wsConnected: false
};

type WsMessage = {
  orders: TOrder[];
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    wsConnect: (state) => {
      state.wsConnected = true;
    },
    wsDisconnect: (state) => {
      state.wsConnected = false;
    },
    wsMessage: (state, action: PayloadAction<WsMessage>) => {
      state.orders = action.payload.orders;
    }
  }
});

export const { wsConnect, wsDisconnect, wsMessage } =
  profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;
