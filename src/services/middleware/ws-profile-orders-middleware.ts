import { Middleware } from '@reduxjs/toolkit';
import {
  wsConnect,
  wsDisconnect,
  wsMessage
} from '../reducers/profile-orders';

import { getCookie } from '../../utils/cookie';

const WS_PROFILE_ORDERS_URL =
  'wss://norma.nomoreparties.space/orders';

export const wsProfileOrdersMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action) => {
    if (wsConnect.match(action)) {
      const accessToken = getCookie('accessToken');

      if (!accessToken) {
        return next(action);
      }

      const token = accessToken.replace('Bearer ', '');

      socket = new WebSocket(
        `${WS_PROFILE_ORDERS_URL}?token=${token}`
      );

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        store.dispatch(
          wsMessage({
            orders: data.orders
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
