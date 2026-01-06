import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnect,
  wsDisconnect
} from '../../services/reducers/feed';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);

  const handleGetFeeds = useCallback(() => {
    dispatch(wsConnect());
  }, [dispatch]);

  useEffect(() => {
    dispatch(wsConnect());

    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={handleGetFeeds}
    />
  );
};
