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

const usersPostsSlice = createSlice({
    name: 'usersPosts',
    initialState: { posts: {}, status: false },
    extraReducers: (builder) => {
        builder
            .addCase(usersPostsFunc.pending, (state, action) => {
                state.status = STATUSES.LOADING;

                state.posts = {};
            })
            .addCase(usersPostsFunc.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.posts = action.payload.posts;
            })
            .addCase(usersPostsFunc.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
                state.posts = null;
            });
    },
});
export default usersPostsSlice.reducer;

export const usersPostsFunc = createAsyncThunk('userPostsFunc', async (id) => {
    const res = await fetch(`/api/v1/userposts/${id}`);
    const data = await res.json();
    return data;
});
