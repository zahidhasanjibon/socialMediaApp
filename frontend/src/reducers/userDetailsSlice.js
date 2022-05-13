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

const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState: { user: {}, statusOfUserDetails: false, isAuthenticate: false },
    extraReducers: (builder) => {
        builder
            .addCase(userDetails.pending, (state, action) => {
                state.statusOfUserDetails = STATUSES.LOADING;
                state.isAuthenticate = false;
                state.user = null;
            })
            .addCase(userDetails.fulfilled, (state, action) => {
                state.statusOfUserDetails = STATUSES.IDLE;
                state.user = action.payload;
                if (action.payload.success) {
                    state.isAuthenticate = true;
                } else {
                    state.isAuthenticate = false;
                }
            })
            .addCase(userDetails.rejected, (state, action) => {
                state.statusOfUserDetails = STATUSES.ERROR;
                state.isAuthenticate = false;
                state.user = null;
            });
    },
});
export default userDetailsSlice.reducer;

export const userDetails = createAsyncThunk('userDetails', async () => {
    const res = await fetch('api/v1/me');
    const data = await res.json();
    return data;
});
