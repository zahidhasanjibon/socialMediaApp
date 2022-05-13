/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUSES } from './userSlice';

const updateProfileSlice = createSlice({
    name: 'updateProfile',
    initialState: {
        userData: {},
        status: false,
        isUpdated: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfileFunc.pending, (state, action) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(updateProfileFunc.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.userData = action.payload;
                if (action.payload.success) {
                    state.isUpdated = true;
                } else {
                    state.isUpdated = false;
                }
            })
            .addCase(updateProfileFunc.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.isUpdated = false;
            });
    },
});

export default updateProfileSlice.reducer;

export const updateProfileFunc = createAsyncThunk(
    'update/profile',
    async ({
        updateProfileData,
        reset,
        updatePasswordData,
        deleteProfile,
        forgotPasswordEmail,
        resetPasswordData,
        token,
    }) => {
        if (updateProfileData) {
            const url = `/api/v1/update/profile`;

            const res = await fetch(url, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateProfileData),
            });
            const data = await res.json();
            return data;
        }

        if (updatePasswordData) {
            const url = `/api/v1/update/password`;

            const res = await fetch(url, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePasswordData),
            });
            const data = await res.json();
            return data;
        }

        if (deleteProfile) {
            const res = await fetch(`/api/v1/delete/me`, {
                method: 'DELETE',
            });
            const data = await res.json();
            return data;
        }
        if (forgotPasswordEmail) {
            const res = await fetch('/api/v1/forgot/password', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotPasswordEmail }),
            });
            const data = await res.json();
            return data;
        }
        if (resetPasswordData && token) {
            const url = `/api/v1/password/reset/${token}`;
            const res = await fetch(url, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resetPasswordData),
            });
            const data = await res.json();
            return data;
        }

        if (reset) {
            return { success: false, user: null };
        }
    }
);
