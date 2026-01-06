import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/reducers/orders';
import { clearOrderModal } from '../../services/reducers/orders';

export const BurgerConstructor: FC = () => {
  const constructorItems = (useSelector((state) => state.burgerConstructor) as {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  }) || { bun: null, ingredients: [] };

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orderRequest, setOrderRequest] = useState(false);
  const orderModalData = useSelector((state) => state.orders.orderModalData);

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const ids = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    setOrderRequest(true);
    try {
      await dispatch(createOrder(ids));
    } finally {
      setOrderRequest(false);
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = (constructorItems.ingredients ?? []).reduce(
      (s: number, v: TConstructorIngredient) => s + v.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
