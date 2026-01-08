import { combineReducers } from '@reduxjs/toolkit';

import ingredients from './ingredients';
import auth from './auth';
import feed from './feed';
import profileOrders from './profile-orders';
import constructor from './constructor';
import orders from './orders';

const rootReducer = combineReducers({
  ingredients,
  auth,
  feed,
  profileOrders,
  // Avoid using the reserved word/object property name `constructor` as a reducer key.
  // Use `burgerConstructor` to store constructor slice state to prevent prototype collisions.
  burgerConstructor: constructor,
  orders
});

export default rootReducer;
