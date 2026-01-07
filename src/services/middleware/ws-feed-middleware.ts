import { Middleware } from '@reduxjs/toolkit';
import { wsConnect, wsDisconnect, wsMessage } from '../reducers/feed';

const FEED_WS_URL = 'wss://norma.nomoreparties.space/orders/all';

export const wsFeedMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action) => {
    if (wsConnect.match(action)) {
      if (socket) {
        return next(action);
      }

      // Before trying to open WebSocket, check that HTTP endpoint is reachable.
      // This avoids noisy browser WebSocket errors when server is unreachable.
      const httpUrl = FEED_WS_URL.replace(/^wss:/i, 'https:');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      // use promise chain instead of await to avoid `await` inside non-async middleware
      try {
        return fetch(httpUrl, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store'
        })
          .then((res) => {
            clearTimeout(timeout);
            if (!res.ok) {
              store.dispatch(wsDisconnect());
              return next(action);
            }

            // http endpoint ok -> try opening websocket
            try {
              socket = new WebSocket(FEED_WS_URL);

              socket.onmessage = (event) => {
                try {
                  const data = JSON.parse(event.data);
                  store.dispatch(
                    wsMessage({
                      orders: data.orders,
                      total: data.total,
                      totalToday: data.totalToday
                    })
                  );
                } catch (e) {
                  // ignore malformed messages
                }
              };

              socket.onerror = (_e) => {
                if (socket) {
                  store.dispatch(wsDisconnect());
                  try {
                    socket.close();
                  } catch (ignore) {
                    // ignore
                  }
                  socket = null;
                }
              };

              socket.onclose = () => {
                if (socket) {
                  store.dispatch(wsDisconnect());
                  socket = null;
                }
              };
            } catch (err) {
              store.dispatch(wsDisconnect());
              socket = null;
            }

            return next(action);
          })
          .catch((_err) => {
            clearTimeout(timeout);
            store.dispatch(wsDisconnect());
            return next(action);
          });
      } catch (_e) {
        clearTimeout(timeout);
        store.dispatch(wsDisconnect());
        return next(action);
      }
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
