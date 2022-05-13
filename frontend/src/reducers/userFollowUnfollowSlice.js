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

const userFollowSlice = createSlice({
    name: 'userFollowUnfollow',
    initialState: { message: {}, status: false },
    extraReducers: (builder) => {
        builder
            .addCase(userFollowFunc.pending, (state, action) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(userFollowFunc.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.message = action.payload;
            })
            .addCase(userFollowFunc.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
            });
    },
});
export default userFollowSlice.reducer;

export const userFollowFunc = createAsyncThunk('userFollowFunc', async (id) => {
    const res = await fetch(`/api/v1/follow/${id}`);
    const data = await res.json();
    return data;
});
