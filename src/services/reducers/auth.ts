import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { deleteCookie } from '../../utils/cookie';

type TUser = {
  email: string;
  name: string;
};

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false
};

export const login = createAsyncThunk('auth/login', loginUserApi);

export const register = createAsyncThunk('auth/register', registerUserApi);

export const getUser = createAsyncThunk('auth/getUser', getUserApi);

export const updateUser = createAsyncThunk('auth/updateUser', updateUserApi);

export const logout = createAsyncThunk('auth/logout', logoutApi);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        // remove tokens on logout
        try {
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        } catch (e) {
          // ignore
        }
      });
  }
});

export default authSlice.reducer;
export const { setAuthChecked } = authSlice.actions;
