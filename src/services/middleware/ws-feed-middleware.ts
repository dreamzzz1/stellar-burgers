import { Middleware } from '@reduxjs/toolkit';
import { wsConnect, wsDisconnect, wsMessage } from '../reducers/feed';

const FEED_WS_URL = 'wss://norma.nomoreparties.space/orders/all';

export const wsFeedMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action) => {
    if (wsConnect.match(action)) {
      socket = new WebSocket(FEED_WS_URL);

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        store.dispatch(
          wsMessage({
            orders: data.orders,
            total: data.total,
            totalToday: data.totalToday
          })
        );
      };
    }

    if (wsDisconnect.match(action)) {
      if (socket) {
        socket.close();
        socket = null;
      }
    }

    return next(action);
  };
};
