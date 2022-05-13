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

const usersProfileSlice = createSlice({
    name: 'usersProfile',
    initialState: { user: {}, status: false },
    extraReducers: (builder) => {
        builder
            .addCase(usersProfileFunc.pending, (state, action) => {
                state.status = STATUSES.LOADING;

                state.user = {};
            })
            .addCase(usersProfileFunc.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.user = action.payload.user;
            })
            .addCase(usersProfileFunc.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.user = null;
            });
    },
});
export default usersProfileSlice.reducer;

export const usersProfileFunc = createAsyncThunk('userProfileFunc', async (id) => {
    const res = await fetch(`/api/v1/user/${id}`);
    const data = await res.json();
    return data;
});
