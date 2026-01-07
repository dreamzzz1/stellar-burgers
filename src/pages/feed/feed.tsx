import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useCallback, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnect,
  wsDisconnect,
  wsMessage
} from '../../services/reducers/feed';
import { getFeedsApi } from '../../utils/burger-api';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);
  const wsConnected = useSelector((state) => state.feed.wsConnected);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGetFeeds = useCallback(() => {
    // Always attempt HTTP refresh so the button reliably updates the list.
    setLoading(true);
    getFeedsApi()
      .then((data) => {
        dispatch(wsMessage(data));
        setError(null);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('Failed to refresh feeds via REST', e);
        setError('Не удалось обновить ленту заказов');
      })
      .finally(() => setLoading(false));

    // If WebSocket is available, also (re)dispatch connect to get live updates.
    if (!wsConnected) {
      dispatch(wsConnect());
    }
  }, [dispatch, wsConnected]);

  useEffect(() => {
    dispatch(wsConnect());

    // immediate REST fallback: if no orders yet, try loading via HTTP
    if (!orders || orders.length === 0) {
      setLoading(true);
      getFeedsApi()
        .then((data) => {
          // eslint-disable-next-line no-console
          console.log('REST feed fallback data', data);
          dispatch(wsMessage(data));
          setLoading(false);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.warn('Failed to load feeds via REST on mount', e);
          setError('Не удалось загрузить ленту заказов');
          setLoading(false);
        });
    }

    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  // If websocket failed or is closed and there are no orders, fallback to REST
  useEffect(() => {
    if (!wsConnected && (!orders || orders.length === 0)) {
      getFeedsApi()
        .then((data) => {
          dispatch(wsMessage(data));
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error('Failed to load feeds via REST fallback', e);
        });
    }
  }, [wsConnected, orders, dispatch]);

  // When orders arrive, stop loading state so UI renders
  useEffect(() => {
    if (orders && orders.length > 0) {
      setLoading(false);
      setError(null);
    }
  }, [orders]);

  if (loading) return <Preloader />;

  if (error) {
    return (
      <main className='mt-10'>
        <p className='text text_type_main-default'>{error}</p>
      </main>
    );
  }

  if (!orders.length) {
    return (
      <main className='mt-10'>
        <p className='text text_type_main-default'>Заказы отсутствуют</p>
      </main>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
