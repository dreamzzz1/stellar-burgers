import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnect,
  wsDisconnect
} from '../../services/reducers/profile-orders';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(
    (state) => state.profileOrders.orders
  );

  useEffect(() => {
    dispatch(wsConnect());

    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
