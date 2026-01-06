import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './reducers';
import { wsFeedMiddleware } from './middleware/ws-feed-middleware';
import { wsProfileOrdersMiddleware } from './middleware/ws-profile-orders-middleware';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wsFeedMiddleware, wsProfileOrdersMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook<AppDispatch>();

export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
