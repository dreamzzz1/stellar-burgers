import { FC, useMemo, useEffect, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(
    (state) => state.ingredients.data
  ) as TIngredient[];
  const feedOrders = useSelector((state) => state.feed.orders) as TOrder[];
  const profileOrders = useSelector(
    (state) => state.profileOrders.orders
  ) as TOrder[];

  const [orderData, setOrderData] = useState<TOrder | null>(null);

  useEffect(() => {
    if (!id) return;
    // id from URL is order number
    const num = Number(id);
    const findInFeed =
      feedOrders.find((o) => o.number === num) ||
      profileOrders.find((o) => o.number === num);
    if (findInFeed) {
      setOrderData(findInFeed);
      return;
    }

    (async () => {
      try {
        const res = await getOrderByNumberApi(num);
        if (res && res.orders && res.orders.length) setOrderData(res.orders[0]);
      } catch (e) {
        // ignore
      }
    })();
  }, [id, feedOrders, profileOrders]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = (
      Object.values(ingredientsInfo) as (TIngredient & {
        count: number;
      })[]
    ).reduce((acc, item) => acc + item.price * item.count, 0);

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
