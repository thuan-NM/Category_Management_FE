import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
//     user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
//     token: localStorage.getItem('token') || null,
// };

const initialState = {
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    user: (() => {
      const userData = localStorage.getItem('user');
      try {
        return userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error("Lỗi khi parse dữ liệu user:", error);
        return null;
      }
    })(),
    token: localStorage.getItem('token') || null,
  };
  
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;

            // Lưu token vào localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;

            // Xóa token khỏi localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;