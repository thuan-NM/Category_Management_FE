import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
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

            // Optionally save to localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;

            // Clear from localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;