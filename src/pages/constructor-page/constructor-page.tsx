import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/reducers/ingredients';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';

export const ConstructorPage = () => {
  const dispatch = useDispatch();

  const { data, isLoading, hasError } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (hasError) {
    return (
      <p className="text text_type_main-default">
        Ошибка загрузки ингредиентов
      </p>
    );
  }

  return (
    <main className={styles.main}>
      <BurgerIngredients />
      <BurgerConstructor />
    </main>
  );
};
