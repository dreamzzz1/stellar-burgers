import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnect,
  wsDisconnect,
  wsMessage
} from '../../services/reducers/profile-orders';
import { getOrdersApi } from '../../utils/burger-api';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.profileOrders.orders);
  const wsConnected = useSelector((state) => state.profileOrders.wsConnected);

  useEffect(() => {
    dispatch(wsConnect());

    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  // REST fallback: if websocket is down or there are no orders, try HTTP
  useEffect(() => {
    if (!wsConnected && (!orders || orders.length === 0)) {
      getOrdersApi()
        .then((data) => {
          if (data && data.length) {
            dispatch(
              wsMessage({
                orders: data
              })
            );
          }
        })
        .catch(() => {
          // swallow: UI stays empty if request fails (user not auth or network)
        });
    }
  }, [dispatch, wsConnected, orders]);

  return <ProfileOrdersUI orders={orders} />;
};
