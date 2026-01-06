import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';

import { useSelector, RootState } from '../services/store';

type ProtectedRouteProps = {
  element: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  element,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const location = useLocation();

  const user = useSelector((state: RootState) => state.auth.user);

  if (onlyUnAuth && user) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
