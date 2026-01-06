import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import styles from './app.module.css';

import { AppHeader } from '@components';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { ProtectedRoute } from '../protected-route';

import { useDispatch, useSelector } from '../../services/store';
import { getUser, setAuthChecked } from '../../services/reducers/auth';
import { getCookie } from '../../utils/cookie';
import { IngredientDetails } from '../ingredient-details';
import { OrderInfo } from '../order-info';
import { Modal } from '../modal';

const App = () => {
  const location = useLocation();
  const background = location.state && location.state.background;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

  useEffect(() => {
    // Only attempt to get user if there are stored tokens to avoid 401 noise
    const hasRefresh = localStorage.getItem('refreshToken');
    const hasAccess = getCookie('accessToken');
    if (hasRefresh || hasAccess) {
      dispatch(getUser());
    } else {
      dispatch(setAuthChecked());
    }
  }, [dispatch]);

  if (!isAuthChecked) {
    return null;
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />

        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={() => navigate(-1)} title={''}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:id'
            element={
              <Modal onClose={() => navigate(-1)} title={''}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:id'
            element={
              <ProtectedRoute
                element={
                  <Modal onClose={() => navigate(-1)} title={''}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
