import { combineReducers } from '@reduxjs/toolkit';

import ingredients from './ingredients';
import auth from './auth';
import feed from './feed';
import profileOrders from './profile-orders';

const rootReducer = combineReducers({
  ingredients,
  auth,
  feed,
  profileOrders
});

export default rootReducer;
