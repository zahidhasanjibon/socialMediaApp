/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const STATUSES = Object.freeze({
    IDLE: 'idle',
    ERROR: 'error',
    LOADING: 'loading',
});

const userSlice = createSlice({
    name: 'user',
    initialState: { user: {}, status: false, isAuthenticate: false },
    extraReducers: (builder) => {
        builder
            .addCase(userRegLogin.pending, (state, action) => {
                state.status = STATUSES.LOADING;
                state.isAuthenticate = false;
                state.user = {};
            })
            .addCase(userRegLogin.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.user = action.payload;
                if (action.payload.success) {
                    state.isAuthenticate = true;
                } else {
                    state.isAuthenticate = false;
                }
            })
            .addCase(userRegLogin.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.isAuthenticate = false;
            });
    },
});
export default userSlice.reducer;

export const userRegLogin = createAsyncThunk(
    'regLog/user',
    async ({ loginData, myProfile, logout, registerData }) => {
        const url = '/api/v1/login';

        if (loginData) {
            const res = await fetch(url, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const data = await res.json();
            return data;
        }
        if (myProfile) {
            const res = await fetch('api/v1/me');
            const data = await res.json();
            return data;
        }
        if (logout) {
            const res = await fetch('api/v1/logout');
            const data = await res.json();
            return {
                success: false,
                user: null,
            };
        }
        if (registerData) {
            const res = await fetch('/api/v1/register', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });
            const data = await res.json();
            return data;
        }
    }
);
